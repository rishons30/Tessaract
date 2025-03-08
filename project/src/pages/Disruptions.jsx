import { useState, useEffect } from 'react';
import { AlertTriangle, ArrowUpDown } from 'lucide-react';

function Disruptions() {
  const [isChaosMode, setIsChaosMode] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [flights, setFlights] = useState([]);
  const [chaosRecovered, setChaosRecovered] = useState(0);

  useEffect(() => {
    const endpoint = isChaosMode ? 'http://localhost:5000/disruptions' : 'http://localhost:5000/schedule';
    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        setFlights(data.events || []);
        setChaosRecovered(data.chaos_recovered || 0);
      })
      .catch(error => console.error('Error fetching disruptions:', error));
  }, [isChaosMode]);

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
          <span>Chaos Mode Active - {chaosRecovered} Disruptions Recovered</span>
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
                <td>{flight.dep_time.split(' ')[1]}</td>
                <td>{flight.arr_time.split(' ')[1]}</td>
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