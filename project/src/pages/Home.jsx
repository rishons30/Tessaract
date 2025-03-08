import { Plane } from 'lucide-react';

function Home() {
  return (
    <div className="hero">
      <div>
        <h1>
          <Plane className="rotating-icon" size={48} />
          <br />
          GreenTail AI
        </h1>
        <p>Next-Gen Flight Optimization</p>
      </div>
    </div>
  );
}

export default Home;