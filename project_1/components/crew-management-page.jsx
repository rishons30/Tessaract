"use client"

import { useState, useEffect } from "react"
import { Users, UserPlus, Plane, Search, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  fetchCrewMembers,
  addCrewMember,
  fetchFlights,
  assignCrewToFlight,
  getCrewAssignments,
  removeCrewAssignment,
} from "@/lib/api"

export function CrewManagementPage() {
  const [crewMembers, setCrewMembers] = useState([])
  const [flights, setFlights] = useState([])
  const [crewAssignments, setCrewAssignments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("crew-list")
  const [selectedCrew, setSelectedCrew] = useState(null)
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [showAssignDialog, setShowAssignDialog] = useState(false)

  const [formData, setFormData] = useState({
    crewID: "",
    firstName: "",
    lastName: "",
    age: "",
    airline: "GreenTail",
    currentLocation: "",
    role: "Flight Attendant",
    qualification: "Standard",
    experience: "",
    status: "Available",
  })

  const [crewIdError, setCrewIdError] = useState("")

  // Fetch crew members, flights, and assignments
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [crewData, flightData, assignmentData] = await Promise.all([
          fetchCrewMembers(),
          fetchFlights(),
          getCrewAssignments(),
        ])

        setCrewMembers(crewData)
        setFlights(flightData?.flights || [])
        setCrewAssignments(assignmentData)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load data. Please try again.")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    let updatedValue = value

    // Handle crewID input
    if (name === "crewID") {
      // Force uppercase and restrict to alphanumeric characters
      updatedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "")

      // Real-time validation for crewID
      const crewIdRegex = /^[A-Z0-9]{0,5}$/
      if (!crewIdRegex.test(updatedValue)) {
        setCrewIdError("Crew ID must contain only uppercase alphanumeric characters")
      } else if (updatedValue.length > 0 && updatedValue.length < 5) {
        setCrewIdError("Crew ID must be exactly 5 characters")
      } else if (updatedValue.length === 5) {
        setCrewIdError("")
      }
    }

    setFormData({ ...formData, [name]: updatedValue })
  }

  // Handle select input changes
  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  // Handle form submission to add a new crew member
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation for crewID: Must be exactly 5 alphanumeric characters
    const crewIdRegex = /^[A-Z0-9]{5}$/
    if (!crewIdRegex.test(formData.crewID)) {
      setCrewIdError("Crew ID must be exactly 5 alphanumeric characters (e.g., A1B2C)")
      return
    }

    // Check if crew ID already exists
    if (crewMembers.some((crew) => crew.crewID === formData.crewID)) {
      setCrewIdError("Crew ID already exists")
      return
    }

    try {
      const newCrewMember = {
        crewID: formData.crewID,
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: Number.parseInt(formData.age),
        airline: formData.airline,
        currentLocation: formData.currentLocation,
        role: formData.role,
        qualification: formData.qualification,
        experience: Number.parseInt(formData.experience),
        status: formData.status,
      }

      const result = await addCrewMember(newCrewMember)

      // Update the local state
      setCrewMembers([...crewMembers, result])

      // Reset the form
      setFormData({
        crewID: "",
        firstName: "",
        lastName: "",
        age: "",
        airline: "GreenTail",
        currentLocation: "",
        role: "Flight Attendant",
        qualification: "Standard",
        experience: "",
        status: "Available",
      })

      setCrewIdError("")

      toast({
        title: "Success",
        description: "Crew member added successfully",
      })

      // Switch to crew list tab
      setActiveTab("crew-list")
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add crew member",
        variant: "destructive",
      })
    }
  }

  // Handle crew assignment to flight
  const handleAssignCrew = async () => {
    if (!selectedCrew || !selectedFlight) {
      toast({
        title: "Error",
        description: "Please select both a crew member and a flight",
        variant: "destructive",
      })
      return
    }

    try {
      await assignCrewToFlight(selectedCrew.crewID, selectedFlight.flight_id)

      // Refresh assignments
      const updatedAssignments = await getCrewAssignments()
      setCrewAssignments(updatedAssignments)

      toast({
        title: "Success",
        description: `${selectedCrew.firstName} ${selectedCrew.lastName} assigned to flight ${selectedFlight.flight_id}`,
      })

      setShowAssignDialog(false)
      setSelectedCrew(null)
      setSelectedFlight(null)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to assign crew member to flight",
        variant: "destructive",
      })
    }
  }

  // Handle removing crew assignment
  const handleRemoveAssignment = async (crewId, flightId) => {
    try {
      await removeCrewAssignment(crewId, flightId)

      // Refresh assignments
      const updatedAssignments = await getCrewAssignments()
      setCrewAssignments(updatedAssignments)

      toast({
        title: "Success",
        description: "Crew assignment removed successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove crew assignment",
        variant: "destructive",
      })
    }
  }

  // Filter crew members based on search term
  const filteredCrewMembers = crewMembers.filter(
    (crew) =>
      crew.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crew.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crew.crewID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crew.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get crew assignments with details
  const assignmentsWithDetails = crewAssignments.map((assignment) => {
    const crew = crewMembers.find((c) => c.crewID === assignment.crewId)
    const flight = flights.find((f) => f.flight_id === assignment.flightId)

    return {
      ...assignment,
      crewName: crew ? `${crew.firstName} ${crew.lastName}` : "Unknown",
      crewRole: crew?.role || "Unknown",
      flightRoute: flight ? `${flight.origin} → ${flight.dest}` : "Unknown",
      departureTime: flight?.dep_time || "Unknown",
      arrivalTime: flight?.arr_time || "Unknown",
    }
  })

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crew Management</h1>
          <p className="text-muted-foreground">Manage flight crew and assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plane className="h-4 w-4 mr-2" />
                Assign Crew to Flight
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Crew to Flight</DialogTitle>
                <DialogDescription>Select a crew member and a flight to create an assignment.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="crew">Crew Member</Label>
                  <Select
                    onValueChange={(value) => {
                      const crew = crewMembers.find((c) => c.id.toString() === value)
                      setSelectedCrew(crew)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crew member" />
                    </SelectTrigger>
                    <SelectContent>
                      {crewMembers.map((crew) => (
                        <SelectItem key={crew.id} value={crew.id.toString()}>
                          {crew.crewID} - {crew.firstName} {crew.lastName} ({crew.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flight">Flight</Label>
                  <Select
                    onValueChange={(value) => {
                      const flight = flights.find((f) => f.flight_id === value)
                      setSelectedFlight(flight)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select flight" />
                    </SelectTrigger>
                    <SelectContent>
                      {flights.map((flight) => (
                        <SelectItem key={flight.flight_id} value={flight.flight_id}>
                          {flight.flight_id} - {flight.origin} → {flight.dest} ({flight.dep_time})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAssignCrew}>Assign</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <Alert className="mb-6 border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="crew-list" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Crew List
          </TabsTrigger>
          <TabsTrigger value="add-crew" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Crew
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            Flight Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="crew-list">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle>Crew Members</CardTitle>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search crew..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Crew ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Qualification</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCrewMembers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No crew members found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCrewMembers.map((crew) => (
                          <TableRow key={crew.id}>
                            <TableCell className="font-medium">{crew.crewID}</TableCell>
                            <TableCell>
                              {crew.firstName} {crew.lastName}
                            </TableCell>
                            <TableCell>{crew.role}</TableCell>
                            <TableCell>{crew.qualification}</TableCell>
                            <TableCell>{crew.experience} years</TableCell>
                            <TableCell>{crew.currentLocation}</TableCell>
                            <TableCell>
                              <Badge
                                variant={crew.status === "Available" ? "outline" : "secondary"}
                                className={crew.status === "Available" ? "bg-primary/10 text-primary border-0" : ""}
                              >
                                {crew.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-crew">
          <Card>
            <CardHeader>
              <CardTitle>Add New Crew Member</CardTitle>
              <CardDescription>Enter the details of the new crew member to add them to the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="crewID">Crew ID*</Label>
                    <Input
                      id="crewID"
                      name="crewID"
                      value={formData.crewID}
                      onChange={handleInputChange}
                      placeholder="e.g., CR001"
                      maxLength={5}
                      className={crewIdError ? "border-destructive" : ""}
                    />
                    {crewIdError && <p className="text-destructive text-sm">{crewIdError}</p>}
                    <p className="text-xs text-muted-foreground">5 uppercase alphanumeric characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="airline">Airline*</Label>
                    <Input
                      id="airline"
                      name="airline"
                      value={formData.airline}
                      onChange={handleInputChange}
                      placeholder="e.g., GreenTail"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name*</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="e.g., John"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name*</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="e.g., Smith"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age*</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="e.g., 35"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentLocation">Current Location*</Label>
                    <Input
                      id="currentLocation"
                      name="currentLocation"
                      value={formData.currentLocation}
                      onChange={handleInputChange}
                      placeholder="e.g., LAX"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role*</Label>
                    <Select
                      name="role"
                      defaultValue={formData.role}
                      onValueChange={(value) => handleSelectChange("role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pilot">Pilot</SelectItem>
                        <SelectItem value="Flight Attendant">Flight Attendant</SelectItem>
                        <SelectItem value="Engineer">Engineer</SelectItem>
                        <SelectItem value="Ground Staff">Ground Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification*</Label>
                    <Select
                      name="qualification"
                      defaultValue={formData.qualification}
                      onValueChange={(value) => handleSelectChange("qualification", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Captain">Captain</SelectItem>
                        <SelectItem value="First Officer">First Officer</SelectItem>
                        <SelectItem value="Lead">Lead</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (years)*</Label>
                    <Input
                      id="experience"
                      name="experience"
                      type="number"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="e.g., 5"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status*</Label>
                    <Select
                      name="status"
                      defaultValue={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="On Duty">On Duty</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Training">Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("crew-list")}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Crew Member
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Flight Assignments</CardTitle>
              <CardDescription>View and manage crew assignments to flights.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Crew ID</TableHead>
                        <TableHead>Crew Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Flight</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Departure</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignmentsWithDetails.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No assignments found
                          </TableCell>
                        </TableRow>
                      ) : (
                        assignmentsWithDetails.map((assignment, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{assignment.crewId}</TableCell>
                            <TableCell>{assignment.crewName}</TableCell>
                            <TableCell>{assignment.crewRole}</TableCell>
                            <TableCell>{assignment.flightId}</TableCell>
                            <TableCell>{assignment.flightRoute}</TableCell>
                            <TableCell>
                              {typeof assignment.departureTime === "string"
                                ? assignment.departureTime.split(" ")[1]?.slice(0, 5)
                                : "Unknown"}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveAssignment(assignment.crewId, assignment.flightId)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">Total Assignments: {assignmentsWithDetails.length}</p>
              <Button onClick={() => setShowAssignDialog(true)}>
                <Plane className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

