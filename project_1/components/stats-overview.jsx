"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, BarChart3, Leaf, Plane, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchStatistics } from "@/lib/api"

export function StatsOverview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetchStatistics()
        setStats(data)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
        setLoading(false)
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

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Operational Overview</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flights</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="text-2xl font-bold">{stats.total_flights}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Passengers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold">{stats.avg_passengers}</div>
                <span
                  className={`flex items-center text-xs ${passengerChange > 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {passengerChange > 0 ? (
                    <>
                      <ArrowUp className="h-3 w-3 mr-0.5" />
                      {passengerChange.toFixed(1)}%
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-3 w-3 mr-0.5" />
                      {Math.abs(passengerChange).toFixed(1)}%
                    </>
                  )}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO2 Emissions</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold">{stats.total_co2.toLocaleString()} kg</div>
                <span className={`flex items-center text-xs ${co2Change > 0 ? "text-green-500" : "text-red-500"}`}>
                  {co2Change > 0 ? (
                    <>
                      <ArrowDown className="h-3 w-3 mr-0.5" />
                      {co2Change.toFixed(1)}%
                    </>
                  ) : (
                    <>
                      <ArrowUp className="h-3 w-3 mr-0.5" />
                      {Math.abs(co2Change).toFixed(1)}%
                    </>
                  )}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimization Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="text-2xl font-bold">{stats.efficiency || 12.4}%</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

