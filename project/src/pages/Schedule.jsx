import { useState, useEffect } from 'react';
import { ArrowUpDown, Plane } from 'lucide-react';

function Schedule() {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [flights, setFlights] = useState([]);
  const [filters, setFilters] = useState({
    subtype: '',
    start_date: '2025-03-07',
    end_date: '2025-03-07',
    respect_pre: true,
    exclude_tails: '',
    break_trips: false
  });

  useEffect(() => {
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
      .then(data => setFlights(data.events || []))
      .catch(error => console.error('Error fetching schedule:', error));
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedFlights = [...flights].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    return sortDirection === 'asc' 
      ? aValue > bValue ? 1 : -1
      : aValue < bValue ? 1 : -1;
  });

  return (
    <div className="container">
      <h2 className="page-title">Flight Schedule</h2>
      
      {/* Filter Form */}
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

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('flight_id')}>
                Flight ID <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('tail_num')}>
                Tail Number <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('origin')}>
                Origin <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('dest')}>
                Destination <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('dep_time')}>
                Departure <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('arr_time')}>
                Arrival <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('min_seating_capacity')}>
                Min Seats <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('ground_time')}>
                Ground Time <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('passengers')}>
                Passengers <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('carbon')}>
                CO2 (kg) <ArrowUpDown size={16} />
              </th>
              <th>Onward Flight</th>
            </tr>
          </thead>
          <tbody>
            {sortedFlights.map((flight) => (
              <tr 
                key={flight.flight_id}
                onClick={() => setSelectedFlight(flight)}
                className={selectedFlight?.flight_id === flight.flight_id ? 'selected' : ''}
              >
                <td>{flight.flight_id}</td>
                <td>{flight.tail_num}</td>
                <td>{flight.origin}</td>
                <td>{flight.dest}</td>
                <td>{flight.dep_time.split(' ')[1]}</td>
                <td>{flight.arr_time.split(' ')[1]}</td>
                <td>{flight.min_seating_capacity}</td>
                <td>{flight.ground_time} min</td>
                <td>{flight.passengers}</td>
                <td>{flight.carbon.toFixed(2)}</td>
                <td>{flight.onward_flight || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup */}
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