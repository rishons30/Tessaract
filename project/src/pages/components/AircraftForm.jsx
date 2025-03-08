function AircraftForm({ aircraftData, setAircraftData, handleAircraftSubmit }) {
  return (
    <form onSubmit={handleAircraftSubmit} className="data-form">
      

      <div className="form-group">
        <label htmlFor="tail_num">Aircraft Registration (Tail Number)</label>
        <input
          type="text"
          id="tail_num"
          value={aircraftData.tail_num}
          onChange={(e) => setAircraftData({ ...aircraftData, tail_num: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="subtype">Aircraft Type</label>
          <input
            type="text"
            id="subtype"
            value={aircraftData.subtype}
            onChange={(e) => setAircraftData({ ...aircraftData, subtype: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="capacity">Seating Capacity</label>
          <input
            type="number"
            id="capacity"
            value={aircraftData.capacity}
            onChange={(e) => setAircraftData({ ...aircraftData, capacity: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="base_fuel">Base Fuel Cons(lrs/hr)</label>
          <input
            type="number"
            id="base_fuel"
            value={aircraftData.base_fuel}
            onChange={(e) => setAircraftData({ ...aircraftData, base_fuel: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="efficiency">Fuel Efficiency (%)</label>
          <input
            type="number"
            id="efficiency"
            value={aircraftData.efficiency}
            onChange={(e) => setAircraftData({ ...aircraftData, efficiency: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="pre_assignments">Pre-assignments (minutes)</label>
        <input
          type="text"
          id="pre_assignments"
          value={aircraftData.pre_assignments}
          onChange={(e) => setAircraftData({ ...aircraftData, pre_assignments: e.target.value })}
          placeholder="Enter in minutes"
        />
      </div>

      <button type="submit" className="submit-button">Add Aircraft</button>
    </form>
  );
}

export default AircraftForm;
