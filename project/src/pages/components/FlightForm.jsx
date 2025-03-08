function FlightForm({ flightData, setFlightData, handleFlightSubmit }) {
  return (
    <form onSubmit={handleFlightSubmit} className="data-form">
      
      <div className="form-group">
        <label htmlFor="flight_id">Flight ID</label>
        <input
          type="text"
          id="flight_id"
          value={flightData.flight_id}
          onChange={(e) => setFlightData({ ...flightData, flight_id: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dep_time">Departure Time</label>
          <input
            type="datetime-local"
            id="dep_time"
            value={flightData.dep_time}
            onChange={(e) => setFlightData({ ...flightData, dep_time: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="arr_time">Arrival Time</label>
          <input
            type="datetime-local"
            id="arr_time"
            value={flightData.arr_time}
            onChange={(e) => setFlightData({ ...flightData, arr_time: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="origin">Origin</label>
          <input
            type="text"
            id="origin"
            value={flightData.origin}
            onChange={(e) => setFlightData({ ...flightData, origin: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dest">Destination</label>
          <input
            type="text"
            id="dest"
            value={flightData.dest}
            onChange={(e) => setFlightData({ ...flightData, dest: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="subtype">Aircraft Subtype</label>
          <input
            type="text"
            id="subtype"
            value={flightData.subtype}
            onChange={(e) => setFlightData({ ...flightData, subtype: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="min_seating_capacity">Min Seating Capacity</label>
          <input
            type="number"
            id="min_seating_capacity"
            value={flightData.min_seating_capacity}
            onChange={(e) => setFlightData({ ...flightData, min_seating_capacity: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="ground_time">Ground Time (minutes)</label>
        <input
          type="number"
          id="ground_time"
          value={flightData.ground_time}
          onChange={(e) => setFlightData({ ...flightData, ground_time: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="onward_flight">Onward Flight ID</label>
        <input
          type="text"
          id="onward_flight"
          value={flightData.onward_flight}
          onChange={(e) => setFlightData({ ...flightData, onward_flight: e.target.value })}
        />
      </div>

      <button type="submit" className="submit-button">Add Flight</button>
    </form>
  );
}

export default FlightForm;
