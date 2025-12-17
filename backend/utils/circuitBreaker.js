/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures by stopping execution after a threshold of failures.
 */
class CircuitBreaker {
    constructor(name, options = {}) {
        this.name = name;
        this.failureThreshold = options.failureThreshold || 5; // Failures before opening
        this.failureWindow = options.failureWindow || 30000; // 30s window
        this.cooldownPeriod = options.cooldownPeriod || 60000; // 60s cooldown

        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.failures = []; // Array of timestamps
        this.nextAttempt = 0; // Timestamp when we can try again
    }

    async execute(action) {
        if (this.state === 'OPEN') {
            if (Date.now() >= this.nextAttempt) {
                this.state = 'HALF_OPEN';
                console.log(`[CircuitBreaker] ${this.name} entering HALF_OPEN state. Testing...`);
            } else {
                const remaining = Math.ceil((this.nextAttempt - Date.now()) / 1000);
                throw new Error(`Circuit Breaker '${this.name}' is OPEN. Cooling down. Retry in ${remaining}s.`);
            }
        }

        try {
            const result = await action();
            // Success
            this._onSuccess();
            return result;
        } catch (error) {
            this._onFailure(error);
            throw error;
        }
    }

    _onSuccess() {
        if (this.state === 'HALF_OPEN') {
            console.log(`[CircuitBreaker] ${this.name} recovery successful. Closing circuit.`);
            this.state = 'CLOSED';
            this.failures = [];
        }
        // In CLOSED state, we could optionally clear old failures, but rolling window handles it.
    }

    _onFailure(error) {
        const now = Date.now();
        console.warn(`[CircuitBreaker] ${this.name} failure recorded: ${error.message}`);

        if (this.state === 'HALF_OPEN') {
            // Failed immediately in trial -> Re-open
            console.error(`[CircuitBreaker] ${this.name} recovery FAILED. Re-opening circuit.`);
            this.state = 'OPEN';
            this.nextAttempt = now + this.cooldownPeriod;
            return;
        }

        // Add failure timestamp
        this.failures.push(now);
        this._cleanOldFailures(now);

        if (this.failures.length >= this.failureThreshold) {
            this.state = 'OPEN';
            this.nextAttempt = now + this.cooldownPeriod;
            console.error(`[CircuitBreaker] ${this.name} threshold reached (${this.failures.length} fails). OPENING circuit for ${this.cooldownPeriod}ms.`);

            // TODO: Trigger Feature Flag disable here if needed via callback
            if (this.onTrip) {
                this.onTrip(this.name);
            }
        }
    }

    _cleanOldFailures(now) {
        // Remove failures older than the window
        this.failures = this.failures.filter(timestamp => now - timestamp <= this.failureWindow);
    }
}

module.exports = CircuitBreaker;
