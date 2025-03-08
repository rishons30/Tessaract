import { useState } from 'react';
import { mockFlightData } from '../mockData';
import { ArrowUpDown, Plane } from 'lucide-react';

function Schedule() {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedFlight, setSelectedFlight] = useState(null);

  const flights = mockFlightData[0].events;

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
                <td>{flight.dep_time}</td>
                <td>{flight.arr_time}</td>
                <td>{flight.min_seating_capacity}</td>
                <td>{flight.ground_time} min</td>
                <td>{flight.passengers}</td>
                <td>{flight.onward_flight || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
            <button onClick={() => setSelectedFlight(null)} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedule;