"use client";

import { Link } from "@/i18n/navigation";
import SmoothAnchorLink from "./smooth-anchor-link";

// 判断是否为锚点链接
const isAnchorLink = (href: string) => {
  return href.startsWith('/#') || href.startsWith('#');
};

export interface NavLinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export default function NavLink({ href, children, ...props }: NavLinkProps) {
  if (typeof href !== 'string' || !href) {
    return <span {...props}>{children}</span>;
  }

  const isAnchor = isAnchorLink(href);

  if (isAnchor) {
    return (
      <SmoothAnchorLink href={href} {...props}>
        {children}
      </SmoothAnchorLink>
    );
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}