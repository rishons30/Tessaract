// API service functions to interact with the backend

export async function fetchSchedule(filters = {}) {
  try {
    const queryParams = new URLSearchParams()

    // Add filters to query params
    if (filters.subtype) queryParams.append("subtype", filters.subtype)
    if (filters.start_date) queryParams.append("start_date", filters.start_date)
    if (filters.end_date) queryParams.append("end_date", filters.end_date)
    if (filters.respect_pre !== undefined) queryParams.append("respect_pre", filters.respect_pre)
    if (filters.exclude_tails) queryParams.append("exclude_tails", filters.exclude_tails)
    if (filters.break_trips !== undefined) queryParams.append("break_trips", filters.break_trips)

    const response = await fetch(`http://localhost:5000/schedule?${queryParams}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch schedule:", error)
    throw error
  }
}

export async function fetchDisruptions(filters = {}) {
  try {
    const queryParams = new URLSearchParams()

    // Add filters to query params
    if (filters.subtype) queryParams.append("subtype", filters.subtype)
    if (filters.start_date) queryParams.append("start_date", filters.start_date)
    if (filters.end_date) queryParams.append("end_date", filters.end_date)
    if (filters.respect_pre !== undefined) queryParams.append("respect_pre", filters.respect_pre)
    if (filters.exclude_tails) queryParams.append("exclude_tails", filters.exclude_tails)
    if (filters.break_trips !== undefined) queryParams.append("break_trips", filters.break_trips)

    const response = await fetch(`http://localhost:5000/disruptions?${queryParams}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch disruptions:", error)
    throw error
  }
}

export async function fetchStatistics() {
  try {
    const response = await fetch("http://localhost:5000/statistics")

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch statistics:", error)
    throw error
  }
}

export async function fetchAircraft() {
  try {
    const response = await fetch("http://localhost:5000/aircraft")

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch aircraft:", error)
    throw error
  }
}

export async function fetchFlights() {
  try {
    const response = await fetch("http://localhost:5000/flights")

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch flights:", error)
    throw error
  }
}

export async function addAircraft(aircraftData) {
  try {
    const response = await fetch("http://localhost:5000/aircraft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(aircraftData),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to add aircraft:", error)
    throw error
  }
}

export async function addFlight(flightData) {
  try {
    const response = await fetch("http://localhost:5000/flights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flightData),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to add flight:", error)
    throw error
  }
}

// Crew Management API Functions
export async function fetchCrewMembers() {
  try {
    // For now, we'll use localStorage since the backend API doesn't have crew endpoints yet
    const crewMembers = localStorage.getItem("crewMembers")
    return crewMembers ? JSON.parse(crewMembers) : []

    // When backend is ready, use this:
    // const response = await fetch('http://localhost:5000/crew');
    // if (!response.ok) {
    //   throw new Error(`API error: ${response.status}`);
    // }
    // return await response.json();
  } catch (error) {
    console.error("Failed to fetch crew members:", error)
    throw error
  }
}

export async function addCrewMember(crewData) {
  try {
    // For now, we'll use localStorage since the backend API doesn't have crew endpoints yet
    const crewMembers = await fetchCrewMembers()
    const newCrewMember = {
      id: crewMembers.length + 1,
      ...crewData,
    }
    const updatedCrewMembers = [...crewMembers, newCrewMember]
    localStorage.setItem("crewMembers", JSON.stringify(updatedCrewMembers))
    return newCrewMember

    // When backend is ready, use this:
    // const response = await fetch('http://localhost:5000/crew', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(crewData),
    // });
    // if (!response.ok) {
    //   throw new Error(`API error: ${response.status}`);
    // }
    // return await response.json();
  } catch (error) {
    console.error("Failed to add crew member:", error)
    throw error
  }
}

export async function assignCrewToFlight(crewId, flightId) {
  try {
    // For now, we'll use localStorage since the backend API doesn't have crew endpoints yet
    const crewAssignments = localStorage.getItem("crewAssignments")
      ? JSON.parse(localStorage.getItem("crewAssignments"))
      : []

    const newAssignment = { crewId, flightId, assignedAt: new Date().toISOString() }
    const updatedAssignments = [...crewAssignments, newAssignment]
    localStorage.setItem("crewAssignments", JSON.stringify(updatedAssignments))
    return newAssignment

    // When backend is ready, use this:
    // const response = await fetch('http://localhost:5000/crew/assign', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ crewId, flightId }),
    // });
    // if (!response.ok) {
    //   throw new Error(`API error: ${response.status}`);
    // }
    // return await response.json();
  } catch (error) {
    console.error("Failed to assign crew to flight:", error)
    throw error
  }
}

export async function getCrewAssignments() {
  try {
    // For now, we'll use localStorage since the backend API doesn't have crew endpoints yet
    const crewAssignments = localStorage.getItem("crewAssignments")
    return crewAssignments ? JSON.parse(crewAssignments) : []

    // When backend is ready, use this:
    // const response = await fetch('http://localhost:5000/crew/assignments');
    // if (!response.ok) {
    //   throw new Error(`API error: ${response.status}`);
    // }
    // return await response.json();
  } catch (error) {
    console.error("Failed to fetch crew assignments:", error)
    throw error
  }
}

export async function removeCrewAssignment(crewId, flightId) {
  try {
    // For now, we'll use localStorage since the backend API doesn't have crew endpoints yet
    const crewAssignments = await getCrewAssignments()
    const updatedAssignments = crewAssignments.filter(
      (assignment) => !(assignment.crewId === crewId && assignment.flightId === flightId),
    )
    localStorage.setItem("crewAssignments", JSON.stringify(updatedAssignments))
    return { success: true }

    // When backend is ready, use this:
    // const response = await fetch('http://localhost:5000/crew/assignments/remove', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ crewId, flightId }),
    // });
    // if (!response.ok) {
    //   throw new Error(`API error: ${response.status}`);
    // }
    // return await response.json();
  } catch (error) {
    console.error("Failed to remove crew assignment:", error)
    throw error
  }
}

