// Mock data for crew management

export const mockCrewData = [
  {
    id: 1,
    crewID: "CR001",
    firstName: "John",
    lastName: "Smith",
    age: 35,
    airline: "GreenTail",
    currentLocation: "LAX",
    role: "Pilot",
    qualification: "Captain",
    experience: 10,
    status: "Available",
  },
  {
    id: 2,
    crewID: "CR002",
    firstName: "Sarah",
    lastName: "Johnson",
    age: 32,
    airline: "GreenTail",
    currentLocation: "JFK",
    role: "Pilot",
    qualification: "First Officer",
    experience: 7,
    status: "On Duty",
  },
  {
    id: 3,
    crewID: "CR003",
    firstName: "Michael",
    lastName: "Brown",
    age: 28,
    airline: "GreenTail",
    currentLocation: "ORD",
    role: "Flight Attendant",
    qualification: "Lead",
    experience: 5,
    status: "Available",
  },
  {
    id: 4,
    crewID: "CR004",
    firstName: "Emily",
    lastName: "Davis",
    age: 26,
    airline: "GreenTail",
    currentLocation: "DFW",
    role: "Flight Attendant",
    qualification: "Standard",
    experience: 3,
    status: "On Duty",
  },
  {
    id: 5,
    crewID: "CR005",
    firstName: "David",
    lastName: "Wilson",
    age: 40,
    airline: "GreenTail",
    currentLocation: "SFO",
    role: "Pilot",
    qualification: "Captain",
    experience: 15,
    status: "Available",
  },
]

export const mockCrewAssignments = [
  {
    crewId: "CR001",
    flightId: "F001",
    assignedAt: "2025-03-07T08:00:00Z",
  },
  {
    crewId: "CR002",
    flightId: "F001",
    assignedAt: "2025-03-07T08:00:00Z",
  },
  {
    crewId: "CR003",
    flightId: "F002",
    assignedAt: "2025-03-07T10:00:00Z",
  },
  {
    crewId: "CR004",
    flightId: "F002",
    assignedAt: "2025-03-07T10:00:00Z",
  },
]

// Initialize localStorage with mock data if it doesn't exist
if (typeof window !== "undefined") {
  if (!localStorage.getItem("crewMembers")) {
    localStorage.setItem("crewMembers", JSON.stringify(mockCrewData))
  }

  if (!localStorage.getItem("crewAssignments")) {
    localStorage.setItem("crewAssignments", JSON.stringify(mockCrewAssignments))
  }
}

