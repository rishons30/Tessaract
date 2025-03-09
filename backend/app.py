import json
import numpy as np
from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# File paths
AIRCRAFT_FILE = "aircraft.json"
FLIGHTS_FILE = "flights.json"
RESULTS_DB_FILE = "results_db.json"
CREW_FILE = "crew.json"
CREW_ASSIGNMENTS_FILE = "crew_assignments.json"

# Load initial data
def load_data(file_path, default):
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        with open(file_path, "w") as f:
            json.dump(default, f, indent=2)
        return default
    except json.JSONDecodeError:
        return default

aircraft_data = load_data(AIRCRAFT_FILE, {"aircraft": []})
flights_data = load_data(FLIGHTS_FILE, {"flights": []})
results_db = load_data(RESULTS_DB_FILE, [])
crew_data = load_data(CREW_FILE, {"crew": []})
crew_assignments = load_data(CREW_ASSIGNMENTS_FILE, {"assignments": []})

# Helper functions
def parse_time(time_str):
    return datetime.strptime(time_str, "%Y-%m-%d %H:%M")

def is_available(tail, flight, assignments, aircraft_list, respect_pre=True):
    dep = parse_time(flight["dep_time"])
    arr = parse_time(flight["arr_time"])
    ground = timedelta(minutes=flight["ground_time"])
    for assigned_flight_id, assigned_tail in assignments.items():
        if assigned_tail == tail:
            f = next(f for f in flights_data["flights"] if f["flight_id"] == assigned_flight_id)
            f_dep = parse_time(f["dep_time"])
            f_arr = parse_time(f["arr_time"])
            if not (arr + ground <= f_dep or f_arr + ground <= dep):
                return False
    if respect_pre:
        aircraft = next((a for a in aircraft_list if a["tail_num"] == tail), None)
        if not aircraft:
            return False
        for pre in aircraft["pre_assignments"]:
            pre_start = parse_time(pre["start"])
            pre_end = parse_time(pre["end"])
            if not (arr <= pre_start or dep >= pre_end):
                return False
    return True

def calc_co2(flight, tail, aircraft_list):
    aircraft = next(a for a in aircraft_list if a["tail_num"] == tail)
    return flight["distance"] * aircraft["base_fuel"] / aircraft["efficiency"]

# RL Optimization
def run_rl(chaos=False, respect_pre=True, break_trips=False):
    flight_list = flights_data["flights"]
    aircraft_list = aircraft_data["aircraft"]
    if not flight_list or not aircraft_list:
        return {"error": "No flights or aircraft available"}

    flight_ids = [f["flight_id"] for f in flight_list]
    aircraft_ids = [a["tail_num"] for a in aircraft_list]
    q_table = np.zeros((len(flight_ids), len(aircraft_ids)))
    alpha, gamma, epsilon = 0.1, 0.9, 0.1

    assignments = {}
    for epoch in range(20):
        state = 0
        current_assignments = assignments.copy()
        while state < len(flight_ids):
            flight_id = flight_ids[state]
            flight = flight_list[state]
            action = np.random.randint(len(aircraft_ids)) if np.random.rand() < epsilon else np.argmax(q_table[state])
            tail = aircraft_ids[action]
            valid = (flight["subtype"] == next(a["subtype"] for a in aircraft_list if a["tail_num"] == tail) and
                     next(a["capacity"] for a in aircraft_list if a["tail_num"] == tail) >= flight["min_seating_capacity"] and
                     is_available(tail, flight, current_assignments, aircraft_list, respect_pre))
            if not break_trips and flight["onward_flight"] and flight["onward_flight"] in current_assignments:
                valid = valid and current_assignments[flight["onward_flight"]] == tail
            co2 = calc_co2(flight, tail, aircraft_list) * (1.2 if chaos and epoch == 10 else 1.0)
            reward = 100 - co2 / 100 if valid else -100
            if valid:
                current_assignments[flight_id] = tail
            next_max = np.max(q_table[state + 1]) if state + 1 < len(flight_ids) else 0
            q_table[state, action] = (1 - alpha) * q_table[state, action] + alpha * (reward + gamma * next_max)
            state += 1
        if epoch == 19 or (chaos and epoch == 11):
            assignments = current_assignments.copy()
            events = [{"flight_id": fid, "tail_num": tail, "origin": f["origin"], "dest": f["dest"],
                       "dep_time": f["dep_time"], "arr_time": f["arr_time"], "min_seating_capacity": f["min_seating_capacity"],
                       "ground_time": f["ground_time"], "onward_flight": f["onward_flight"], "passengers": f["passengers"],
                       "carbon": calc_co2(f, tail, aircraft_list) * (1.2 if chaos and epoch == 11 else 1.0)}
                      for fid, tail in assignments.items() for f in flight_list if f["flight_id"] == fid]
            chaos_recovered = len(assignments) - len([e for e in events if e["carbon"] > 500]) if chaos else 0
            result = {"timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"), "mode": "chaos" if chaos else "normal",
                      "assignments": assignments, "events": events, "chaos_recovered": chaos_recovered}
            results_db.append(result)
            with open(RESULTS_DB_FILE, "w") as f:
                json.dump(results_db, f, indent=2)
            with open(f"{result['mode']}_results.json", "w") as f:
                json.dump(result, f, indent=2)
            assignments = current_assignments
    return result

