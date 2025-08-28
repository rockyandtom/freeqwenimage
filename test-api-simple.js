// 简单的API测试脚本
async function testAPI() {
    console.log('🚀 Testing API endpoints...\n');
    
    try {
        // 测试Photo Effects API直接调用RunningHub
        console.log('Testing direct RunningHub API call...');
        
        const requestBody = {
            webappId: "1960913221911810050",
            apiKey: "fb88fac46b0349c1986c9cbb4f14d44e",
            nodeInfoList: [
                {
                    nodeId: "5",
                    fieldName: "image",
                    fieldValue: "test-image-id.png",
                    description: "image"
                }
            ]
        };

        console.log('Request body:', JSON.stringify(requestBody, null, 2));

        const response = await fetch('https://www.runninghub.cn/task/openapi/ai-app/run', {
            method: 'POST',
            headers: {
                'Host': 'www.runninghub.cn',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response text:', responseText);

        try {
            const data = JSON.parse(responseText);
            console.log('Parsed response:', JSON.stringify(data, null, 2));
            
            if (data.code === 0) {
                console.log('✅ API call successful!');
                console.log('Task ID:', data.data?.taskId);
            } else {
                console.log('❌ API call failed with code:', data.code);
                console.log('Error message:', data.msg);
                
                if (data.code === 433) {
                    console.log('💡 This is a balance issue. Please check your wallet balance.');
                } else if (data.code === 421) {
                    console.log('💡 This is a queue issue. The service is busy.');
                }
            }
        } catch (parseError) {
            console.log('❌ Failed to parse response:', parseError.message);
        }
        
    } catch (error) {
        console.log('❌ Network error:', error.message);
    }
}

testAPI();
