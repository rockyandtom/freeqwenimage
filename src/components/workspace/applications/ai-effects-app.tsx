"use client"

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// 动态导入原始应用内容
const AIEffectsContent = () => {
  // 这里将嵌入 /new-page/AI-EFFECTS 的内容
  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🎬 AI特效视频
          </h2>
          <p className="text-gray-600">
            为您的图片添加AI特效，生成动态视频
          </p>
        </div>
        
        {/* 文件上传区域 */}
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center mb-6">
          <div className="text-4xl mb-4">📸</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            上传图片
          </h3>
          <p className="text-gray-500 mb-4">
            支持 JPG、PNG 格式，最大 10MB
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            选择文件
          </button>
        </div>

        {/* 特效选择 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            选择特效
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: '飘动', icon: '🌊' },
              { name: '闪烁', icon: '✨' },
              { name: '旋转', icon: '🌀' },
              { name: '缩放', icon: '🔍' },
              { name: '摇摆', icon: '🎭' },
              { name: '渐变', icon: '🌈' },
              { name: '粒子', icon: '⭐' },
              { name: '自定义', icon: '🎨' }
            ].map((effect) => (
              <button
                key={effect.name}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="text-2xl mb-1">{effect.icon}</div>
                <div className="text-sm font-medium">{effect.name}</div>
              </button>
            ))}
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
                视频时长
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>2秒</option>
                <option>3秒</option>
                <option>5秒</option>
                <option>8秒</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                特效强度
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>轻微</option>
                <option>中等</option>
                <option>强烈</option>
              </select>
            </div>
          </div>
        </div>

        {/* 生成按钮 */}
        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors">
          🎬 生成AI特效视频
        </button>
      </div>
    </div>
  );
};

export default function AIEffectsApp() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    }>
      <AIEffectsContent />
    </Suspense>
  );
}