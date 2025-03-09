"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowUpDown, Calendar, ChevronDown, Filter, Plane, Plus, Wrench, X, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { fetchSchedule } from "@/lib/api"

export function SchedulePage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [flights, setFlights] = useState([])
  const [aircraftSchedules, setAircraftSchedules] = useState({})
  const [sortField, setSortField] = useState("flight_id")
  const [sortDirection, setSortDirection] = useState("asc")
  const [filters, setFilters] = useState({
    subtype: "",
    start_date: "2025-03-07",
    end_date: "2025-03-07",
    respect_pre: true,
    exclude_tails: "",
    break_trips: false,
  })

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    fetchSchedule(filters)
      .then((data) => {
        // Extract flights from events
        const flightEvents = data.events || []
        setFlights(flightEvents)

        // Create aircraft schedules
        const schedules = {}
        flightEvents.forEach((flight) => {
          const tail = flight.tail_num
          if (!schedules[tail]) schedules[tail] = []
          schedules[tail].push(flight)
        })

        // Sort and add maintenance gaps
        Object.keys(schedules).forEach((tail) => {
          schedules[tail].sort((a, b) => {
            return new Date(a.dep_time).getTime() - new Date(b.dep_time).getTime()
          })

          const withGaps = []
          for (let i = 0; i < schedules[tail].length; i++) {
            withGaps.push(schedules[tail][i])
            if (i < schedules[tail].length - 1) {
              const currentFlightEnd = new Date(schedules[tail][i].arr_time)
              const nextFlightStart = new Date(schedules[tail][i + 1].dep_time)
              const gapMinutes = Math.round((nextFlightStart - currentFlightEnd) / (1000 * 60))

              if (gapMinutes > 60) {
                withGaps.push({ type: "maintenance", duration: gapMinutes })
              }
            }
          }
          schedules[tail] = withGaps
        })

        setAircraftSchedules(schedules)
        setIsLoading(false)
      })
      .catch((err) => {
        setError("Failed to load schedule data. Please try again later.")
        setIsLoading(false)
      })
  }, [filters])

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
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
    const co2PerPassenger = flight.carbon / flight.passengers
    const isEfficient = co2PerPassenger < 100
    const isTightTurnaround = flight.ground_time <= 60
    return cn(isEfficient && "efficient-flight", isTightTurnaround && "tight-turnaround")
  }

  const getFlightTooltip = (flight) => {
    const co2PerPassenger = flight.carbon / flight.passengers
    if (co2PerPassenger < 100) return `Optimized: ${flight.origin} → ${flight.dest}, Passengers: ${flight.passengers}`
    if (flight.ground_time <= 60) return `Tight: ${flight.origin} → ${flight.dest}, Passengers: ${flight.passengers}`
    return `Balanced: ${flight.origin} → ${flight.dest}, Passengers: ${flight.passengers}`
  }

  const FlightBlock = ({ item, onClick }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="bg-primary/10 p-3 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors"
            onClick={onClick}
          >
            <div className="flex items-center space-x-1 mb-1">
              <Plane className="h-4 w-4 text-primary" />
              <span className="font-medium">{item.flight_id}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {item.dep_time.split(" ")[1].slice(0, 5)} - {item.arr_time.split(" ")[1].slice(0, 5)}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            <strong>
              {item.origin} → {item.dest}
            </strong>
            <br />
            Passengers: {item.passengers}
            <br />
            CO2: {item.carbon.toFixed(2)} kg
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  const MaintenanceBlock = ({ duration }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-muted p-3 rounded-lg text-xs flex items-center">
            <Wrench className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">Maintenance</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{duration} min ground time</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  const resetFilters = () => {
    setFilters({
      subtype: "",
      start_date: "2025-03-07",
      end_date: "2025-03-07",
      respect_pre: true,
      exclude_tails: "",
      break_trips: false,
    })
    toast({
      title: "Filters Reset",
      description: "Schedule filters have been reset to default values.",
    })
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flight Schedule</h1>
          <p className="text-muted-foreground">Manage and optimize aircraft assignments and flight schedules</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Flight
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center text-destructive">
              <X className="h-4 w-4 mr-2" />
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="mb-6">
        <Card>
          <CardHeader className="py-4 px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Schedule Filters
              </CardTitle>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform duration-200", isFilterOpen && "rotate-180")}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pb-4 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="subtype">Aircraft Subtype</Label>
                  <Input
                    id="subtype"
                    name="subtype"
                    value={filters.subtype}
                    onChange={handleFilterChange}
                    placeholder="e.g., Boeing 737-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={filters.start_date}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={filters.end_date}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exclude_tails">Exclude Tail Numbers</Label>
                  <Input
                    id="exclude_tails"
                    name="exclude_tails"
                    value={filters.exclude_tails}
                    onChange={handleFilterChange}
                    placeholder="e.g., N101,N102"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox
                    id="respect_pre"
                    name="respect_pre"
                    checked={filters.respect_pre}
                    onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, respect_pre: checked }))}
                  />
                  <Label htmlFor="respect_pre">Respect Pre-assignments</Label>
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox
                    id="break_trips"
                    name="break_trips"
                    checked={filters.break_trips}
                    onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, break_trips: checked }))}
                  />
                  <Label htmlFor="break_trips">Break Trips</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset Filters
              </Button>
              <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </CardFooter>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Card>
        <Tabs defaultValue="flights">
          <CardHeader className="px-6 py-4 border-b">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="flights">All Flights</TabsTrigger>
              <TabsTrigger value="aircraft">Aircraft Chains</TabsTrigger>
            </TabsList>
          </CardHeader>

          {isLoading ? (
            <CardContent className="py-8">
              <div className="flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <p className="mt-4 text-sm text-muted-foreground">Loading schedule data...</p>
              </div>
            </CardContent>
          ) : (
            <>
              <TabsContent value="flights" className="m-0">
                <CardContent className="p-0">
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedFlights.map((flight) => (
                        <TableRow
                          key={flight.flight_id}
                          className={cn(
                            getRowClass(flight),
                            "cursor-pointer",
                            selectedFlight?.flight_id === flight.flight_id && "bg-muted",
                          )}
                          onClick={() => setSelectedFlight(flight)}
                        >
                          <TableCell className="font-medium">{flight.flight_id}</TableCell>
                          <TableCell>{flight.tail_num}</TableCell>
                          <TableCell>{flight.origin}</TableCell>
                          <TableCell>{flight.dest}</TableCell>
                          <TableCell>{flight.dep_time.split(" ")[1].slice(0, 5)}</TableCell>
                          <TableCell>{flight.arr_time.split(" ")[1].slice(0, 5)}</TableCell>
                          <TableCell>{flight.passengers}</TableCell>
                          <TableCell>{flight.carbon.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </TabsContent>

              <TabsContent value="aircraft" className="m-0">
                <CardContent className="pt-6 pb-2">
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-8">
                      {Object.keys(aircraftSchedules).map((tail) => (
                        <div key={tail} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="py-1.5 font-semibold">
                              {tail}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {aircraftSchedules[tail].map((item, index) => {
                              if (item.type === "maintenance") {
                                return (
                                  <MaintenanceBlock key={`${tail}-maintenance-${index}`} duration={item.duration} />
                                )
                              } else {
                                return (
                                  <FlightBlock
                                    key={item.flight_id}
                                    item={item}
                                    onClick={() => setSelectedFlight(item)}
                                  />
                                )
                              }
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </TabsContent>
            </>
          )}
        </Tabs>
      </Card>

      <Dialog open={!!selectedFlight} onOpenChange={() => setSelectedFlight(null)}>
        {selectedFlight && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-primary" />
                Flight {selectedFlight.flight_id} Details
              </DialogTitle>
              <DialogDescription>
                {selectedFlight.origin} to {selectedFlight.dest}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Aircraft</Label>
                  <p className="font-medium">{selectedFlight.tail_num}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Route</Label>
                  <p className="font-medium">
                    {selectedFlight.origin} → {selectedFlight.dest}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Departure</Label>
                  <p className="font-medium">{selectedFlight.dep_time}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Arrival</Label>
                  <p className="font-medium">{selectedFlight.arr_time}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Passengers</Label>
                  <p className="font-medium">
                    {selectedFlight.passengers} / {selectedFlight.min_seating_capacity}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ground Time</Label>
                  <p className="font-medium">{selectedFlight.ground_time} minutes</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CO2 Emissions</Label>
                  <p className="font-medium">{selectedFlight.carbon.toFixed(2)} kg</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Onward Flight</Label>
                  <p className="font-medium">{selectedFlight.onward_flight || "None"}</p>
                </div>
              </div>

              {selectedFlight.carbon / selectedFlight.passengers < 100 && (
                <div className="bg-primary/10 p-3 rounded-md text-sm flex items-start mt-2">
                  <Leaf className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-semibold">Optimized Flight</p>
                    <p className="text-muted-foreground">This flight has been optimized for fuel efficiency.</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedFlight(null)}>
                Close
              </Button>
              <Button>Edit Flight</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

