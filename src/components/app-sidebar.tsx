"use client";
import { Home, Moon, Scale, Search, Sun } from "lucide-react";
import { Suspense } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Character",
    url: "/character",
    icon: Search,
  },
  {
    title: "Compare",
    url: "/compare",
    icon: Scale,
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
      <SidebarFooter>
        <div className="flex items-center space-x-2 justify-center">
          <Moon />
          <Switch
            onClick={() => {
              document.documentElement.classList.toggle("dark");
            }}
          />
          <Sun />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
