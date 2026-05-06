import React, { useEffect, useState } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
      const baseUrl = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev`
        : 'http://localhost:8000';
      
      const url = `${baseUrl}/api/activities/`;
      
      console.log('Fetching from URL:', url);
      console.log('Codespace name:', codespaceName);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw API response:', data);
      
      // Handle both paginated and plain array responses
      const activitiesList = data.results ? data.results : Array.isArray(data) ? data : [];
      console.log('Processed activities list:', activitiesList);
      
      setActivities(activitiesList);
      setError(null);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError(error.message);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="component-container">
        <div className="text-center py-5">
          <div className="loading-spinner mx-auto mb-3"></div>
          <p className="text-muted">Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="component-container">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Activities</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <small>Check the browser console and backend API at /api/activities/</small>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="component-container">
      <div className="component-header">
        <h2 className="h3 mb-0">
          <i className="bi bi-activity me-2"></i>
          Activities
        </h2>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="text-muted mb-0">
          Total activities: <strong>{activities.length}</strong>
        </p>
        <button className="btn btn-primary" onClick={fetchActivities}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="alert alert-warning text-center" role="alert">
          <i className="bi bi-info-circle-fill me-2"></i>
          No activities found
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th><i className="bi bi-hash me-1"></i>ID</th>
                <th><i className="bi bi-trophy me-1"></i>Activity Type</th>
                <th><i className="bi bi-person me-1"></i>User</th>
                <th><i className="bi bi-clock me-1"></i>Duration</th>
                <th><i className="bi bi-fire me-1"></i>Calories</th>
                <th><i className="bi bi-calendar me-1"></i>Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td className="fw-bold">#{activity.id}</td>
                  <td>
                    <span className="badge bg-success">
                      {activity.activity_type}
                    </span>
                  </td>
                  <td>{activity.user}</td>
                  <td>{activity.duration_minutes} min</td>
                  <td className="text-warning fw-semibold">
                    {activity.calories_burned} cal
                  </td>
                  <td>{new Date(activity.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Activities;
