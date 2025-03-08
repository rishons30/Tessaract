import { BarChart3, Gauge, Globe, Leaf, Plane, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FeatureCards() {
  const features = [
    {
      icon: Plane,
      title: "Intelligent Scheduling",
      description: "Optimize flight schedules based on multiple constraints with AI-powered algorithms.",
    },
    {
      icon: Leaf,
      title: "CO2 Reduction",
      description: "Reduce carbon emissions through smarter routing and aircraft utilization.",
    },
    {
      icon: Gauge,
      title: "Real-time Monitoring",
      description: "Track performance metrics and operational efficiency as they happen.",
    },
    {
      icon: Shield,
      title: "Disruption Management",
      description: "Automatically recover from scheduling disruptions with minimal impact.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Gain insights from comprehensive data visualization and reporting.",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Optimize flight operations across any geography with region-specific intelligence.",
    },
  ]

  return (
    <>
      <div className="my-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Powerful Features</h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Our platform combines AI, operational research, and industry expertise to transform flight operations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {features.map((feature, index) => (
          <Card key={index} className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

