import { useState, useEffect } from 'react';
import { ArrowUpDown, Plane, Wrench } from 'lucide-react';

function Schedule() {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [aircraftSchedules, setAircraftSchedules] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    subtype: '',
    start_date: '2025-03-07',
    end_date: '2025-03-07',
    respect_pre: true,
    exclude_tails: '',
    break_trips: false
  });

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams({
      subtype: filters.subtype,
      start_date: filters.start_date,
      end_date: filters.end_date,
      respect_pre: filters.respect_pre.toString(),
      exclude_tails: filters.exclude_tails,
      break_trips: filters.break_trips.toString()
    });
    fetch(`http://localhost:5000/schedule?${params}`)
      .then(response => response.json())
      .then(data => {
        const flights = data.events || [];
        const schedules = {};
        flights.forEach(flight => {
          const tail = flight.tail_num;
          if (!schedules[tail]) {
            schedules[tail] = [];
          }
          schedules[tail].push(flight);
        });
        // Sort flights by departure time within each aircraft
        Object.keys(schedules).forEach(tail => {
          schedules[tail].sort((a, b) => new Date(a.dep_time) - new Date(b.dep_time));
          // Insert maintenance gaps (assuming 60 min minimum between flights)
          const withGaps = [];
          for (let i = 0; i < schedules[tail].length; i++) {
            withGaps.push(schedules[tail][i]);
            if (i < schedules[tail].length - 1) {
              const currentFlightEnd = new Date(schedules[tail][i].arr_time);
              const nextFlightStart = new Date(schedules[tail][i + 1].dep_time);
              const gapMinutes = (nextFlightStart - currentFlightEnd) / (1000 * 60);
              if (gapMinutes > 60) { // Only show significant gaps
                withGaps.push({ type: 'maintenance', duration: gapMinutes });
              }
            }
          }
          schedules[tail] = withGaps;
        });
        setAircraftSchedules(schedules);
        setTimeout(() => setIsLoading(false), 1000);
      })
      .catch(error => {
        console.error('Error fetching schedule:', error);
        setIsLoading(false);
      });
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="container">
      <h2 className="page-title">Aircraft Flight Chains</h2>
      
      <div className="forms-container">
        <div className="form-section">
          <h3>Filters</h3>
          <div className="data-form">
            <div className="form-row">
              <div className="form-group">
                <label>Subtype</label>
                <input 
                  name="subtype" 
                  value={filters.subtype} 
                  onChange={handleFilterChange} 
                  placeholder="e.g., Boeing 737-800"
                />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input 
                  type="date" 
                  name="start_date" 
                  value={filters.start_date} 
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>End Date</label>
                <input 
                  type="date" 
                  name="end_date" 
                  value={filters.end_date} 
                  onChange={handleFilterChange}
                />
              </div>
              <div className="form-group">
                <label>Respect Pre-assignments</label>
                <input 
                  type="checkbox" 
                  name="respect_pre" 
                  checked={filters.respect_pre} 
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Exclude Tails</label>
                <input 
                  name="exclude_tails" 
                  value={filters.exclude_tails} 
                  onChange={handleFilterChange} 
                  placeholder="e.g., N101,N102"
                />
              </div>
              <div className="form-group">
                <label>Break Trips</label>
                <input 
                  type="checkbox" 
                  name="break_trips" 
                  checked={filters.break_trips} 
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '100%' }}></div>
          </div>
        ) : (
          <div className="aircraft-schedule">
            {Object.keys(aircraftSchedules).map(tail => (
              <div key={tail} className="aircraft-row">
                <div className="aircraft-header">{tail}</div>
                <div className="flight-chain">
                  {aircraftSchedules[tail].map((item, index) => (
                    item.type === 'maintenance' ? (
                      <div key={`${tail}-maintenance-${index}`} className="maintenance-gap">
                        <Wrench size={16} />
                        <span>{item.duration} min Maintenance</span>
                      </div>
                    ) : (
                      <div 
                        key={item.flight_id} 
                        className="flight-block tooltip efficient" 
                        onClick={() => setSelectedFlight(item)}
                        data-tooltip={`Route: ${item.origin} → ${item.dest}`}
                      >
                        <div>{item.flight_id}</div>
                        <div>{item.dep_time.split(' ')[1]} - {item.arr_time.split(' ')[1]}</div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedFlight && (
        <div className="popup">
          <div className="popup-content">
            <h3>
              <Plane size={24} className="inline-icon" />
              Flight Details
            </h3>
            <p><strong>Flight:</strong> {selectedFlight.flight_id}</p>
            <p><strong>Route:</strong> {selectedFlight.origin} → {selectedFlight.dest}</p>
            <p><strong>Aircraft:</strong> {selectedFlight.tail_num}</p>
            <p><strong>Departure:</strong> {selectedFlight.dep_time}</p>
            <p><strong>Arrival:</strong> {selectedFlight.arr_time}</p>
            <p><strong>Passengers:</strong> {selectedFlight.passengers}/{selectedFlight.min_seating_capacity}</p>
            <p><strong>Ground Time:</strong> {selectedFlight.ground_time} minutes</p>
            <p><strong>CO2 Emissions:</strong> {selectedFlight.carbon.toFixed(2)} kg</p>
            <button className="close-button" onClick={() => setSelectedFlight(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedule;