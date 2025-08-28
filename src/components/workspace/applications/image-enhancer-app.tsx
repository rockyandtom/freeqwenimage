"use client"

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ImageEnhancerContent = () => {
  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ✨ AI图像增强器
          </h2>
          <p className="text-gray-600">
            使用AI技术增强图像质量和细节
          </p>
        </div>
        
        {/* 文件上传区域 */}
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center mb-6">
          <div className="text-4xl mb-4">🖼️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            上传图片
          </h3>
          <p className="text-gray-500 mb-4">
            支持 JPG、PNG 格式，最大 10MB
          </p>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
            选择文件
          </button>
        </div>

        {/* 增强选项 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            增强选项
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { 
                name: '超分辨率', 
                icon: '🔍', 
                desc: '提升图像分辨率至4倍',
                enabled: true 
              },
              { 
                name: '降噪处理', 
                icon: '🧹', 
                desc: '去除图像噪点和模糊',
                enabled: true 
              },
              { 
                name: '细节增强', 
                icon: '✨', 
                desc: '增强图像细节和锐度',
                enabled: false 
              },
              { 
                name: '色彩优化', 
                icon: '🎨', 
                desc: '优化色彩饱和度和对比度',
                enabled: false 
              }
            ].map((option) => (
              <div
                key={option.name}
                className={`bg-white border rounded-lg p-4 cursor-pointer transition-colors ${
                  option.enabled 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{option.name}</div>
                    <div className="text-sm text-gray-500">{option.desc}</div>
                  </div>
                  <div className={`w-4 h-4 rounded border-2 ${
                    option.enabled 
                      ? 'bg-green-600 border-green-600' 
                      : 'border-gray-300'
                  }`}>
                    {option.enabled && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 高级设置 */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            高级设置
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                增强强度
              </label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                defaultValue="5"
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>轻微</span>
                <span>强烈</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                输出格式
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>PNG (无损)</option>
                <option>JPG (高质量)</option>
                <option>WebP (优化)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 生成按钮 */}
        <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-colors">
          ✨ 开始增强图像
        </button>
      </div>
    </div>
  );
};

export default function ImageEnhancerApp() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    }>
      <ImageEnhancerContent />
    </Suspense>
  );
}