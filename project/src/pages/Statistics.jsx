import { useEffect, useState } from 'react';
import { BarChart, Activity, Plane } from 'lucide-react';
import { mockFlightData } from '../mockData';

function Statistics() {
  const [stats, setStats] = useState({
    totalFlights: 0,
    avgPassengers: 0,
    totalCarbon: 0,
    avgCarbon: 0,
    utilization: 0
  });

  useEffect(() => {
    const flights = mockFlightData[0].events;
    const totalFlights = flights.length;
    const totalPassengers = flights.reduce((sum, flight) => sum + flight.passengers, 0);
    const totalCarbon = flights.reduce((sum, flight) => sum + flight.carbon, 0);
    const avgPassengers = totalPassengers / totalFlights;
    const avgCarbon = totalCarbon / totalFlights;
    const utilization = (totalPassengers / (totalFlights * 200)) * 100; // Assuming max capacity of 200

    // Animate the stats
    const timer = setTimeout(() => {
      setStats({
        totalFlights,
        avgPassengers: Math.round(avgPassengers),
        totalCarbon: Math.round(totalCarbon),
        avgCarbon: Math.round(avgCarbon),
        utilization: Math.round(utilization)
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container">
      <h2 className="page-title">Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <Plane size={24} />
            <h3>Total Flights</h3>
          </div>
          <div className="stat-value">{stats.totalFlights}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <Activity size={24} />
            <h3>Average Passengers</h3>
          </div>
          <div className="stat-value">{stats.avgPassengers}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <BarChart size={24} />
            <h3>Total CO2 Emissions</h3>
          </div>
          <div className="stat-value">{stats.totalCarbon} kg</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <Activity size={24} />
            <h3>Average CO2 per Flight</h3>
          </div>
          <div className="stat-value">{stats.avgCarbon} kg</div>
        </div>
      </div>

      <div className="chart-section">
        <h3>Capacity Utilization</h3>
        <div className="utilization-bar">
          <div 
            className="utilization-fill" 
            style={{ width: `${stats.utilization}%` }}
          >
            {stats.utilization}%
          </div>
        </div>
      </div>

      <div className="coming-soon">
        <h3>Advanced Analytics Coming Soon</h3>
        <p>Detailed CO2 tracking and optimization metrics will be available in future updates.</p>
      </div>
    </div>
  );
}

export default Statistics;