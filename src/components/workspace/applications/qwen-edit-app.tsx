"use client"

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const QwenEditContent = () => {
  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🎨 Qwen图像编辑
          </h2>
          <p className="text-gray-600">
            基于Qwen的智能图像编辑和处理
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
          <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            选择文件
          </button>
        </div>

        {/* 编辑功能 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            编辑功能
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: '智能抠图', icon: '✂️', desc: '自动识别主体' },
              { name: '背景替换', icon: '🌄', desc: '更换图片背景' },
              { name: '物体移除', icon: '🗑️', desc: '移除不需要的物体' },
              { name: '风格转换', icon: '🎭', desc: '转换艺术风格' },
              { name: '色彩调整', icon: '🎨', desc: '调整色彩参数' },
              { name: '智能修复', icon: '🔧', desc: '修复图像缺陷' }
            ].map((feature) => (
              <button
                key={feature.name}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 transition-colors text-left"
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <div className="font-medium text-gray-900 mb-1">{feature.name}</div>
                <div className="text-xs text-gray-500">{feature.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 编辑指令 */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            编辑指令
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述您想要的编辑效果
              </label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 resize-none"
                placeholder="例如：将背景替换为蓝天白云，让人物更加突出..."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">快速指令：</span>
              {[
                '移除背景',
                '增强细节',
                '调亮图片',
                '添加滤镜',
                '修复划痕'
              ].map((cmd) => (
                <button
                  key={cmd}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 参数设置 */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            参数设置
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                编辑强度
              </label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                defaultValue="7"
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>保守</span>
                <span>激进</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                保真度
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>高保真 (慢)</option>
                <option>平衡 (推荐)</option>
                <option>快速 (低保真)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 生成按钮 */}
        <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-medium hover:from-orange-700 hover:to-red-700 transition-colors">
          🎨 开始智能编辑
        </button>
      </div>
    </div>
  );
};

export default function QwenEditApp() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    }>
      <QwenEditContent />
    </Suspense>
  );
}