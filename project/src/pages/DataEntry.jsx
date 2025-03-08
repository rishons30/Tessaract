import { useState } from 'react';
import { PlaneLanding, PlaneTakeoff } from 'lucide-react';

function DataEntry() {
  const [activeForm, setActiveForm] = useState('flight');
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
  const [message, setMessage] = useState('');

  const handleFlightSubmit = (e) => {
    e.preventDefault();
    const formattedFlight = {
      ...flightData,
      dep_time: new Date(flightData.dep_time).toISOString().replace('T', ' ').slice(0, 16),
      arr_time: new Date(flightData.arr_time).toISOString().replace('T', ' ').slice(0, 16),
      min_seating_capacity: parseInt(flightData.min_seating_capacity),
      ground_time: parseInt(flightData.ground_time),
      passengers: parseInt(flightData.passengers),
      distance: parseInt(flightData.distance),
      onward_flight: flightData.onward_flight || null
    };
    fetch('http://localhost:5000/flights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedFlight)
    })
      .then(response => response.json())
      .then(data => {
        setMessage('Flight added successfully!');
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
        setTimeout(() => setMessage(''), 3000);
      })
      .catch(error => {
        setMessage('Error adding flight: ' + error.message);
        setTimeout(() => setMessage(''), 3000);
      });
  };

  const handleAircraftSubmit = (e) => {
    e.preventDefault();
    const formattedAircraft = {
      ...aircraftData,
      capacity: parseInt(aircraftData.capacity),
      base_fuel: parseFloat(aircraftData.base_fuel),
      efficiency: parseFloat(aircraftData.efficiency),
      pre_assignments: aircraftData.pre_assignments 
        ? [{ start: "2025-03-07 " + aircraftData.pre_assignments.split('-')[0], end: "2025-03-07 " + aircraftData.pre_assignments.split('-')[1] }] 
        : []
    };
    fetch('http://localhost:5000/aircraft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedAircraft)
    })
      .then(response => response.json())
      .then(data => {
        setMessage('Aircraft added successfully!');
        setAircraftData({
          tail_num: '',
          subtype: '',
          capacity: '',
          base_fuel: '',
          efficiency: '',
          pre_assignments: ''
        });
        setTimeout(() => setMessage(''), 3000);
      })
      .catch(error => {
        setMessage('Error adding aircraft: ' + error.message);
        setTimeout(() => setMessage(''), 3000);
      });
  };

  return (
    <div className="container">
      <h2 className="page-title">Data Entry</h2>

      <div className="toggle-buttons">
        <button
          className={activeForm === 'flight' ? 'active' : ''}
          onClick={() => setActiveForm('flight')}
        >
          Add Flight
        </button>
        <button
          className={activeForm === 'aircraft' ? 'active' : ''}
          onClick={() => setActiveForm('aircraft')}
        >
          Add Aircraft
        </button>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'chaos-alert' : 'chaos-alert'} style={{ background: message.includes('Error') ? 'var(--red-500)' : 'var(--primary)' }}>
          <span>{message}</span>
        </div>
      )}

      <div className="forms-container">
        {activeForm === 'flight' ? (
          <div className="form-section">
            <h3>
              <PlaneTakeoff size={24} className="inline-icon" />
              Add Flight
            </h3>
            <form onSubmit={handleFlightSubmit} className="data-form">
              <div className="form-group">
                <label>Flight ID</label>
                <input
                  type="text"
                  value={flightData.flight_id}
                  onChange={(e) => setFlightData({...flightData, flight_id: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Departure Time</label>
                  <input
                    type="datetime-local"
                    value={flightData.dep_time}
                    onChange={(e) => setFlightData({...flightData, dep_time: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Arrival Time</label>
                  <input
                    type="datetime-local"
                    value={flightData.arr_time}
                    onChange={(e) => setFlightData({...flightData, arr_time: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Origin</label>
                  <input
                    type="text"
                    value={flightData.origin}
                    onChange={(e) => setFlightData({...flightData, origin: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Destination</label>
                  <input
                    type="text"
                    value={flightData.dest}
                    onChange={(e) => setFlightData({...flightData, dest: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Aircraft Subtype</label>
                  <input
                    type="text"
                    value={flightData.subtype}
                    onChange={(e) => setFlightData({...flightData, subtype: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Min Seating Capacity</label>
                  <input
                    type="number"
                    value={flightData.min_seating_capacity}
                    onChange={(e) => setFlightData({...flightData, min_seating_capacity: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ground Time (minutes)</label>
                  <input
                    type="number"
                    value={flightData.ground_time}
                    onChange={(e) => setFlightData({...flightData, ground_time: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Onward Flight ID</label>
                  <input
                    type="text"
                    value={flightData.onward_flight}
                    onChange={(e) => setFlightData({...flightData, onward_flight: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Passengers</label>
                  <input
                    type="number"
                    value={flightData.passengers}
                    onChange={(e) => setFlightData({...flightData, passengers: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Distance (km)</label>
                  <input
                    type="number"
                    value={flightData.distance}
                    onChange={(e) => setFlightData({...flightData, distance: e.target.value})}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="submit-button">Add Flight</button>
            </form>
          </div>
        ) : (
          <div className="form-section">
            <h3>
              <PlaneLanding size={24} className="inline-icon" />
              Add Aircraft
            </h3>
            <form onSubmit={handleAircraftSubmit} className="data-form">
              <div className="form-group">
                <label>Tail Number</label>
                <input
                  type="text"
                  value={aircraftData.tail_num}
                  onChange={(e) => setAircraftData({...aircraftData, tail_num: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Subtype</label>
                  <input
                    type="text"
                    value={aircraftData.subtype}
                    onChange={(e) => setAircraftData({...aircraftData, subtype: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    value={aircraftData.capacity}
                    onChange={(e) => setAircraftData({...aircraftData, capacity: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Base Fuel Consumption</label>
                  <input
                    type="number"
                    step="0.1"
                    value={aircraftData.base_fuel}
                    onChange={(e) => setAircraftData({...aircraftData, base_fuel: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fuel Efficiency</label>
                  <input
                    type="number"
                    step="0.01"
                    value={aircraftData.efficiency}
                    onChange={(e) => setAircraftData({...aircraftData, efficiency: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Pre-assignments (HH:MM-HH:MM)</label>
                <input
                  type="text"
                  value={aircraftData.pre_assignments}
                  onChange={(e) => setAircraftData({...aircraftData, pre_assignments: e.target.value})}
                  placeholder="12:00-14:00"
                />
              </div>
              <button type="submit" className="submit-button">Add Aircraft</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataEntry;