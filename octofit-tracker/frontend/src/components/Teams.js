import React, { useEffect, useState } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
      const baseUrl = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev`
        : 'http://localhost:8000';
      
      const url = `${baseUrl}/api/teams/`;
      
      console.log('Fetching from URL:', url);
      console.log('Codespace name:', codespaceName);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw API response:', data);
      
      // Handle both paginated and plain array responses
      const teamsList = data.results ? data.results : Array.isArray(data) ? data : [];
      console.log('Processed teams list:', teamsList);
      
      setTeams(teamsList);
      setError(null);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError(error.message);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="component-container">
        <div className="text-center py-5">
          <div className="loading-spinner mx-auto mb-3"></div>
          <p className="text-muted">Loading teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="component-container">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Teams</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <small>Check the browser console and backend API at /api/teams/</small>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="component-container">
      <div className="component-header">
        <h2 className="h3 mb-0">
          <i className="bi bi-people-fill me-2"></i>
          Teams
        </h2>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="text-muted mb-0">
          Total teams: <strong>{teams.length}</strong>
        </p>
        <button className="btn btn-primary" onClick={fetchTeams}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="alert alert-warning text-center" role="alert">
          <i className="bi bi-info-circle-fill me-2"></i>
          No teams found
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th><i className="bi bi-hash me-1"></i>ID</th>
                <th><i className="bi bi-flag-fill me-1"></i>Team Name</th>
                <th><i className="bi bi-card-text me-1"></i>Description</th>
                <th><i className="bi bi-people me-1"></i>Members</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id}>
                  <td className="fw-bold">#{team.id}</td>
                  <td className="fw-semibold">{team.name}</td>
                  <td>{team.description}</td>
                  <td>
                    <span className="badge bg-primary">
                      {team.members?.length || 0} members
                    </span>
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

export default Teams;
