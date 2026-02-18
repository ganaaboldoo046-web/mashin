
const fetch = require('node-fetch'); // Using implicit node fetch if available or need to install? 
// Actually node 18+ has native fetch. I'll assume node 18+.

async function testCategoryCreate() {
    try {
        console.log("Testing Create Category...");
        const response = await fetch('http://127.0.0.1:8788/api/categories_create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test Category ' + Date.now(),
                icon: 'test_icon',
                image: 'test_image'
            })
        });

        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Body:", text);
    } catch (error) {
        console.error("Error:", error);
    }
}

testCategoryCreate();
