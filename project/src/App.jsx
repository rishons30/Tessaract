import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Plane } from 'lucide-react';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Disruptions from './pages/Disruptions';
import DataEntry from './pages/DataEntry';
import Statistics from './pages/Statistics';

function App() {
  return (
    <Router>
      <nav className="nav">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            <Plane size={24} /> GreenTail AI
          </Link>
          <div className="nav-links">
            <Link to="/schedule" className="nav-link">Schedule</Link>
            <Link to="/disruptions" className="nav-link">Disruptions</Link>
            <Link to="/data-entry" className="nav-link">Data Entry</Link>
            <Link to="/statistics" className="nav-link">Statistics</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/disruptions" element={<Disruptions />} />
        <Route path="/data-entry" element={<DataEntry />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </Router>
  );
}

export default App;