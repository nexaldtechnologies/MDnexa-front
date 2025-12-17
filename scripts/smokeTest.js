const BASE_URL = process.env.BASE_URL || 'http://localhost:3000/api';

async function runSmokeTest() {
    console.log("Running Smoke Test...");
    let success = true;

    // 1. Health Check
    try {
        const res = await fetch(`${BASE_URL}/health`);
        if (res.status === 200) {
            console.log("✅ Main Health Check Passed");
        } else {
            console.error(`❌ Main Health Check Failed: ${res.status}`);
            success = false;
        }
    } catch (error) {
        console.error(`❌ Main Health Check Failed: ${error.message}`);
        success = false;
    }

    // 2. AI Check (Dry Run)
    try {
        const res = await fetch(`${BASE_URL}/health/ai`);
        const data = await res.json();

        if (res.status === 200 && data.status === 'ok') {
            console.log(`✅ AI Smoke Test Passed (Model: ${data.model_used})`);
        } else {
            console.error(`❌ AI Smoke Test Failed: ${res.status} ${JSON.stringify(data)}`);
            success = false;
        }
    } catch (error) {
        console.error(`❌ AI Smoke Test Failed: ${error.message}`);
        success = false;
    }

    if (!success) {
        console.error("🔥 SMOKE TEST FAILED");
        process.exit(1);
    } else {
        console.log("🚀 All Systems Operational");
        process.exit(0);
    }
}

runSmokeTest();
