"use client"

import { useState, useEffect, useMemo } from "react"
import { AlertTriangle, ArrowUpDown, Check, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { fetchDisruptions, fetchSchedule } from "@/lib/api"

export function DisruptionsPage() {
  const [isChaosMode, setIsChaosMode] = useState(false)
  const [flights, setFlights] = useState([])
  const [chaosRecovered, setChaosRecovered] = useState(0)
  const [beforeChaosStats, setBeforeChaosStats] = useState(null)
  const [sortField, setSortField] = useState("flight_id")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    const fetchData = async () => {
      try {
        if (isChaosMode) {
          // First get normal data for comparison
          if (!beforeChaosStats) {
            const normalData = await fetchSchedule()
            const normalEvents = normalData.events || []

            setBeforeChaosStats({
              totalCO2: normalEvents.reduce((sum, e) => sum + e.carbon, 0).toFixed(2),
              avgCO2: (normalEvents.reduce((sum, e) => sum + e.carbon, 0) / normalEvents.length).toFixed(2),
            })
          }

          // Then get chaos data
          const chaosData = await fetchDisruptions()
          setFlights(chaosData.events || [])
          setChaosRecovered(chaosData.chaos_recovered || 0)
        } else {
          // Get normal data
          const normalData = await fetchSchedule()
          setFlights(normalData.events || [])
          setChaosRecovered(0)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setIsLoading(false)
        toast({
          title: "Error",
          description: "Failed to fetch flight data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [isChaosMode, beforeChaosStats])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedFlights = useMemo(() => {
    return [...flights].sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Handle date strings
      if (sortField === "dep_time" || sortField === "arr_time") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1
    })
  }, [flights, sortField, sortDirection])

  const getRowClass = (flight) => {
    if (flight.status === "Disrupted") return "bg-destructive/10"
    if (flight.status === "Recovering") return "efficient-flight"
    return ""
  }

  const toggleChaosMode = () => {
    setIsChaosMode(!isChaosMode)
    if (!isChaosMode) {
      toast({
        title: "Chaos Mode Activated",
        description: "AI is working to recover from disruptions.",
      })
    } else {
      toast({
        title: "Chaos Mode Deactivated",
        description: "Returning to normal operations.",
      })
    }
  }

  const afterChaosStats = {
    totalCO2: flights.reduce((sum, e) => sum + e.carbon, 0).toFixed(2),
    avgCO2: flights.length > 0 ? (flights.reduce((sum, e) => sum + e.carbon, 0) / flights.length).toFixed(2) : "0.00",
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Disruption Management</h1>
          <p className="text-muted-foreground">Intelligent recovery from operational disruptions</p>
        </div>
        {/* <Button variant={isChaosMode ? "destructive" : "outline"} onClick={toggleChaosMode} className="gap-2">
          <AlertTriangle className="h-4 w-4" />
          {isChaosMode ? "Disable Chaos Mode" : "Trigger Chaos Mode"}
        </Button> */}
      </div>

      {isChaosMode && (
        <>
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center text-destructive">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span className="font-medium">Disruption Event Active - {chaosRecovered} Disruptions Recovered</span>
              </div>
              <Progress value={chaosRecovered * 10} className="h-2 mt-4" />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">Before Recovery</CardTitle>
              </CardHeader>
              <CardContent>
                {beforeChaosStats ? (
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground text-sm">Total CO2:</span>
                      <span className="text-2xl font-bold ml-2">{beforeChaosStats.totalCO2} kg</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Avg CO2/Flight:</span>
                      <span className="text-2xl font-bold ml-2">{beforeChaosStats.avgCO2} kg</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-16 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  After AI Recovery
                  <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-0">
                    <Check className="h-3 w-3 mr-1" />
                    Optimized
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-muted-foreground text-sm">Total CO2:</span>
                    <span className="text-2xl font-bold ml-2">{afterChaosStats.totalCO2} kg</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Avg CO2/Flight:</span>
                    <span className="text-2xl font-bold ml-2">{afterChaosStats.avgCO2} kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Card>
        <CardHeader className="py-4 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Flight Status</CardTitle>
          <div className="flex items-center gap-x-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-destructive/30 mr-1"></div>
              <span>Disrupted</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary/30 mr-1"></div>
              <span>Recovering</span>
            </div>
          </div>
        </CardHeader>

        {isLoading ? (
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <p className="mt-4 text-sm text-muted-foreground">Loading flight data...</p>
            </div>
          </CardContent>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("flight_id")}>
                      <div className="flex items-center">
                        Flight ID
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("tail_num")}>
                      <div className="flex items-center">
                        Tail
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("origin")}>
                      <div className="flex items-center">
                        Origin
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("dest")}>
                      <div className="flex items-center">
                        Destination
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("dep_time")}>
                      <div className="flex items-center">
                        Departure
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("arr_time")}>
                      <div className="flex items-center">
                        Arrival
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("passengers")}>
                      <div className="flex items-center">
                        Passengers
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("carbon")}>
                      <div className="flex items-center">
                        CO2 (kg)
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedFlights.map((flight) => (
                    <TooltipProvider key={flight.flight_id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TableRow className={getRowClass(flight)}>
                            <TableCell className="font-medium">{flight.flight_id}</TableCell>
                            <TableCell>{flight.tail_num}</TableCell>
                            <TableCell>{flight.origin}</TableCell>
                            <TableCell>{flight.dest}</TableCell>
                            <TableCell>{flight.dep_time.split(" ")[1].slice(0, 5)}</TableCell>
                            <TableCell>{flight.arr_time.split(" ")[1].slice(0, 5)}</TableCell>
                            <TableCell>{flight.passengers}</TableCell>
                            <TableCell>{flight.carbon.toFixed(2)}</TableCell>
                            <TableCell>
                              {flight.status === "Disrupted" && (
                                <Badge variant="destructive" className="flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  {flight.status}
                                </Badge>
                              )}
                              {flight.status === "Recovering" && (
                                <Badge
                                  variant="outline"
                                  className="bg-primary/10 text-primary border-0 flex items-center gap-1"
                                >
                                  <Leaf className="h-3 w-3" />
                                  {flight.status}
                                </Badge>
                              )}
                              {(!flight.status || flight.status === "On Schedule") && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Check className="h-3 w-3" />
                                  On Schedule
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        </TooltipTrigger>
                        <TooltipContent>
                          {flight.disruption_type ? (
                            <p>Disruption type: {flight.disruption_type}</p>
                          ) : (
                            <p>Normal operations</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  )
}

