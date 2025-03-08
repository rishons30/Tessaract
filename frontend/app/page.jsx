import { DashboardShell } from "@/components/dashboard-shell"
import { HeroSection } from "@/components/hero-section"
import { FeatureCards } from "@/components/feature-cards"
import { StatsOverview } from "@/components/stats-overview"

export default function Home() {
  return (
    <DashboardShell>
      <HeroSection />
      <div className="container px-4 pb-12">
        <StatsOverview />
        <FeatureCards />
      </div>
    </DashboardShell>
  )
}

