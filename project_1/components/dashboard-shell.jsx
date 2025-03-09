"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { CommandMenu } from "@/components/command-menu"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function DashboardShell({ children }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col">
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b transition-all duration-200",
          scrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "bg-background",
        )}
      >
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus:ring-0 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <CommandMenu />
            <UserNav />
          </div>
        </div>
      </header>

      {mobileMenuOpen && <MobileNav onClose={() => setMobileMenuOpen(false)} />}

      <main className="flex-1">{children}</main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:h-14 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GreenTail AI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">Next-Generation Flight Optimization Platform</p>
        </div>
      </footer>
    </div>
  )
}

