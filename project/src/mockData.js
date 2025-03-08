export const mockFlightData = [
  {
    "timestamp": "2025-03-08 14:40",
    "mode": "normal",
    "assignments": {"F001": "N123", "F002": "N123"},
    "events": [
      {
        "flight_id": "F001",
        "tail_num": "N123",
        "origin": "JFK",
        "dest": "LAX",
        "dep_time": "2025-03-07 08:00",
        "arr_time": "2025-03-07 10:00",
        "min_seating_capacity": 160,
        "ground_time": 60,
        "onward_flight": "F002",
        "passengers": 160,
        "carbon": 510.20
      },
      {
        "flight_id": "F002",
        "tail_num": "N123",
        "origin": "LAX",
        "dest": "SFO",
        "dep_time": "2025-03-07 11:00",
        "arr_time": "2025-03-07 12:00",
        "min_seating_capacity": 120,
        "ground_time": 60,
        "onward_flight": null,
        "passengers": 125,
        "carbon": 63.78
      }
    ],
    "chaos_recovered": 0
  }
];

export const mockChaosData = [
  {
    "timestamp": "2025-03-08 14:45",
    "mode": "chaos",
    "assignments": {"F001": "N124", "F002": "N125"},
    "events": [
      {
        "flight_id": "F001",
        "tail_num": "N124",
        "origin": "JFK",
        "dest": "LAX",
        "dep_time": "2025-03-07 08:30",
        "arr_time": "2025-03-07 10:30",
        "min_seating_capacity": 160,
        "ground_time": 60,
        "onward_flight": null,
        "passengers": 160,
        "carbon": 520.50
      },
      {
        "flight_id": "F002",
        "tail_num": "N125",
        "origin": "LAX",
        "dest": "SFO",
        "dep_time": "2025-03-07 11:30",
        "arr_time": "2025-03-07 12:30",
        "min_seating_capacity": 120,
        "ground_time": 60,
        "onward_flight": null,
        "passengers": 125,
        "carbon": 65.20
      }
    ],
    "chaos_recovered": 2
  }
];