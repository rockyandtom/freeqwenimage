"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface SmoothAnchorLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function SmoothAnchorLink({ 
  href, 
  children, 
  className,
  onClick 
}: SmoothAnchorLinkProps) {
  const router = useRouter();

  const handleClick = (e?: React.MouseEvent<HTMLAnchorElement>) => {
    // 防止默认行为，但要确保事件对象存在
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    // 执行传入的onClick回调
    if (onClick) {
      onClick();
    }

    // 处理锚点链接
    if (href.startsWith('/#')) {
      const targetId = href.substring(2); // 移除 '/#' 前缀
      
      // 添加延迟以确保元素已渲染
      const scrollToElement = () => {
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // 动态计算header高度
          const headerElement = document.querySelector('header') || 
                               document.querySelector('nav') ||
                               document.querySelector('[data-header]');
          const headerHeight = headerElement ? headerElement.offsetHeight + 20 : 100;
          
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          
          // 平滑滚动到目标位置
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          });
          
          // 更新URL（可选，不会触发页面刷新）
          window.history.pushState(null, '', href);
          console.log(`成功滚动到: ${targetId}, 偏移: ${offsetPosition}`);
        } else {
          console.warn(`未找到锚点元素: ${targetId}`);
          // 如果找不到元素，尝试再次查找（最多重试3次）
          let retryCount = 0;
          const retryFind = () => {
            if (retryCount < 3) {
              retryCount++;
              setTimeout(() => {
                const retryElement = document.getElementById(targetId);
                if (retryElement) {
                  const headerElement = document.querySelector('header') || 
                                     document.querySelector('nav') ||
                                     document.querySelector('[data-header]');
                  const headerHeight = headerElement ? headerElement.offsetHeight + 20 : 100;
                  
                  const elementPosition = retryElement.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                  
                  window.scrollTo({
                    top: Math.max(0, offsetPosition),
                    behavior: 'smooth'
                  });
                  
                  window.history.pushState(null, '', href);
                  console.log(`重试成功滚动到: ${targetId}`);
                } else {
                  retryFind();
                }
              }, 100 * retryCount);
            }
          };
          retryFind();
        }
      };
      
      // 立即尝试滚动
      scrollToElement();
    } else if (href.startsWith('/')) {
      // 处理站内链接
      router.push(href);
    } else {
      // 处理外部链接
      window.open(href, '_blank');
    }
  };

  return (
    <a 
      href={href}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}