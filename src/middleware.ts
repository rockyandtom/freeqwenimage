import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

// 创建国际化中间件
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host') || '';
  
  // 需要重定向的域名列表
  const redirectDomains = [
    'freeqwenimage.vercel.app',
    'www.freeqwenimage.com',
    'www.freeqwenimage.vercel.app'
  ];
  
  // 目标规范域名
  const canonicalDomain = 'freeqwenimage.com';
  
  // 如果是需要重定向的域名，执行301重定向
  if (redirectDomains.includes(host)) {
    const redirectUrl = new URL(`https://${canonicalDomain}${pathname}${search}`);
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }
  
  // 添加自定义头部信息供后续使用
  const response = intlMiddleware(request);
  if (response) {
    response.headers.set('x-pathname', pathname);
    return response;
  }
  
  // 如果没有国际化响应，创建新的响应并添加头部
  const newResponse = NextResponse.next();
  newResponse.headers.set('x-pathname', pathname);
  return newResponse;
}

export const config = {
  matcher: [
    "/",
    "/(en|en-US|zh|zh-CN|zh-TW|zh-HK|zh-MO|ja|ko|ru|fr|de|ar|es|it)/:path*",
    "/((?!privacy-policy|terms-of-service|api/|_next|_vercel|.*\\..*).*)",
  ],
};
