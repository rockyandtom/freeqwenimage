const fs = require('fs');
const FormData = require('form-data');

// 测试上传API
async function testUpload() {
    console.log('Testing upload API...');
    
    try {
        // 创建一个简单的测试图片数据
        const testImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
        
        const formData = new FormData();
        formData.append('file', testImageData, {
            filename: 'test.png',
            contentType: 'image/png'
        });

        const response = await fetch('http://localhost:3000/api/runninghubAPI/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        console.log('Upload response:', result);
        
        if (result.success) {
            console.log('✅ Upload successful, fileId:', result.data.fileId);
            return result.data.fileId;
        } else {
            console.log('❌ Upload failed:', result.error);
            return null;
        }
    } catch (error) {
        console.log('❌ Upload error:', error.message);
        return null;
    }
}

// 测试Photo Effects API
async function testPhotoEffects(fileId) {
    console.log('\nTesting Photo Effects API...');
    
    try {
        const response = await fetch('http://localhost:3000/api/runninghubAPI/photo-effects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl: fileId })
        });

        const result = await response.json();
        console.log('Photo Effects response:', result);
        
        if (result.success) {
            console.log('✅ Photo Effects successful, taskId:', result.data.taskId);
            return result.data.taskId;
        } else {
            console.log('❌ Photo Effects failed:', result.error);
            return null;
        }
    } catch (error) {
        console.log('❌ Photo Effects error:', error.message);
        return null;
    }
}

// 测试状态API
async function testStatus(taskId) {
    console.log('\nTesting Status API...');
    
    try {
        const response = await fetch('http://localhost:3000/api/runninghubAPI/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ taskId })
        });

        const result = await response.json();
        console.log('Status response:', result);
        
        if (result.success) {
            console.log('✅ Status successful, status:', result.data.status);
            return result.data;
        } else {
            console.log('❌ Status failed:', result.error);
            return null;
        }
    } catch (error) {
        console.log('❌ Status error:', error.message);
        return null;
    }
}

// 主测试函数
async function runTests() {
    console.log('🚀 Starting API connection tests...\n');
    
    // 等待服务器启动
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const fileId = await testUpload();
    if (!fileId) {
        console.log('\n❌ Upload failed, stopping tests');
        return;
    }
    
    const taskId = await testPhotoEffects(fileId);
    if (!taskId) {
        console.log('\n❌ Photo Effects failed, stopping tests');
        return;
    }
    
    // 测试状态API
    await testStatus(taskId);
    
    console.log('\n✅ All tests completed');
}

runTests().catch(console.error);
