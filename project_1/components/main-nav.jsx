"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plane } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/schedule", label: "Schedule" },
  { href: "/disruptions", label: "Disruptions" },
  { href: "/data-entry", label: "Data Entry" },
  { href: "/statistics", label: "Statistics" },
  { href: "/crew", label: "Crew" },
]

export function MainNav({ className, ...props }) {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Plane className="h-6 w-6 rotate-45 text-primary rotating-icon" />
        <span className="hidden font-bold sm:inline-block">GreenTail AI</span>
      </Link>
      <nav className="hidden gap-6 md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary relative py-1.5",
              pathname === link.href
                ? "text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                : "text-muted-foreground",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

