import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">页面未找到</p>
        <p className="mt-2 text-gray-500 dark:text-gray-500">
          抱歉，您访问的页面不存在。
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}