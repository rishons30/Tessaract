"use client"

import { Plane, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-primary py-16 md:py-24">
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-foreground/10 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-primary-foreground/10 blur-3xl"></div>
      <div className="container px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* <Badge className="mb-4 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-all duration-300">
            Next-Generation AI
          </Badge>
          <div className="inline-flex items-center justify-center mb-6">
            <Plane className="h-12 w-12 text-primary-foreground rotating-icon" />
          </div> */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary-foreground mb-6 fadeInUp">
            GreenTail AI
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/80 mb-8 fadeInUp-delay-1">
            Intelligent flight optimization that reduces emissions while maximizing operational efficiency
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fadeInUp-delay-2">
            <Button
              size="lg"
              variant="secondary"
              className="text-primary font-medium"
              onClick={() => (window.location.href = "/schedule")}
            >
              View Schedule
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-primary-foreground bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10"
              onClick={() => (window.location.href = "/statistics")}
            >
              See Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

