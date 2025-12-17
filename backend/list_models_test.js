require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Just to init
        // Actually there isn't a direct listModels on the client instance in some versions?
        // In 0.24.1 it seems we might not have a direct helper or it is on the factory.
        // Let's try to just run a generation with a fallback 'gemini-pro' to see if that works.

        // Actually, let's just try to generate with 'gemini-1.5-flash-8b' or 'gemini-1.5-pro'
        console.log("Testing gemini-1.5-flash-001...");
        const modelFlash001 = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        const result = await modelFlash001.generateContent("Hello via 001");
        console.log("Success with gemini-1.5-flash-001:", result.response.text());

    } catch (error) {
        console.error("Error with 001:", error.message);
    }

    try {
        console.log("Testing gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await modelPro.generateContent("Hello via pro");
        console.log("Success with gemini-pro:", result.response.text());
    } catch (error) {
        console.error("Error with pro:", error.message);
    }
}

listModels();
