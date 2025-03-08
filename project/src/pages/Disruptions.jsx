import { useState } from 'react';
import { AlertTriangle, ArrowUpDown } from 'lucide-react';
import { mockFlightData, mockChaosData } from '../mockData';

function Disruptions() {
  const [isChaosMode, setIsChaosMode] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const currentData = isChaosMode ? mockChaosData[0] : mockFlightData[0];
  const flights = currentData.events;

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
      <div className="disruption-header">
        <h2 className="page-title">Disruption Management</h2>
        <button 
          className={`chaos-button ${isChaosMode ? 'active' : ''}`}
          onClick={() => setIsChaosMode(!isChaosMode)}
        >
          <AlertTriangle size={20} />
          {isChaosMode ? 'Disable Chaos Mode' : 'Trigger Chaos Mode'}
        </button>
      </div>

      {isChaosMode && (
        <div className="chaos-alert">
          <AlertTriangle size={20} />
          <span>Chaos Mode Active - {currentData.chaos_recovered} Disruptions Recovered</span>
        </div>
      )}

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
              <th onClick={() => handleSort('passengers')}>
                Passengers <ArrowUpDown size={16} />
              </th>
              <th onClick={() => handleSort('carbon')}>
                CO2 (kg) <ArrowUpDown size={16} />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedFlights.map((flight) => (
              <tr key={flight.flight_id}>
                <td>{flight.flight_id}</td>
                <td>{flight.tail_num}</td>
                <td>{flight.origin}</td>
                <td>{flight.dest}</td>
                <td>{flight.dep_time}</td>
                <td>{flight.arr_time}</td>
                <td>{flight.passengers}</td>
                <td>{flight.carbon.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Disruptions;