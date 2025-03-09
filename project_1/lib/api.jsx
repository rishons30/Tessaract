// API service functions to interact with the backend

export async function fetchSchedule(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (filters.subtype) queryParams.append("subtype", filters.subtype);
    if (filters.start_date) queryParams.append("start_date", filters.start_date);
    if (filters.end_date) queryParams.append("end_date", filters.end_date);
    if (filters.respect_pre !== undefined) queryParams.append("respect_pre", filters.respect_pre);
    if (filters.exclude_tails) queryParams.append("exclude_tails", filters.exclude_tails);
    if (filters.break_trips !== undefined) queryParams.append("break_trips", filters.break_trips);

    const response = await fetch(`http://localhost:5000/schedule?${queryParams}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch schedule:", error);
    throw error;
  }
}

export async function fetchDisruptions(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (filters.subtype) queryParams.append("subtype", filters.subtype);
    if (filters.start_date) queryParams.append("start_date", filters.start_date);
    if (filters.end_date) queryParams.append("end_date", filters.end_date);
    if (filters.respect_pre !== undefined) queryParams.append("respect_pre", filters.respect_pre);
    if (filters.exclude_tails) queryParams.append("exclude_tails", filters.exclude_tails);
    if (filters.break_trips !== undefined) queryParams.append("break_trips", filters.break_trips);

    const response = await fetch(`http://localhost:5000/disruptions?${queryParams}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch disruptions:", error);
    throw error;
  }
}

export async function fetchStatistics() {
  try {
    const response = await fetch("http://localhost:5000/statistics");
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch statistics:", error);
    throw error;
  }
}

export async function fetchAircraft() {
  try {
    const response = await fetch("http://localhost:5000/aircraft");
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch aircraft:", error);
    throw error;
  }
}

export async function fetchFlights() {
  try {
    const response = await fetch("http://localhost:5000/flights");
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch flights:", error);
    throw error;
  }
}

export async function addAircraft(aircraftData) {
  try {
    const response = await fetch("http://localhost:5000/aircraft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aircraftData),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to add aircraft:", error);
    throw error;
  }
}

export async function addFlight(flightData) {
  try {
    const response = await fetch("http://localhost:5000/flights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(flightData),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to add flight:", error);
    throw error;
  }
}

// Crew Management API Functions
export async function fetchCrewMembers() {
  try {
    console.log("Fetching crew from http://localhost:5000/crew"); // Log start
    const response = await fetch("http://localhost:5000/crew");
    console.log("Response status:", response.status); // Log status
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    console.log("Raw crew data:", data); // Log raw response
    console.log("Processed crew:", data.crew); // Log processed data
    return data.crew; // Return only the crew array
  } catch (error) {
    console.error("Failed to fetch crew members:", error);
    throw error;
  }
}

export async function addCrewMember(crewData) {
  try {
    const response = await fetch("http://localhost:5000/crew", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(crewData),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to add crew member:", error);
    throw error;
  }
}

export async function assignCrewToFlight(crewId, flightId) {
  try {
    const response = await fetch("http://localhost:5000/crew/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crew_id: crewId, flight_id: flightId }),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to assign crew to flight:", error);
    throw error;
  }
}

export async function getCrewAssignments() {
  try {
    const response = await fetch("http://localhost:5000/crew/assignments");
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.assignments; // Return only the assignments array
  } catch (error) {
    console.error("Failed to fetch crew assignments:", error);
    throw error;
  }
}

export async function removeCrewAssignment(crewId, flightId) {
  try {
    const response = await fetch("http://localhost:5000/crew/assignments/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crew_id: crewId, flight_id: flightId }),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to remove crew assignment:", error);
    throw error;
  }
}