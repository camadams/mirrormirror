"use client";
import { Home, Scale, Search } from "lucide-react";
import { Suspense } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Compare",
    url: "/compare",
    icon: Scale,
  },
  {
    title: "Character",
    url: "/character",
    icon: Search,
  },
];

// Component that uses useSearchParams needs to be in a Suspense boundary
function SidebarNavItems() {
  const searchParams = useSearchParams();
  const currentQuery = Object.fromEntries(searchParams.entries());
  
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link href={{ pathname: item.url, query: currentQuery }}>
              <item.icon />
              <span className="font-[family-name:var(--font-geist-sans)]">
                {item.title}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

// Fallback component to show while loading
function SidebarNavItemsLoading() {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <div className="flex items-center space-x-2">
              <item.icon />
              <span className="font-[family-name:var(--font-geist-sans)]">
                {item.title}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Mirror Mirror</SidebarGroupLabel>
          <SidebarGroupContent>
            <Suspense fallback={<SidebarNavItemsLoading />}>
              <SidebarNavItems />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
