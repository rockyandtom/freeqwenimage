const fs = require('fs');
const path = require('path');

// 测试Photo Effects API的完整流程
async function testPhotoEffectsAPI() {
    console.log('开始测试Photo Effects API...');
    
    // 使用您提供的文件ID
    const fileId = 'api/b7f9b5243eed132a9fd037b209c2fe08bdf827a35238509714edc1602a85e93b.jpg';
    
    try {
        // 第一步：调用Photo Effects API
        console.log('1. 调用Photo Effects API...');
        const photoEffectsResponse = await fetch('http://localhost:3000/api/runninghubAPI/photo-effects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageUrl: fileId
            })
        });
        
        const photoEffectsResult = await photoEffectsResponse.json();
        console.log('Photo Effects API 响应:', JSON.stringify(photoEffectsResult, null, 2));
        
        if (!photoEffectsResult.success) {
            console.error('Photo Effects API 调用失败:', photoEffectsResult.error);
            return;
        }
        
        const taskId = photoEffectsResult.data.taskId;
        console.log('任务ID:', taskId);
        
        // 第二步：轮询任务状态
        console.log('2. 开始轮询任务状态...');
        let attempts = 0;
        const maxAttempts = 12; // 最多轮询1分钟
        
        while (attempts < maxAttempts) {
            attempts++;
            console.log(`\n轮询尝试 ${attempts}/${maxAttempts}...`);
            
            const statusResponse = await fetch('http://localhost:3000/api/runninghubAPI/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    taskId: taskId
                })
            });
            
            const statusResult = await statusResponse.json();
            console.log('状态检查结果:', JSON.stringify(statusResult, null, 2));
            
            if (!statusResult.success) {
                console.error('状态检查失败:', statusResult.error);
                break;
            }
            
            const status = statusResult.data.status;
            console.log('当前状态:', status);
            
            if (status === 'completed' || status === 'COMPLETED') {
                console.log('✅ 任务完成！');
                console.log('结果URL:', statusResult.data.resultUrl);
                break;
            } else if (status === 'failed' || status === 'ERROR') {
                console.error('❌ 任务失败');
                break;
            }
            
            // 等待5秒后再次检查
            console.log('等待5秒后再次检查...');
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        
        if (attempts >= maxAttempts) {
            console.log('⏰ 轮询超时');
        }
        
    } catch (error) {
        console.error('测试过程中发生错误:', error);
    }
}

// 运行测试
testPhotoEffectsAPI();
