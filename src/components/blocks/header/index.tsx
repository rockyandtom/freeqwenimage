"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Header as HeaderType } from "@/types/blocks/header";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import LocaleToggle from "@/components/locale/toggle";
import { Menu } from "lucide-react";
import SignToggle from "@/components/sign/toggle";
import ThemeToggle from "@/components/theme/toggle";
import { cn } from "@/lib/utils";
import NavLink from "@/components/navigation/nav-link";
import { useState } from "react";

export default function Header({ header }: { header: HeaderType }) {
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: number]: boolean }>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  
  if (header.disabled) {
    return null;
  }

  const handleDropdownItemClick = (dropdownIndex: number) => {
    setOpenDropdowns(prev => ({ ...prev, [dropdownIndex]: false }));
  };

  const handleMobileNavClick = () => {
    setSheetOpen(false);
  };

  return (
    <section className="py-3" data-header>
      <div className="container">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link
              href={(header.brand?.url as any) || "/"}
              className="flex items-center gap-2"
            >
              {header.brand?.logo?.src && (
                <img
                  src={header.brand.logo.src}
                  alt={header.brand.logo.alt || header.brand.title}
                  className="w-8"
                />
              )}
              {header.brand?.title && (
                <span className="text-xl text-primary font-bold">
                  {header.brand?.title || ""}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-1">
              {header.nav?.items?.map((item, i) => {
                if (item.children && item.children.length > 0) {
                  return (
                    <DropdownMenu 
                      key={i}
                      open={openDropdowns[i] || false}
                      onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, [i]: open }))}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground h-10 px-4 py-2"
                        >
                          {item.icon && (
                            <Icon
                              name={item.icon}
                              className="size-4 shrink-0 mr-2"
                            />
                          )}
                          <span>{item.title}</span>
                          <svg
                            className="ml-1 h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align={item.align || "start"} 
                        className="w-80 p-3"
                        sideOffset={item.sideOffset || 4}
                      >
                        {item.children.map((iitem, ii) => (
                          <DropdownMenuItem 
                            key={ii} 
                            className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-hidden transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDropdownItemClick(i);
                              
                              // 处理锚点链接
                              if (iitem.url && iitem.url.startsWith('/#')) {
                                const targetId = iitem.url.substring(2);
                                
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
                                    
                                    window.scrollTo({
                                      top: Math.max(0, offsetPosition),
                                      behavior: 'smooth'
                                    });
                                    
                                    window.history.pushState(null, '', iitem.url);
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
                                            
                                            window.history.pushState(null, '', iitem.url);
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
                                
                              } else if (iitem.url && iitem.url.startsWith('/')) {
                                window.location.href = iitem.url;
                              } else if (iitem.url) {
                                window.open(iitem.url, iitem.target || '_blank');
                              }
                            }}
                          >
                            {iitem.icon && (
                              <Icon
                                name={iitem.icon}
                                className="size-5 shrink-0"
                              />
                            )}
                            <div>
                              <div className="text-sm font-semibold">
                                {iitem.title}
                              </div>
                              <p className="text-sm leading-snug text-muted-foreground">
                                {iitem.description}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }

                return (
                  <NavLink
                    key={i}
                    className={cn(
                      "text-muted-foreground h-10 px-4 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex items-center justify-center",
                      buttonVariants({
                        variant: "ghost",
                      })
                    )}
                    href={item.url as any}
                    target={item.target}
                  >
                    {item.icon && (
                      <Icon
                        name={item.icon}
                        className="size-4 shrink-0 mr-2"
                      />
                    )}
                    {item.title}
                  </NavLink>
                );
              })}
            </div>
          </div>
          <div className="shrink-0 flex gap-2 items-center">
            {header.show_locale && <LocaleToggle />}
            {header.show_theme && <ThemeToggle />}

            {header.buttons?.map((item, i) => {
              return (
                <Button key={i} variant={item.variant}>
                  <Link
                    href={item.url as any}
                    target={item.target || ""}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    {item.title}
                    {item.icon && (
                      <Icon name={item.icon} className="size-4 shrink-0" />
                    )}
                  </Link>
                </Button>
              );
            })}
            {header.show_sign && <SignToggle />}
          </div>
        </nav>

        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link
              href={(header.brand?.url || "/") as any}
              className="flex items-center gap-2"
            >
              {header.brand?.logo?.src && (
                <img
                  src={header.brand.logo.src}
                  alt={header.brand.logo.alt || header.brand.title}
                  className="w-8"
                />
              )}
              {header.brand?.title && (
                <span className="text-xl font-bold">
                  {header.brand?.title || ""}
                </span>
              )}
            </Link>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="default" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      href={(header.brand?.url || "/") as any}
                      className="flex items-center gap-2"
                    >
                      {header.brand?.logo?.src && (
                        <img
                          src={header.brand.logo.src}
                          alt={header.brand.logo.alt || header.brand.title}
                          className="w-8"
                        />
                      )}
                      {header.brand?.title && (
                        <span className="text-xl font-bold">
                          {header.brand?.title || ""}
                        </span>
                      )}
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="mb-8 mt-8 flex flex-col gap-4">
                  <Accordion type="single" collapsible className="w-full">
                    {header.nav?.items?.map((item, i) => {
                      if (item.children && item.children.length > 0) {
                        return (
                          <AccordionItem
                            key={i}
                            value={item.title || ""}
                            className="border-b-0"
                          >
                            <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline text-left">
                              {item.title}
                            </AccordionTrigger>
                            <AccordionContent className="mt-2">
                              {item.children.map((iitem, ii) => (
                                <NavLink
                                  key={ii}
                                  className={cn(
                                    "flex select-none gap-4 rounded-md p-3 leading-none outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  )}
                                  href={iitem.url as any}
                                  target={iitem.target}
                                  onClick={handleMobileNavClick}
                                >
                                  {iitem.icon && (
                                    <Icon
                                      name={iitem.icon}
                                      className="size-4 shrink-0"
                                    />
                                  )}
                                  <div>
                                    <div className="text-sm font-semibold">
                                      {iitem.title}
                                    </div>
                                    <p className="text-sm leading-snug text-muted-foreground">
                                      {iitem.description}
                                    </p>
                                  </div>
                                </NavLink>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      }
                      return (
                        <NavLink
                          key={i}
                          href={item.url as any}
                          target={item.target}
                          className="font-semibold my-4 flex items-center gap-2 px-4"
                          onClick={handleMobileNavClick}
                        >
                          {item.icon && (
                            <Icon
                              name={item.icon}
                              className="size-4 shrink-0"
                            />
                          )}
                          {item.title}
                        </NavLink>
                      );
                    })}
                  </Accordion>
                </div>
                <div className="flex-1"></div>
                <div className="border-t pt-4">
                  <div className="mt-2 flex flex-col gap-3">
                    {header.buttons?.map((item, i) => {
                      return (
                        <Button key={i} variant={item.variant}>
                          <Link
                            href={item.url as any}
                            target={item.target || ""}
                            className="flex items-center gap-1"
                          >
                            {item.title}
                            {item.icon && (
                              <Icon
                                name={item.icon}
                                className="size-4 shrink-0"
                              />
                            )}
                          </Link>
                        </Button>
                      );
                    })}

                    {header.show_sign && <SignToggle />}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {header.show_locale && <LocaleToggle />}
                    <div className="flex-1"></div>

                    {header.show_theme && <ThemeToggle />}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}
