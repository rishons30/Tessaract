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
    <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
      <h2 style={{ color: '#4CAF50', marginTop: '60px', textAlign: 'center' }}>Flight Schedule</h2>
      
      {/* Filter Form */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px', padding: '15px', background: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#4CAF50' }}>Subtype</label>
          <input 
            name="subtype" 
            value={filters.subtype} 
            onChange={handleFilterChange} 
            placeholder="e.g., Boeing 737-800" 
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#4CAF50' }}>Start Date</label>
          <input 
            type="date" 
            name="start_date" 
            value={filters.start_date} 
            onChange={handleFilterChange} 
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#4CAF50' }}>End Date</label>
          <input 
            type="date" 
            name="end_date" 
            value={filters.end_date} 
            onChange={handleFilterChange} 
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#4CAF50' }}>Respect Pre-assignments</label>
          <input 
            type="checkbox" 
            name="respect_pre" 
            checked={filters.respect_pre} 
            onChange={handleFilterChange} 
            style={{ marginTop: '8px' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#4CAF50' }}>Exclude Tails</label>
          <input 
            name="exclude_tails" 
            value={filters.exclude_tails} 
            onChange={handleFilterChange} 
            placeholder="e.g., N101,N102" 
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#4CAF50' }}>Break Trips</label>
          <input 
            type="checkbox" 
            name="break_trips" 
            checked={filters.break_trips} 
            onChange={handleFilterChange} 
            style={{ marginTop: '8px' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#66BB6A', color: 'white' }}>
              <th onClick={() => handleSort('flight_id')} style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }}>
                Flight ID <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('tail_num')} style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }}>
                Tail Number <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('origin')} style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }}>
                Origin <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('dest')} style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }}>
                Destination <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('dep_time')} style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }}>
                Departure <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('arr_time')} style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }}>
                Arrival <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('min_seating_capacity')} style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }}>
                Min Seats <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('ground_time')} style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }}>
                Ground Time <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('passengers')} style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }}>
                Passengers <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('carbon')} style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }}>
                CO2 (kg) <ArrowUpDown size={16} />
              </th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Onward Flight</th>
            </tr>
          </thead>
          <tbody>
            {sortedFlights.map((flight) => (
              <tr 
                key={flight.flight_id}
                onClick={() => setSelectedFlight(flight)}
                style={{ 
                  borderBottom: '1px solid #ddd', 
                  cursor: 'pointer', 
                  backgroundColor: selectedFlight?.flight_id === flight.flight_id ? '#e0f7fa' : 'transparent' 
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0f7fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedFlight?.flight_id === flight.flight_id ? '#e0f7fa' : 'transparent'}
              >
                <td style={{ padding: '10px' }}>{flight.flight_id}</td>
                <td style={{ padding: '10px' }}>{flight.tail_num}</td>
                <td style={{ padding: '10px' }}>{flight.origin}</td>
                <td style={{ padding: '10px' }}>{flight.dest}</td>
                <td style={{ padding: '10px' }}>{flight.dep_time.split(' ')[1]}</td>
                <td style={{ padding: '10px' }}>{flight.arr_time.split(' ')[1]}</td>
                <td style={{ padding: '10px' }}>{flight.min_seating_capacity}</td>
                <td style={{ padding: '10px' }}>{flight.ground_time} min</td>
                <td style={{ padding: '10px' }}>{flight.passengers}</td>
                <td style={{ padding: '10px' }}>{flight.carbon.toFixed(2)}</td>
                <td style={{ padding: '10px' }}>{flight.onward_flight || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup */}
      {selectedFlight && (
        <div style={{ 
          position: 'fixed', 
          top: '0', 
          left: '0', 
          width: '100%', 
          height: '100%', 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <div style={{ 
            background: '#ffffff', 
            padding: '20px', 
            borderRadius: '8px', 
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)', 
            maxWidth: '400px', 
            width: '100%' 
          }}>
            <h3 style={{ color: '#4CAF50', marginBottom: '15px' }}>
              <Plane size={24} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
              Flight Details
            </h3>
            <p style={{ margin: '5px 0' }}><strong>Flight:</strong> {selectedFlight.flight_id}</p>
            <p style={{ margin: '5px 0' }}><strong>Route:</strong> {selectedFlight.origin} → {selectedFlight.dest}</p>
            <p style={{ margin: '5px 0' }}><strong>Aircraft:</strong> {selectedFlight.tail_num}</p>
            <p style={{ margin: '5px 0' }}><strong>Departure:</strong> {selectedFlight.dep_time}</p>
            <p style={{ margin: '5px 0' }}><strong>Arrival:</strong> {selectedFlight.arr_time}</p>
            <p style={{ margin: '5px 0' }}><strong>Passengers:</strong> {selectedFlight.passengers}/{selectedFlight.min_seating_capacity}</p>
            <p style={{ margin: '5px 0' }}><strong>Ground Time:</strong> {selectedFlight.ground_time} minutes</p>
            <p style={{ margin: '5px 0' }}><strong>CO2 Emissions:</strong> {selectedFlight.carbon.toFixed(2)} kg</p>
            <button 
              onClick={() => setSelectedFlight(null)} 
              style={{ 
                marginTop: '15px', 
                padding: '8px 16px', 
                background: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#45a049'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#4CAF50'}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedule;