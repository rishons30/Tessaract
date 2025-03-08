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

  // Fake baseline for trend indicators (could be from previous run if stored)
  const baseline = {
    total_co2: 60000, // Arbitrary higher value
    avg_passengers: 130 // Slightly lower
  };

  const co2Trend = stats.total_co2 < baseline.total_co2 
    ? `-${Math.round(((baseline.total_co2 - stats.total_co2) / baseline.total_co2) * 100)}%` 
    : `+${Math.round(((stats.total_co2 - baseline.total_co2) / baseline.total_co2) * 100)}%`;
  const passengerTrend = stats.avg_passengers > baseline.avg_passengers 
    ? `+${Math.round(((stats.avg_passengers - baseline.avg_passengers) / baseline.avg_passengers) * 100)}%` 
    : `-${Math.round(((baseline.avg_passengers - stats.avg_passengers) / baseline.avg_passengers) * 100)}%`;

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
          <div className="stat-value">
            {stats.avg_passengers}
            <span className={`stat-trend ${stats.avg_passengers > baseline.avg_passengers ? '' : 'negative'}`}>
              {passengerTrend}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <BarChart size={24} />
            <h3>Total CO2 Emissions</h3>
          </div>
          <div className="stat-value">
            {stats.total_co2} kg
            <span className={`stat-trend ${stats.total_co2 < baseline.total_co2 ? '' : 'negative'}`}>
              {co2Trend}
            </span>
          </div>
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