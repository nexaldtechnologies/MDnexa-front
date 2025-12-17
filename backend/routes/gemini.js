const express = require('express');
const robustGemini = require('../utils/robustGemini');
const router = express.Router();

// Helper for Audio Decoding (if needed, but here we process text-to-speech)
// Text-to-Speech Endpoint
router.post('/speech', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: 'Text is required' });

        // Truncate for safety
        const safeText = text.slice(0, 4500);

        // Usage via Robust Client (Note: Fallback model might not support Audio, but primary 2.0 does)
        const { result } = await robustGemini.generateContent({
            featureName: 'speech',
            contents: [{ parts: [{ text: safeText }] }],
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Charon' },
                    },
                },
            }
        });

        const base64Audio = result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) throw new Error("No audio data generated");

        res.json({ audioData: base64Audio });
    } catch (error) {
        console.error('Speech Generation Error:', error);
        res.status(500).json({ error: error.message || 'Failed to generate speech' });
    }
});

// Transcription Endpoint
router.post('/transcribe', async (req, res) => {
    try {
        const { audioBase64, mimeType, languageCode } = req.body;
        if (!audioBase64) return res.status(400).json({ error: 'Audio data required' });

        const { result } = await robustGemini.generateContent({
            featureName: 'transcription',
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            inlineData: {
                                mimeType: mimeType || 'audio/wav',
                                data: audioBase64
                            }
                        },
                        {
                            text: `ROLE: Expert Medical Transcriptionist.
TASK: Transcribe the audio verbatim. 
LANG: ${languageCode || 'en-US'}.
RULES:
1. Capture EXACT medical terminology, drug names, and dosages.
2. Do NOT paraphrase or summarize. Write exactly what is said.
3. If background noise is present, focus only on the voice.
4. Use correct capitalization for proprietary drug names.
5. If a term is ambiguous, use the most likely clinical spelling based on context.`
                        }
                    ]
                }
            ]
        });

        const text = result.response.text();
        res.json({ text });
    } catch (error) {
        console.error('Transcription Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Medical Lookup Endpoint
router.post('/lookup', async (req, res) => {
    try {
        const { term, region, language } = req.body;

        const { result } = await robustGemini.generateContent({
            featureName: 'dictionary',
            contents: [{
                role: 'user',
                parts: [{
                    text: `Define the medical term "${term}". 
       CONTEXT: Medical Dictionary for Clinicians (${region || 'International'}).
       TARGET_LANGUAGE_CODE: ${language || 'en-US'}.
       
       INSTRUCTIONS:
       1. TRANSLATE the term name/title into the target language specified by ${language}.
       2. Provide the definition and context strictly in the target language.
       
       FORMAT:
       ## [Translated Term Name]
       **Definition**: [Precise clinical definition in target language]
       
       **Clinical Context**: [Brief pathophysiology or relevance in target language]
       
       **Key Points**:
       - [Bullet 1 in target language]
       - [Bullet 2 in target language]
       
       Keep it structured, concise, and professional. No conversational filler.`
                }]
            }]
        });

        res.json({ text: result.response.text() });
    } catch (error) {
        console.error('Lookup Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Related Questions Endpoint
router.post('/related', async (req, res) => {
    try {
        const { lastMessage, lastResponse, userRole, language } = req.body;

        const { result } = await robustGemini.generateContent({
            featureName: 'related_questions',
            generationConfig: { responseMimeType: 'application/json' },
            contents: [{
                role: 'user',
                parts: [{
                    text: `TASK: Generate 2 short, clinically relevant, but LOGICALLY DIVERSE follow-up questions.
            CONTEXT: User is a ${userRole}. Language: ${language} (Match this language strictly).
            USER QUESTION: "${lastMessage.substring(0, 200)}"
            AI ANSWER: "${lastResponse.substring(0, 200)}"
            
            RULES:
            1. Questions must be brief (max 6-8 words).
            2. DIVERSITY & CREATIVITY: 
               - Q1 MUST focus on: Management / Treatment / Dosage / Guidelines.
               - Q2 MUST focus on: Differential Diagnosis / Complications / Pathophysiology / Red Flags.
               - The questions MUST cover COMPLETELY different aspects.
            3. ROLE: Questions should sound like they come from a ${userRole}.
            4. LANGUAGE: Must be in ${language}. Ensure natural phrasing in ${language}. 
               - DO NOT translate literally from English structure. 
               - Use idiomatic medical phrasing for ${language}.
               - AVOID repeating the same starting words (e.g., "What is...", "How to..."). VARY the sentence structure.
            5. OUTPUT: Strictly a JSON array of 2 strings.`
                }]
            }]
        });

        const text = result.response.text();
        res.json(JSON.parse(text)); // Return parsed JSON directly
    } catch (error) {
        console.error('Related Questions Error:', error);
        // Fallback to empty array
        res.json([]);
    }
});

module.exports = router;
