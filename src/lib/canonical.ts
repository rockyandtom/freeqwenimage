import { headers } from 'next/headers';

/**
 * 获取规范化的 URL
 * 将所有域名统一指向 freeqwenimage.com
 */
export async function getCanonicalUrl(pathname: string = ''): Promise<string> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  
  // 目标域名
  const canonicalDomain = 'freeqwenimage.com';
  
  // 清理路径
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  
  // 构建规范 URL
  const canonicalUrl = `https://${canonicalDomain}${cleanPath}`;
  
  return canonicalUrl;
}

/**
 * 检查是否需要重定向到规范域名
 */
export async function shouldRedirectToCanonical(): Promise<{ shouldRedirect: boolean; redirectUrl?: string }> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const pathname = headersList.get('x-pathname') || '/';
  
  // 需要重定向的域名列表
  const redirectDomains = [
    'freeqwenimage.vercel.app',
    'www.freeqwenimage.com',
    'www.freeqwenimage.vercel.app'
  ];
  
  // 目标域名
  const canonicalDomain = 'freeqwenimage.com';
  
  if (redirectDomains.includes(host)) {
    const redirectUrl = `https://${canonicalDomain}${pathname}`;
    return { shouldRedirect: true, redirectUrl };
  }
  
  return { shouldRedirect: false };
}

/**
 * 获取所有可能的域名变体（用于 hreflang）
 */
export function getDomainVariants(): string[] {
  return [
    'freeqwenimage.com',
    'www.freeqwenimage.com',
    'freeqwenimage.vercel.app'
  ];
}