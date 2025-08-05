"use client";

import { Link } from "@/i18n/navigation";
import SmoothAnchorLink from "./smooth-anchor-link";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  onClick?: () => void;
}

// 判断是否为锚点链接
const isAnchorLink = (href: string) => {
  return href.startsWith('/#') || href.startsWith('#');
};

export default function NavLink({ href, children, className, target, onClick }: NavLinkProps) {
  // 如果是锚点链接，使用平滑滚动组件
  if (isAnchorLink(href)) {
    return (
      <SmoothAnchorLink 
        href={href} 
        className={className}
        onClick={onClick}
      >
        {children}
      </SmoothAnchorLink>
    );
  }

  // 其他情况使用普通Link组件
  return (
    <Link 
      href={href as any} 
      target={target} 
      className={className}
    >
      {children}
    </Link>
  );
}