import { useEffect, useState } from 'react';
import { BarChart, Activity, Plane } from 'lucide-react';

function Statistics() {
  const [stats, setStats] = useState({
    total_flights: 0,
    avg_passengers: 0,
    total_co2: 0,
    chaos_recovered: 0
  });

  useEffect(() => {
    fetch('http://localhost:5000/statistics')
      .then(response => response.json())
      .then(data => {
        const timer = setTimeout(() => {
          setStats({
            total_flights: data.total_flights,
            avg_passengers: Math.round(data.avg_passengers),
            total_co2: Math.round(data.total_co2),
            chaos_recovered: data.chaos_recovered
          });
        }, 500);
        return () => clearTimeout(timer);
      })
      .catch(error => console.error('Error fetching stats:', error));
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
          <div className="stat-value">{stats.total_flights}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <Activity size={24} />
            <h3>Average Passengers</h3>
          </div>
          <div className="stat-value">{stats.avg_passengers}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <BarChart size={24} />
            <h3>Total CO2 Emissions</h3>
          </div>
          <div className="stat-value">{stats.total_co2} kg</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <Activity size={24} />
            <h3>Chaos Recovered</h3>
          </div>
          <div className="stat-value">{stats.chaos_recovered}</div>
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