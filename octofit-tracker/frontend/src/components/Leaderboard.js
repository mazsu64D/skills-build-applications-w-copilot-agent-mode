import React, { useEffect, useState } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
      const baseUrl = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev`
        : 'http://localhost:8000';
      
      const url = `${baseUrl}/api/leaderboard/`;
      
      console.log('Fetching from URL:', url);
      console.log('Codespace name:', codespaceName);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw API response:', data);
      
      // Handle both paginated and plain array responses
      const leaderboardList = data.results ? data.results : Array.isArray(data) ? data : [];
      console.log('Processed leaderboard list:', leaderboardList);
      
      setLeaderboard(leaderboardList);
      setError(null);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error.message);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="component-container">
        <div className="text-center py-5">
          <div className="loading-spinner mx-auto mb-3"></div>
          <p className="text-muted">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="component-container">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Leaderboard</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <small>Check the browser console and backend API at /api/leaderboard/</small>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="component-container">
      <div className="component-header">
        <h2 className="h3 mb-0">
          <i className="bi bi-trophy-fill me-2"></i>
          Leaderboard
        </h2>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="text-muted mb-0">
          Total entries: <strong>{leaderboard.length}</strong>
        </p>
        <button className="btn btn-primary" onClick={fetchLeaderboard}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {leaderboard.length === 0 ? (
        <div className="alert alert-warning text-center" role="alert">
          <i className="bi bi-info-circle-fill me-2"></i>
          No leaderboard entries found
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th><i className="bi bi-trophy me-1"></i>Rank</th>
                <th><i className="bi bi-hash me-1"></i>ID</th>
                <th><i className="bi bi-people me-1"></i>Team/User</th>
                <th><i className="bi bi-graph-up me-1"></i>Score</th>
                <th><i className="bi bi-award me-1"></i>Position</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry.id}>
                  <td>
                    <div className={`badge ${
                      index === 0 ? 'bg-warning text-dark' :
                      index === 1 ? 'bg-secondary' :
                      index === 2 ? 'bg-warning' : 'bg-light text-dark'
                    } fs-6 px-3 py-2`}>
                      {index === 0 && <i className="bi bi-trophy-fill me-1"></i>}
                      {index === 1 && <i className="bi bi-medal-fill me-1"></i>}
                      {index === 2 && <i className="bi bi-award-fill me-1"></i>}
                      #{index + 1}
                    </div>
                  </td>
                  <td className="fw-bold">#{entry.id}</td>
                  <td className="fw-semibold">{entry.team || entry.user || 'N/A'}</td>
                  <td className="text-success fw-bold fs-5">{entry.score}</td>
                  <td>
                    <span className="badge bg-info">
                      {entry.position}
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

export default Leaderboard;
