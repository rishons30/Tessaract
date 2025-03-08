import { useState } from 'react';
import { PlaneLanding, PlaneTakeoff } from 'lucide-react';

function DataEntry() {
  const [flightData, setFlightData] = useState({
    flight_id: '',
    dep_time: '',
    arr_time: '',
    origin: '',
    dest: '',
    subtype: '',
    min_seating_capacity: '',
    ground_time: '',
    onward_flight: '',
    passengers: '',
    distance: ''
  });

  const [aircraftData, setAircraftData] = useState({
    tail_num: '',
    subtype: '',
    capacity: '',
    base_fuel: '',
    efficiency: '',
    pre_assignments: ''
  });

  const handleFlightSubmit = (e) => {
    e.preventDefault();
    console.log('Flight Data:', flightData);
    // Reset form
    setFlightData({
      flight_id: '',
      dep_time: '',
      arr_time: '',
      origin: '',
      dest: '',
      subtype: '',
      min_seating_capacity: '',
      ground_time: '',
      onward_flight: '',
      passengers: '',
      distance: ''
    });
  };

  const handleAircraftSubmit = (e) => {
    e.preventDefault();
    console.log('Aircraft Data:', aircraftData);
    // Reset form
    setAircraftData({
      tail_num: '',
      subtype: '',
      capacity: '',
      base_fuel: '',
      efficiency: '',
      pre_assignments: ''
    });
  };

  return (
    <div className="container">
      <h2 className="page-title">Data Entry</h2>
      
      <div className="forms-container">
        <div className="form-section">
          <h3>
            <PlaneTakeoff size={24} className="inline-icon" />
            Add Flight
          </h3>
          <form onSubmit={handleFlightSubmit} className="data-form">
            <div className="form-group">
              <label htmlFor="flight_id">Flight ID</label>
              <input
                type="text"
                id="flight_id"
                value={flightData.flight_id}
                onChange={(e) => setFlightData({...flightData, flight_id: e.target.value})}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dep_time">Departure Time</label>
                <input
                  type="datetime-local"
                  id="dep_time"
                  value={flightData.dep_time}
                  onChange={(e) => setFlightData({...flightData, dep_time: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="arr_time">Arrival Time</label>
                <input
                  type="datetime-local"
                  id="arr_time"
                  value={flightData.arr_time}
                  onChange={(e) => setFlightData({...flightData, arr_time: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="origin">Origin</label>
                <input
                  type="text"
                  id="origin"
                  value={flightData.origin}
                  onChange={(e) => setFlightData({...flightData, origin: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dest">Destination</label>
                <input
                  type="text"
                  id="dest"
                  value={flightData.dest}
                  onChange={(e) => setFlightData({...flightData, dest: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subtype">Aircraft Subtype</label>
                <input
                  type="text"
                  id="subtype"
                  value={flightData.subtype}
                  onChange={(e) => setFlightData({...flightData, subtype: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="min_seating_capacity">Min Seating Capacity</label>
                <input
                  type="number"
                  id="min_seating_capacity"
                  value={flightData.min_seating_capacity}
                  onChange={(e) => setFlightData({...flightData, min_seating_capacity: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ground_time">Ground Time (minutes)</label>
                <input
                  type="number"
                  id="ground_time"
                  value={flightData.ground_time}
                  onChange={(e) => setFlightData({...flightData, ground_time: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="onward_flight">Onward Flight ID</label>
                <input
                  type="text"
                  id="onward_flight"
                  value={flightData.onward_flight}
                  onChange={(e) => setFlightData({...flightData, onward_flight: e.target.value})}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="passengers">Passengers</label>
                <input
                  type="number"
                  id="passengers"
                  value={flightData.passengers}
                  onChange={(e) => setFlightData({...flightData, passengers: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="distance">Distance (km)</label>
                <input
                  type="number"
                  id="distance"
                  value={flightData.distance}
                  onChange={(e) => setFlightData({...flightData, distance: e.target.value})}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-button">Add Flight</button>
          </form>
        </div>

        <div className="form-section">
          <h3>
            <PlaneLanding size={24} className="inline-icon" />
            Add Aircraft
          </h3>
          <form onSubmit={handleAircraftSubmit} className="data-form">
            <div className="form-group">
              <label htmlFor="tail_num">Tail Number</label>
              <input
                type="text"
                id="tail_num"
                value={aircraftData.tail_num}
                onChange={(e) => setAircraftData({...aircraftData, tail_num: e.target.value})}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="aircraft_subtype">Subtype</label>
                <input
                  type="text"
                  id="aircraft_subtype"
                  value={aircraftData.subtype}
                  onChange={(e) => setAircraftData({...aircraftData, subtype: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  value={aircraftData.capacity}
                  onChange={(e) => setAircraftData({...aircraftData, capacity: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="base_fuel">Base Fuel Consumption</label>
                <input
                  type="number"
                  id="base_fuel"
                  value={aircraftData.base_fuel}
                  onChange={(e) => setAircraftData({...aircraftData, base_fuel: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="efficiency">Fuel Efficiency</label>
                <input
                  type="number"
                  id="efficiency"
                  value={aircraftData.efficiency}
                  onChange={(e) => setAircraftData({...aircraftData, efficiency: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="pre_assignments">Pre-assignments (HH:MM-HH:MM)</label>
              <input
                type="text"
                id="pre_assignments"
                value={aircraftData.pre_assignments}
                onChange={(e) => setAircraftData({...aircraftData, pre_assignments: e.target.value})}
                placeholder="12:00-14:00"
              />
            </div>

            <button type="submit" className="submit-button">Add Aircraft</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DataEntry;