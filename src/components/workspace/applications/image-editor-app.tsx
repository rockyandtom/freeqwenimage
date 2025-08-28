"use client"

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ImageEditorContent = () => {
  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🖼️ 图像编辑器
          </h2>
          <p className="text-gray-600">
            综合性的图像编辑和处理工具
          </p>
        </div>
        
        {/* 文件上传区域 */}
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center mb-6">
          <div className="text-4xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            上传图片或拖拽到此处
          </h3>
          <p className="text-gray-500 mb-4">
            支持 JPG、PNG、WebP 格式，最大 20MB
          </p>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            选择文件
          </button>
        </div>

        {/* 工具栏 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            编辑工具
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: '裁剪', icon: '✂️' },
              { name: '旋转', icon: '🔄' },
              { name: '翻转', icon: '🔃' },
              { name: '调色', icon: '🎨' },
              { name: '滤镜', icon: '🌈' },
              { name: '文字', icon: '📝' },
              { name: '贴纸', icon: '😊' },
              { name: '边框', icon: '🖼️' },
              { name: '模糊', icon: '💫' },
              { name: '锐化', icon: '🔍' },
              { name: '降噪', icon: '🧹' },
              { name: '修复', icon: '🔧' }
            ].map((tool) => (
              <button
                key={tool.name}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <div className="text-xl mb-1">{tool.icon}</div>
                <div className="text-xs font-medium">{tool.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 快速操作 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">快速调整</h4>
            <div className="space-y-3">
              {[
                { name: '亮度', value: 0 },
                { name: '对比度', value: 0 },
                { name: '饱和度', value: 0 },
                { name: '色调', value: 0 }
              ].map((param) => (
                <div key={param.name} className="flex items-center gap-3">
                  <span className="text-sm w-16">{param.name}</span>
                  <input 
                    type="range" 
                    min="-100" 
                    max="100" 
                    defaultValue={param.value}
                    className="flex-1"
                  />
                  <span className="text-sm w-8 text-gray-500">{param.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">预设滤镜</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                '原图', '复古', '黑白',
                '暖色', '冷色', '鲜艳',
                '柔和', '怀旧', '电影'
              ].map((filter) => (
                <button
                  key={filter}
                  className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-xs transition-colors"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors">
            重置
          </button>
          <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            预览
          </button>
          <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors">
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ImageEditorApp() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    }>
      <ImageEditorContent />
    </Suspense>
  );
}