# Existing API Endpoints
@app.route("/schedule", methods=["GET"])
def get_schedule():
    global flights_data, aircraft_data
    subtype = request.args.get('subtype')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    respect_pre = request.args.get('respect_pre', 'true').lower() == 'true'
    exclude_tails = request.args.get('exclude_tails', '').split(',')
    break_trips = request.args.get('break_trips', 'false').lower() == 'true'

    filtered_flights = [f for f in flights_data["flights"] if (not subtype or f["subtype"] == subtype) and
                        (not start_date or f["dep_time"] >= start_date) and
                        (not end_date or f["arr_time"] <= end_date + " 23:59")]
    filtered_aircraft = [a for a in aircraft_data["aircraft"] if a["tail_num"] not in exclude_tails and a["tail_num"] != ""]

    temp_flights = flights_data.copy()
    temp_aircraft = aircraft_data.copy()
    flights_data["flights"] = filtered_flights
    aircraft_data["aircraft"] = filtered_aircraft
    result = run_rl(chaos=False, respect_pre=respect_pre, break_trips=break_trips)
    flights_data = temp_flights
    aircraft_data = temp_aircraft
    return jsonify(next(r for r in results_db if r["mode"] == "normal"))

@app.route("/disruptions", methods=["GET"])
def get_disruptions():
    global flights_data, aircraft_data
    subtype = request.args.get('subtype')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    respect_pre = request.args.get('respect_pre', 'true').lower() == 'true'
    exclude_tails = request.args.get('exclude_tails', '').split(',')
    break_trips = request.args.get('break_trips', 'false').lower() == 'true'

    filtered_flights = [f for f in flights_data["flights"] if (not subtype or f["subtype"] == subtype) and
                        (not start_date or f["dep_time"] >= start_date) and
                        (not end_date or f["arr_time"] <= end_date + " 23:59")]
    filtered_aircraft = [a for a in aircraft_data["aircraft"] if a["tail_num"] not in exclude_tails and a["tail_num"] != ""]

    temp_flights = flights_data.copy()
    temp_aircraft = aircraft_data.copy()
    flights_data["flights"] = filtered_flights
    aircraft_data["aircraft"] = filtered_aircraft
    result = run_rl(chaos=True, respect_pre=respect_pre, break_trips=break_trips)
    flights_data = temp_flights
    aircraft_data = temp_aircraft
    return jsonify(next(r for r in results_db if r["mode"] == "chaos"))

@app.route("/aircraft", methods=["GET"])
def get_aircraft():
    return jsonify(aircraft_data)

@app.route("/aircraft", methods=["POST"])
def add_aircraft():
    data = request.json
    required = ["tail_num", "subtype", "capacity", "base_fuel", "efficiency"]
    if not all(k in data for k in required):
        return jsonify({"error": "Missing required fields"}), 400
    data["pre_assignments"] = data.get("pre_assignments", [])
    aircraft_data["aircraft"].append(data)
    with open(AIRCRAFT_FILE, "w") as f:
        json.dump(aircraft_data, f, indent=2)
    return jsonify({"message": "Aircraft added successfully"}), 201

@app.route("/flights", methods=["GET"])
def get_flights():
    return jsonify(flights_data)

