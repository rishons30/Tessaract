"use client"

import { useState, useEffect } from "react"
import { BarChart, Activity, Calendar, Plane, RefreshCw, Ruler, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BadgeDelta } from "@/components/badge-delta"
import { cn } from "@/lib/utils"

export function StatisticsPage() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        // Simulate API call with timeout
        setTimeout(() => {
          setStats({
            total_flights: 142,
            avg_passengers: 185,
            total_co2: 58250,
            chaos_recovered: 8,
            efficiency: 12.4,
            fuel_saved: 18.7,
            optimized_routes: 76,
            top_routes: [
              { route: "LAX → JFK", flights: 18, efficiency: 92.1 },
              { route: "ORD → DFW", flights: 15, efficiency: 89.4 },
              { route: "SEA → SFO", flights: 12, efficiency: 94.2 },
              { route: "ATL → MIA", flights: 10, efficiency: 88.7 },
              { route: "DEN → LAX", flights: 9, efficiency: 90.8 },
            ],
            monthly_trends: [
              { month: "Jan", co2: 62000, flights: 130 },
              { month: "Feb", co2: 60100, flights: 135 },
              { month: "Mar", co2: 58250, flights: 142 },
            ],
          })
          setIsLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Arbitrary baseline for trend indicators
  const baseline = {
    total_co2: 65000,
    avg_passengers: 175,
  }

  const co2Change = stats ? ((baseline.total_co2 - stats.total_co2) / baseline.total_co2) * 100 : 0
  const passengerChange = stats ? ((stats.avg_passengers - baseline.avg_passengers) / baseline.avg_passengers) * 100 : 0

  const StatCard = ({ title, value, icon: Icon, change, suffix, isLoading }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
        ) : (
          <div className="flex items-baseline gap-1.5">
            <div className="text-2xl font-bold">{value}</div>
            {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
            {change !== undefined && <BadgeDelta value={change} />}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
          <p className="text-muted-foreground">Detailed metrics and performance analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Date Range</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b pb-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="routes">Route Analysis</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency Metrics</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Flights"
              value={isLoading ? "" : stats?.total_flights}
              icon={Plane}
              isLoading={isLoading}
            />
            <StatCard
              title="Average Passengers"
              value={isLoading ? "" : stats?.avg_passengers}
              icon={Users}
              change={passengerChange}
              isLoading={isLoading}
            />
            <StatCard
              title="CO2 Emissions"
              value={isLoading ? "" : stats?.total_co2.toLocaleString()}
              suffix="kg"
              icon={Activity}
              change={-co2Change}
              isLoading={isLoading}
            />
            <StatCard
              title="Optimization Rate"
              value={isLoading ? "" : stats?.efficiency}
              suffix="%"
              icon={BarChart}
              isLoading={isLoading}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>CO2 Reduction Trend</CardTitle>
                <CardDescription>Monthly emissions compared to baseline</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] w-full animate-pulse rounded bg-muted"></div>
                ) : (
                  <div className="h-[300px]">
                    <div className="flex h-full items-end gap-2 pb-6">
                      {stats?.monthly_trends.map((month, i) => (
                        <div key={i} className="group relative flex h-full flex-1 flex-col justify-end">
                          <div
                            className="relative h-full w-full transition-all"
                            style={{ height: `${(month.co2 / baseline.total_co2) * 100}%` }}
                          >
                            <div className="absolute bottom-0 w-full rounded-md bg-primary/70 p-1">
                              <div className="h-full w-full rounded-sm bg-primary"></div>
                            </div>
                          </div>
                          <span className="mt-2 text-center text-xs font-medium">{month.month}</span>
                          <div className="absolute bottom-[100%] left-1/2 mb-2 hidden -translate-x-1/2 flex-col items-center group-hover:flex">
                            <span className="whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs font-semibold text-white">
                              {month.co2.toLocaleString()} kg
                            </span>
                            <svg
                              width="8"
                              height="4"
                              viewBox="0 0 8 4"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-black"
                            >
                              <path d="M4 4L0 0H8L4 4Z" fill="currentColor"></path>
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disruption Recovery</CardTitle>
                <CardDescription>Automated incident resolution</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
                    <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Weather Events</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Mechanical Issues</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Scheduling Conflicts</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Air Traffic Delays</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Top Performing Routes</CardTitle>
                <CardDescription>Based on efficiency and emissions reduction</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 w-full animate-pulse rounded bg-muted"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {stats?.top_routes.map((route, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center justify-between rounded-md p-3",
                          route.efficiency > 90 ? "bg-primary/10" : "bg-muted",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Plane className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium">{route.route}</div>
                            <div className="text-xs text-muted-foreground">{route.flights} flights</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "text-sm font-medium",
                              route.efficiency > 90 ? "text-primary" : "text-muted-foreground",
                            )}
                          >
                            {route.efficiency}% efficient
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Route Optimization</CardTitle>
                <CardDescription>Performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
                    <div className="h-40 w-full animate-pulse rounded bg-muted"></div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-2 text-center">
                      <span className="text-sm font-medium text-muted-foreground">Routes Optimized</span>
                      <div className="flex items-center justify-center">
                        <span className="text-3xl font-bold">{stats?.optimized_routes}</span>
                        <span className="text-sm text-muted-foreground ml-1">/ 95</span>
                      </div>
                      <Progress value={(stats?.optimized_routes / 95) * 100} className="h-2" />
                    </div>

                    <div className="rounded-md border p-4">
                      <div className="text-center">
                        <Ruler className="mx-auto h-6 w-6 text-primary" />
                        <h3 className="mt-2 font-medium">Distance Saved</h3>
                        <p className="text-2xl font-bold">1,840 km</p>
                        <p className="text-xs text-muted-foreground">Across all flights</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fuel Saved</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
                ) : (
                  <div className="flex items-baseline space-x-2">
                    <div className="text-2xl font-bold">{stats?.fuel_saved}%</div>
                    <BadgeDelta value={stats?.fuel_saved} />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Turn-Around Time</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
                ) : (
                  <div className="flex items-baseline space-x-2">
                    <div className="text-2xl font-bold">42.5</div>
                    <span className="text-sm text-muted-foreground">minutes</span>
                    <BadgeDelta value={-8.3} />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Passenger Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
                ) : (
                  <div className="flex items-baseline space-x-2">
                    <div className="text-2xl font-bold">86.4%</div>
                    <span className="text-sm text-muted-foreground">utilized</span>
                    <BadgeDelta value={3.2} />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Operating Hours</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
                ) : (
                  <div className="flex items-baseline space-x-2">
                    <div className="text-2xl font-bold">12.4</div>
                    <span className="text-sm text-muted-foreground">avg/day</span>
                    <BadgeDelta value={5.1} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Efficiency Overview</CardTitle>
              <CardDescription>Comparing operational metrics to industry standards</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] w-full animate-pulse rounded bg-muted"></div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-primary"></span>
                          GreenTail Fleet
                        </span>
                        <span className="font-medium">84.7%</span>
                      </div>
                      <Progress value={84.7} className="h-3" />
                      <p className="text-xs text-muted-foreground">Overall operational efficiency score</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                          Industry Average
                        </span>
                        <span className="font-medium">71.2%</span>
                      </div>
                      <Progress value={71.2} className="h-3 bg-muted" />
                      <p className="text-xs text-muted-foreground">Based on data from 15 major airlines</p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="mb-3 font-medium">Efficiency Breakdown</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Fuel Usage</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">18.7% below average</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Flight Time</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">4.2% below average</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Ground Time</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">12.8% below average</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Aircraft Utilization</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">9.5% above average</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                Download Detailed Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

