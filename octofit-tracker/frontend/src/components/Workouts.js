import React, { useEffect, useState } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
      const baseUrl = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev`
        : 'http://localhost:8000';
      
      const url = `${baseUrl}/api/workouts/`;
      
      console.log('Fetching from URL:', url);
      console.log('Codespace name:', codespaceName);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw API response:', data);
      
      // Handle both paginated and plain array responses
      const workoutsList = data.results ? data.results : Array.isArray(data) ? data : [];
      console.log('Processed workouts list:', workoutsList);
      
      setWorkouts(workoutsList);
      setError(null);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError(error.message);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="component-container">
        <div className="text-center py-5">
          <div className="loading-spinner mx-auto mb-3"></div>
          <p className="text-muted">Loading workouts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="component-container">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Workouts</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <small>Check the browser console and backend API at /api/workouts/</small>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="component-container">
      <div className="component-header">
        <h2 className="h3 mb-0">
          <i className="bi bi-bicycle me-2"></i>
          Workouts
        </h2>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="text-muted mb-0">
          Total workouts: <strong>{workouts.length}</strong>
        </p>
        <button className="btn btn-primary" onClick={fetchWorkouts}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {workouts.length === 0 ? (
        <div className="alert alert-warning text-center" role="alert">
          <i className="bi bi-info-circle-fill me-2"></i>
          No workouts found
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th><i className="bi bi-hash me-1"></i>ID</th>
                <th><i className="bi bi-lightning me-1"></i>Workout Name</th>
                <th><i className="bi bi-tag me-1"></i>Type</th>
                <th><i className="bi bi-clock me-1"></i>Duration</th>
                <th><i className="bi bi-speedometer me-1"></i>Difficulty</th>
                <th><i className="bi bi-card-text me-1"></i>Description</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout) => (
                <tr key={workout.id}>
                  <td className="fw-bold">#{workout.id}</td>
                  <td className="fw-semibold">{workout.name}</td>
                  <td>
                    <span className="badge bg-info">
                      {workout.workout_type}
                    </span>
                  </td>
                  <td>{workout.duration_minutes} min</td>
                  <td>
                    <span className={`badge ${
                      workout.difficulty_level === 'Beginner' ? 'bg-success' :
                      workout.difficulty_level === 'Intermediate' ? 'bg-warning' :
                      workout.difficulty_level === 'Advanced' ? 'bg-danger' : 'bg-secondary'
                    }`}>
                      {workout.difficulty_level}
                    </span>
                  </td>
                  <td className="text-truncate" style={{maxWidth: '200px'}} title={workout.description}>
                    {workout.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Workouts;
