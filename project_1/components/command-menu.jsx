"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import {
  Calculator,
  Calendar,
  Laptop,
  LayoutDashboard,
  Plane,
  Search,
  Settings,
  AlertTriangle,
  Users,
} from "lucide-react"

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command) => {
    setOpen(false)
    command()
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative mr-2 text-muted-foreground hidden md:flex"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all flight data..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/schedule"))}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Schedule</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/disruptions"))}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span>Disruptions</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/data-entry"))}>
              <Laptop className="mr-2 h-4 w-4" />
              <span>Data Entry</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/statistics"))}>
              <Calculator className="mr-2 h-4 w-4" />
              <span>Statistics</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/crew"))}>
              <Users className="mr-2 h-4 w-4" />
              <span>Crew Management</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Flight Tools">
            <CommandItem>
              <Plane className="mr-2 h-4 w-4" />
              <span>Find Flight</span>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Preferences</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

