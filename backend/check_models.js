const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init to access headers if needed, but actually we use genAI.makeRequest usually or just look at docs. 
        // Wait, the SDK has no direct listModels method on the client instance in some versions?
        // Actually standard generic usage:
        // There isn't a simple listModels on the main class in strict typing?
        // Let's rely on standard fetch if SDK doesn't expose it easily, OR assume names.
        // BUT wait, older/newer SDKs might differ.
        // Let's try to just run a simple generation with a KNOWN stable model to query availability? 
        // No, let's try to query the models endpoint directly via REST if SDK fails.

        // Easier: Let's assume the error message "Call ListModels to see..." implies we can calls it.
        // The SDK might not wrap it perfectly. Let's do a fetch.

        const key = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const response = await fetch(url);
        const data = await response.json();

        const fs = require('fs');
        if (data.models) {
            console.log("Found models, writing to models.json");
            fs.writeFileSync('models.json', JSON.stringify(data.models, null, 2));
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
