"use client"

import { useState } from "react"
import { PlaneLanding, PlaneTakeoff, Plus, Calendar, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"

export function DataEntryPage() {
  const [flightData, setFlightData] = useState({
    flight_id: "",
    dep_time: "",
    arr_time: "",
    origin: "",
    dest: "",
    subtype: "",
    min_seating_capacity: "",
    ground_time: "",
    onward_flight: "",
    passengers: "",
    distance: "",
  })

  const [aircraftData, setAircraftData] = useState({
    tail_num: "",
    subtype: "",
    capacity: "",
    base_fuel: "",
    efficiency: "",
    pre_assignments: "",
  })

  const [message, setMessage] = useState(null)

  const handleFlightSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (
      !flightData.flight_id ||
      !flightData.origin ||
      !flightData.dest ||
      !flightData.dep_time ||
      !flightData.arr_time
    ) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields.",
      })
      return
    }

    // Simulating API call
    setMessage({ type: "loading", text: "Adding flight..." })

    setTimeout(() => {
      // Success response
      setMessage({
        type: "success",
        text: `Flight ${flightData.flight_id} successfully added.`,
      })

      toast({
        title: "Flight Added",
        description: `Flight ${flightData.flight_id} added successfully.`,
      })

      // Clear form
      setFlightData({
        flight_id: "",
        dep_time: "",
        arr_time: "",
        origin: "",
        dest: "",
        subtype: "",
        min_seating_capacity: "",
        ground_time: "",
        onward_flight: "",
        passengers: "",
        distance: "",
      })

      // Clear message after delay
      setTimeout(() => setMessage(null), 3000)
    }, 1500)
  }

  const handleAircraftSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!aircraftData.tail_num || !aircraftData.subtype || !aircraftData.capacity) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields.",
      })
      return
    }

    // Simulating API call
    setMessage({ type: "loading", text: "Adding aircraft..." })

    setTimeout(() => {
      // Success response
      setMessage({
        type: "success",
        text: `Aircraft ${aircraftData.tail_num} successfully added.`,
      })

      toast({
        title: "Aircraft Added",
        description: `Aircraft ${aircraftData.tail_num} added successfully.`,
      })

      // Clear form
      setAircraftData({
        tail_num: "",
        subtype: "",
        capacity: "",
        base_fuel: "",
        efficiency: "",
        pre_assignments: "",
      })

      // Clear message after delay
      setTimeout(() => setMessage(null), 3000)
    }, 1500)
  }

  const handleFlightChange = (e) => {
    const { name, value } = e.target
    setFlightData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAircraftChange = (e) => {
    const { name, value } = e.target
    setAircraftData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Data Entry</h1>
        <p className="text-muted-foreground">Add new flights and aircraft to the system</p>
      </div>

      {message && (
        <Alert
          className={`mb-6 ${
            message.type === "error" ? "border-destructive" : message.type === "success" ? "border-primary" : ""
          }`}
        >
          <AlertDescription className="flex items-center">
            {message.type === "loading" && (
              <div className="w-4 h-4 mr-2 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            )}
            {message.type === "success" && <Check className="w-4 h-4 mr-2 text-primary" />}
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <Tabs defaultValue="flight" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="flight" className="flex items-center gap-2">
              <PlaneTakeoff className="h-4 w-4" />
              Add Flight
            </TabsTrigger>
            <TabsTrigger value="aircraft" className="flex items-center gap-2">
              <PlaneLanding className="h-4 w-4" />
              Add Aircraft
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flight" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Flight Details</h3>
              <form onSubmit={handleFlightSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="flight_id">Flight ID*</Label>
                    <Input
                      id="flight_id"
                      name="flight_id"
                      value={flightData.flight_id}
                      onChange={handleFlightChange}
                      placeholder="GT1234"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtype">Aircraft Subtype*</Label>
                    <Input
                      id="subtype"
                      name="subtype"
                      value={flightData.subtype}
                      onChange={handleFlightChange}
                      placeholder="Boeing 737-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="onward_flight">Onward Flight</Label>
                    <Input
                      id="onward_flight"
                      name="onward_flight"
                      value={flightData.onward_flight}
                      onChange={handleFlightChange}
                      placeholder="GT1235"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin Airport*</Label>
                    <Input
                      id="origin"
                      name="origin"
                      value={flightData.origin}
                      onChange={handleFlightChange}
                      placeholder="LAX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dest">Destination Airport*</Label>
                    <Input
                      id="dest"
                      name="dest"
                      value={flightData.dest}
                      onChange={handleFlightChange}
                      placeholder="JFK"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dep_time">Departure Time*</Label>
                    <Input
                      id="dep_time"
                      name="dep_time"
                      type="datetime-local"
                      value={flightData.dep_time}
                      onChange={handleFlightChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arr_time">Arrival Time*</Label>
                    <Input
                      id="arr_time"
                      name="arr_time"
                      type="datetime-local"
                      value={flightData.arr_time}
                      onChange={handleFlightChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="min_seating_capacity">Min Seating Capacity*</Label>
                    <Input
                      id="min_seating_capacity"
                      name="min_seating_capacity"
                      type="number"
                      value={flightData.min_seating_capacity}
                      onChange={handleFlightChange}
                      placeholder="150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ground_time">Ground Time (minutes)*</Label>
                    <Input
                      id="ground_time"
                      name="ground_time"
                      type="number"
                      value={flightData.ground_time}
                      onChange={handleFlightChange}
                      placeholder="45"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance (km)*</Label>
                    <Input
                      id="distance"
                      name="distance"
                      type="number"
                      value={flightData.distance}
                      onChange={handleFlightChange}
                      placeholder="850"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passengers">Estimated Passengers*</Label>
                  <Input
                    id="passengers"
                    name="passengers"
                    type="number"
                    value={flightData.passengers}
                    onChange={handleFlightChange}
                    placeholder="175"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Flight
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="aircraft" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Aircraft Details</h3>
              <form onSubmit={handleAircraftSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tail_num">Tail Number*</Label>
                    <Input
                      id="tail_num"
                      name="tail_num"
                      value={aircraftData.tail_num}
                      onChange={handleAircraftChange}
                      placeholder="N101GT"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aircraft_subtype">Aircraft Subtype*</Label>
                    <Input
                      id="aircraft_subtype"
                      name="subtype"
                      value={aircraftData.subtype}
                      onChange={handleAircraftChange}
                      placeholder="Boeing 737-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Passenger Capacity*</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      value={aircraftData.capacity}
                      onChange={handleAircraftChange}
                      placeholder="189"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="base_fuel">Base Fuel Consumption (kg/hour)*</Label>
                    <Input
                      id="base_fuel"
                      name="base_fuel"
                      type="number"
                      step="0.1"
                      value={aircraftData.base_fuel}
                      onChange={handleAircraftChange}
                      placeholder="2300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="efficiency">Fuel Efficiency Factor*</Label>
                    <Input
                      id="efficiency"
                      name="efficiency"
                      type="number"
                      step="0.01"
                      value={aircraftData.efficiency}
                      onChange={handleAircraftChange}
                      placeholder="0.95"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pre_assignments">Pre-assigned Time Blocks (HH:MM-HH:MM)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="pre_assignments"
                      name="pre_assignments"
                      value={aircraftData.pre_assignments}
                      onChange={handleAircraftChange}
                      placeholder="12:00-14:00"
                    />
                    <Button variant="outline" size="icon" type="button">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Separate multiple blocks with commas</p>
                </div>

                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox id="maintenance" />
                  <Label htmlFor="maintenance">Schedule regular maintenance checks</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Aircraft
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

