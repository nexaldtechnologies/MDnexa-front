const { GoogleGenerativeAI } = require('@google/generative-ai');
const CircuitBreaker = require('./circuitBreaker');
const featureFlags = require('./featureFlags');

/**
 * RobustGeminiClient - Bulletproof Edition
 * Wraps GoogleGenerativeAI with:
 * 1. Circuit Breakers (Fast Fail)
 * 2. Feature Flags (Auto-Disable)
 * 3. Multi-Key Rotation
 * 4. Multi-Stage Fallback
 * 5. Retries & Timeouts
 */
class RobustGeminiClient {
    constructor() {
        this.keys = [];
        this.currentKeyIndex = 0;

        // Model Priority Queue
        this.models = [
            process.env.MODEL_NAME || 'gemini-2.0-flash-exp',
            'gemini-1.5-pro',
            'gemini-1.5-flash'
        ];

        // Circuit Breakers per feature type
        this.breakers = {
            'Chat': new CircuitBreaker('Chat', { failureThreshold: 5, cooldownPeriod: 60000 }),
            'Content': new CircuitBreaker('Content', { failureThreshold: 5, cooldownPeriod: 60000 })
        };

        // Hook up Auto-Disable
        Object.values(this.breakers).forEach(breaker => {
            breaker.onTrip = (name) => {
                const featureName = name.toLowerCase(); // 'chat' or 'content'
                featureFlags.disableFeature(featureName, 'Circuit Breaker Tripped (Too many failures)');
            };
        });

        // Load keys
        if (process.env.GEMINI_API_KEY) this.keys.push(process.env.GEMINI_API_KEY);
        if (process.env.GEMINI_API_KEY_SECONDARY) this.keys.push(process.env.GEMINI_API_KEY_SECONDARY);

        if (this.keys.length === 0) {
            console.warn("RobustGeminiClient: No API Keys found!");
        } else {
            console.log(`RobustGeminiClient: Initialized with ${this.keys.length} key(s). Model Hierarchy: ${this.models.join(' -> ')}`);
        }
    }

    _getClient() {
        if (this.keys.length === 0) throw new Error("No API Keys available");
        const key = this.keys[this.currentKeyIndex];
        return new GoogleGenerativeAI(key);
    }

    _rotateKey() {
        if (this.keys.length <= 1) return false;

        const oldIndex = this.currentKeyIndex;
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
        console.warn(`[Gemini] Switching API Key from index ${oldIndex} to ${this.currentKeyIndex}`);
        return true;
    }

    /**
     * Master Execution Wrapper
     * Layers: Feature Flag -> Circuit Breaker -> Retry Loop (Keys/Models)
     */
    async _executeWithRetry(operationName, operationFn, featureFlagName) {
        // 1. Check Feature Flag
        const isEnabled = await featureFlags.isEnabled(featureFlagName);
        if (!isEnabled) {
            throw new Error(`Feature '${featureFlagName}' is currently disabled due to high error rates.`);
        }

        // 2. Circuit Breaker
        const breaker = this.breakers[operationName];
        if (!breaker) {
            throw new Error(`No circuit breaker defined for operation: ${operationName}`);
        }

        return breaker.execute(async () => {
            // 3. Retry Loop (The original logic)
            let currentModelIndex = 0;
            let attempts = 0;
            const maxAttemptsTotal = 10; // Safety break

            while (attempts < maxAttemptsTotal) {
                attempts++;
                const currentModelName = this.models[currentModelIndex];

                try {
                    // Execute the specific operation (chat or content)
                    return await operationFn(currentModelName);

                } catch (error) {
                    console.error(`[Gemini ${operationName} Error] (Model: ${currentModelName}):`, error.message);

                    const isRateLimit = error.message.includes('429') || error.message.includes('403') || error.status === 429;
                    const isModelError = error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('404') || error.message.includes('not found');
                    const isTimeout = error.message.includes('timed out');
                    const isNetworkError = this._isRetryableError(error);

                    // STRATEGY 1: API KEY ROTATION (For Rate Limits)
                    if (isRateLimit) {
                        const rotated = this._rotateKey();
                        if (rotated) {
                            console.log("[Gemini] Rate limit hit. Retrying with NEW KEY immediately...");
                            continue;
                        }
                        // If no key to rotate, we might fall through to model switch or retry wait
                    }

                    // STRATEGY 2: MODEL FALLBACK (For Overload, NotFound, or persistent 500s)
                    if (isModelError || isTimeout || (isRateLimit && this.keys.length === 1)) {
                        // Try next model if available
                        if (currentModelIndex < this.models.length - 1) {
                            currentModelIndex++;
                            console.warn(`[Gemini] Model ${currentModelName} failing. FALLING BACK to: ${this.models[currentModelIndex]}`);
                            continue;
                        }
                    }

                    // STRATEGY 3: GENERIC RETRY (Exponential Backoff)
                    // If it's a network blip or we are out of models but want to retry the last one
                    if (isNetworkError || isModelError || isRateLimit) {
                        const waitTime = Math.pow(2, attempts) * 1000; // 2s, 4s...
                        if (waitTime > 10000) break; // Don't wait too long

                        console.log(`[Gemini] Waiting ${waitTime}ms before retry...`);
                        await new Promise(r => setTimeout(r, waitTime));
                        continue;
                    }

                    // Unrecoverable
                    throw error;
                }
            }
            throw new Error(`Failed to generate ${operationName} after multiple attempts.`);
        });
    }

    // --- PUBLIC METHODS ---

    async generateMessage({ message, history, systemInstruction, temperature = 0.7, maxOutputTokens = 4096 }) {
        return this._executeWithRetry('Chat', async (modelName) => {
            const genAI = this._getClient();
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: { parts: [{ text: systemInstruction }] }
            });

            const chat = model.startChat({
                history: history,
                generationConfig: { maxOutputTokens, temperature }
            });

            const result = await this._withTimeout(
                chat.sendMessage(message),
                30000,
                'Chat generation timed out'
            );

            return { text: result.response.text(), model: modelName };
        }, 'chat');
    }

    async generateContent({ contents, systemInstruction, generationConfig, featureName = 'dictionary' }) {
        return this._executeWithRetry('Content', async (modelName) => { // Using 'Content' breaker
            const genAI = this._getClient();
            const config = { ...generationConfig };

            const modelParams = { model: modelName };
            if (systemInstruction) modelParams.systemInstruction = systemInstruction;

            const model = genAI.getGenerativeModel(modelParams);

            const result = await this._withTimeout(
                model.generateContent({
                    contents: contents,
                    generationConfig: config
                }),
                30000,
                'Content generation timed out'
            );

            return { result, model: modelName };
        }, featureName);
    }

    // --- HELPERS ---

    _isRetryableError(error) {
        const msg = error.message || '';
        return msg.includes('fetch failed') || msg.includes('500') || msg.includes('502') || msg.includes('503') || msg.includes('504');
    }

    async _withTimeout(promise, ms, errorMsg) {
        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
                reject(new Error(errorMsg || 'Operation timed out'));
            }, ms);
        });

        try {
            const result = await Promise.race([promise, timeoutPromise]);
            clearTimeout(timeoutId);
            return result;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
}

module.exports = new RobustGeminiClient();
