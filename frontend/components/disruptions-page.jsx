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

    // Simulating data fetch
    setTimeout(() => {
      const generatedFlights = isChaosMode ? generateChaosFlights() : generateNormalFlights()

      setFlights(generatedFlights)

      if (isChaosMode && !beforeChaosStats) {
        const before = generatedFlights.map((flight) => ({
          ...flight,
          carbon: flight.carbon / 1.2, // Reverse the 20% increase for "before" stats
        }))

        setBeforeChaosStats({
          totalCO2: before.reduce((sum, e) => sum + e.carbon, 0).toFixed(2),
          avgCO2: (before.reduce((sum, e) => sum + e.carbon, 0) / before.length).toFixed(2),
        })
      }

      setChaosRecovered(isChaosMode ? Math.floor(Math.random() * 8) + 3 : 0)
      setIsLoading(false)
    }, 1500)
  }, [isChaosMode])

  const generateNormalFlights = () => {
    const airports = ["LAX", "JFK", "ORD", "DFW", "ATL", "SFO", "SEA", "MIA", "DEN", "LAS"]
    const tailNumbers = ["N101GT", "N102GT", "N103GT", "N104GT", "N105GT"]
    const flights = []
    const baseTime = new Date("2025-03-07T06:00:00")

    for (let i = 0; i < 30; i++) {
      const origin = airports[Math.floor(Math.random() * airports.length)]
      let dest = airports[Math.floor(Math.random() * airports.length)]
      while (dest === origin) {
        dest = airports[Math.floor(Math.random() * airports.length)]
      }

      const depTime = new Date(baseTime.getTime() + (i * 30 + Math.random() * 30) * 60000)
      const flightTime = 60 + Math.floor(Math.random() * 180)
      const arrTime = new Date(depTime.getTime() + flightTime * 60000)

      const passengers = 120 + Math.floor(Math.random() * 100)
      const carbon = 400 + Math.random() * 600
      const flight = {
        flight_id: `GT${1000 + i}`,
        tail_num: tailNumbers[Math.floor(Math.random() * tailNumbers.length)],
        origin,
        dest,
        dep_time: depTime.toISOString().replace("T", " ").slice(0, 16),
        arr_time: arrTime.toISOString().replace("T", " ").slice(0, 16),
        passengers,
        carbon,
        ground_time: 30 + Math.floor(Math.random() * 90),
        status: "On Schedule",
      }

      flights.push(flight)
    }

    return flights
  }

  const generateChaosFlights = () => {
    const flights = generateNormalFlights()

    // Add disruptions to some flights
    return flights.map((flight, index) => {
      // Apply disruptions to ~30% of flights
      if (index % 3 === 0) {
        return {
          ...flight,
          carbon: flight.carbon * 1.2, // 20% CO2 increase due to rerouting
          status: "Disrupted",
          disruption_type: ["Weather", "Mechanical", "Crew", "Air Traffic Control"][Math.floor(Math.random() * 4)],
        }
      }

      // Another ~20% are in recovery state
      if (index % 5 === 0) {
        return {
          ...flight,
          carbon: flight.carbon * 0.9, // AI optimized recovery
          status: "Recovering",
          disruption_type: ["Weather", "Mechanical", "Crew", "Air Traffic Control"][Math.floor(Math.random() * 4)],
        }
      }

      return flight
    })
  }

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
        <Button variant={isChaosMode ? "destructive" : "outline"} onClick={toggleChaosMode} className="gap-2">
          <AlertTriangle className="h-4 w-4" />
          {isChaosMode ? "Disable Chaos Mode" : "Trigger Chaos Mode"}
        </Button>
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
                              {flight.status === "On Schedule" && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Check className="h-3 w-3" />
                                  {flight.status}
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

