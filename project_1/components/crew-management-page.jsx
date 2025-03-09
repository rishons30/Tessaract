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
  const [crewMembers, setCrewMembers] = useState([]);
  const [flights, setFlights] = useState([]);
  const [crewAssignments, setCrewAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("crew-list");
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "Flight Attendant",
    certifications: "",
    availability: "",
  });

  // Fetch crew members, flights, and assignments
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [crewData, flightData, assignmentData] = await Promise.all([
          fetchCrewMembers(),
          fetchFlights(),
          getCrewAssignments(),
        ]);

        setCrewMembers(crewData);
        setFlights(flightData?.flights || []);
        setCrewAssignments(assignmentData);
        setIsLoading(false);
      } catch (err) {
        console.error("Fetch error:", err); // Log the error for debugging
        setError("Failed to load data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select input changes
  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission to add a new crew member
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newCrewMember = {
        name: formData.name,
        role: formData.role,
        certifications: formData.certifications ? formData.certifications.split(",").map(s => s.trim()) : [],
        availability: formData.availability || new Date().toISOString().slice(0, 16).replace("T", " "),
      };

      const result = await addCrewMember(newCrewMember);
      setCrewMembers([...crewMembers, result.crew]); // Backend returns {message, crew}

      // Reset the form
      setFormData({
        name: "",
        role: "Flight Attendant",
        certifications: "",
        availability: "",
      });

      toast({
        title: "Success",
        description: "Crew member added successfully",
      });

      setActiveTab("crew-list");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add crew member",
        variant: "destructive",
      });
    }
  };

  // Handle crew assignment to flight
  const handleAssignCrew = async () => {
    if (!selectedCrew || !selectedFlight) {
      toast({
        title: "Error",
        description: "Please select both a crew member and a flight",
        variant: "destructive",
      });
      return;
    }

    try {
      await assignCrewToFlight(selectedCrew.id, selectedFlight.flight_id);

      const updatedAssignments = await getCrewAssignments();
      setCrewAssignments(updatedAssignments);

      toast({
        title: "Success",
        description: `${selectedCrew.name} assigned to flight ${selectedFlight.flight_id}`,
      });

      setShowAssignDialog(false);
      setSelectedCrew(null);
      setSelectedFlight(null);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to assign crew member to flight",
        variant: "destructive",
      });
    }
  };

  // Handle removing crew assignment
  const handleRemoveAssignment = async (crewId, flightId) => {
    try {
      await removeCrewAssignment(crewId, flightId);

      const updatedAssignments = await getCrewAssignments();
      setCrewAssignments(updatedAssignments);

      toast({
        title: "Success",
        description: "Crew assignment removed successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove crew assignment",
        variant: "destructive",
      });
    }
  };

  // Filter crew members based on search term
  const filteredCrewMembers = crewMembers.filter(
    (crew) =>
      crew.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crew.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crew.id.toString().includes(searchTerm)
  );

  // Get crew assignments with details
  const assignmentsWithDetails = crewAssignments.map((assignment) => {
    const crew = crewMembers.find((c) => c.id === assignment.crew_id);
    const flight = flights.find((f) => f.flight_id === assignment.flight_id);

    return {
      ...assignment,
      crewName: crew ? crew.name : "Unknown",
      crewRole: crew?.role || "Unknown",
      flightRoute: flight ? `${flight.origin} → ${flight.dest}` : "Unknown",
      departureTime: flight?.dep_time || "Unknown",
      arrivalTime: flight?.arr_time || "Unknown",
    };
  });

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
                      const crew = crewMembers.find((c) => c.id.toString() === value);
                      setSelectedCrew(crew);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crew member" />
                    </SelectTrigger>
                    <SelectContent>
                      {crewMembers.map((crew) => (
                        <SelectItem key={crew.id} value={crew.id.toString()}>
                          {crew.id} - {crew.name} ({crew.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flight">Flight</Label>
                  <Select
                    onValueChange={(value) => {
                      const flight = flights.find((f) => f.flight_id === value);
                      setSelectedFlight(flight);
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
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Certifications</TableHead>
                        <TableHead>Availability</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCrewMembers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No crew members found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCrewMembers.map((crew) => (
                          <TableRow key={crew.id}>
                            <TableCell className="font-medium">{crew.id}</TableCell>
                            <TableCell>{crew.name}</TableCell>
                            <TableCell>{crew.role}</TableCell>
                            <TableCell>{crew.certifications.join(", ")}</TableCell>
                            <TableCell>{crew.availability}</TableCell>
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
                    <Label htmlFor="name">Name*</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., John Doe"
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
                        <SelectItem value="Co-Pilot">Co-Pilot</SelectItem>
                        <SelectItem value="Flight Attendant">Flight Attendant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                    <Input
                      id="certifications"
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleInputChange}
                      placeholder="e.g., Boeing 737, Airbus A320"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability (YYYY-MM-DD HH:MM)</Label>
                    <Input
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      placeholder="e.g., 2025-03-08 08:00"
                    />
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
                            <TableCell className="font-medium">{assignment.crew_id}</TableCell>
                            <TableCell>{assignment.crewName}</TableCell>
                            <TableCell>{assignment.crewRole}</TableCell>
                            <TableCell>{assignment.flight_id}</TableCell>
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
                                onClick={() => handleRemoveAssignment(assignment.crew_id, assignment.flight_id)}
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
  );
}