@app.route("/flights", methods=["POST"])
def add_flight():
    data = request.json
    required = ["flight_id", "dep_time", "arr_time", "origin", "dest", "subtype", "min_seating_capacity", "ground_time", "passengers", "distance"]
    if not all(k in data for k in required):
        return jsonify({"error": "Missing required fields"}), 400
    data["onward_flight"] = data.get("onward_flight", None)
    flights_data["flights"].append(data)
    with open(FLIGHTS_FILE, "w") as f:
        json.dump(flights_data, f, indent=2)
    return jsonify({"message": "Flight added successfully"}), 201

@app.route("/statistics", methods=["GET"])
def get_statistics():
    if not results_db:
        return jsonify({"error": "No results available yet"}), 404
    latest = results_db[-1]
    stats = {
        "total_flights": len(latest["events"]),
        "avg_passengers": sum(e["passengers"] for e in latest["events"]) / len(latest["events"]),
        "total_co2": sum(e["carbon"] for e in latest["events"]),
        "chaos_recovered": latest["chaos_recovered"]
    }
    return jsonify(stats)

# Crew Management Endpoints
@app.route("/crew", methods=["GET"])
def get_crew():
    """Retrieve all crew members."""
    try:
        return jsonify(crew_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/crew", methods=["POST"])
def add_crew():
    """Add a new crew member."""
    try:
        new_crew = request.json
        required = ["name", "role", "certifications"]
        if not all(k in new_crew for k in required):
            return jsonify({"error": "Missing required fields"}), 400
        
        new_crew["id"] = max([c["id"] for c in crew_data["crew"]], default=0) + 1
        new_crew["availability"] = new_crew.get("availability", datetime.now().strftime("%Y-%m-%d %H:%M"))
        
        crew_data["crew"].append(new_crew)
        with open(CREW_FILE, "w") as f:
            json.dump(crew_data, f, indent=2)
        return jsonify({"message": "Crew member added successfully", "crew": new_crew}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/crew/assign", methods=["POST"])
def assign_crew():
    """Assign a crew member to a flight."""
    try:
        assignment = request.json
        required = ["crew_id", "flight_id"]
        if not all(k in assignment for k in required):
            return jsonify({"error": "Missing required fields"}), 400
        
        crew_member = next((c for c in crew_data["crew"] if c["id"] == assignment["crew_id"]), None)
        flight = next((f for f in flights_data["flights"] if f["flight_id"] == assignment["flight_id"]), None)
        if not crew_member:
            return jsonify({"error": "Crew member not found"}), 404
        if not flight:
            return jsonify({"error": "Flight not found"}), 404
        
        # Optional: Check if crew is certified for the aircraft subtype
        if crew_member["role"] in ["Pilot", "Co-Pilot"] and flight["subtype"] not in crew_member["certifications"]:
            return jsonify({"error": "Crew member not certified for this aircraft subtype"}), 403
        
        new_assignment = {
            "crew_id": assignment["crew_id"],
            "flight_id": assignment["flight_id"],
            "assigned_at": datetime.now().isoformat()
        }
        crew_assignments["assignments"].append(new_assignment)
        with open(CREW_ASSIGNMENTS_FILE, "w") as f:
            json.dump(crew_assignments, f, indent=2)
        return jsonify({"message": "Crew assigned successfully", "assignment": new_assignment}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/crew/assignments", methods=["GET"])
def get_crew_assignments():
    """Retrieve all crew assignments."""
    try:
        return jsonify(crew_assignments)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/crew/assignments/remove", methods=["POST"])
def remove_crew_assignment():
    """Remove a crew assignment."""
    try:
        data = request.json
        required = ["crew_id", "flight_id"]
        if not all(k in data for k in required):
            return jsonify({"error": "Missing required fields"}), 400
        
        crew_id = data["crew_id"]
        flight_id = data["flight_id"]
        
        initial_len = len(crew_assignments["assignments"])
        crew_assignments["assignments"] = [
            a for a in crew_assignments["assignments"]
            if not (a["crew_id"] == crew_id and a["flight_id"] == flight_id)
        ]
        
        if len(crew_assignments["assignments"]) == initial_len:
            return jsonify({"error": "Assignment not found"}), 404
        
        with open(CREW_ASSIGNMENTS_FILE, "w") as f:
            json.dump(crew_assignments, f, indent=2)
        return jsonify({"message": "Crew assignment removed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)