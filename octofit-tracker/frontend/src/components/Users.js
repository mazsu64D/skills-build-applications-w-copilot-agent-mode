import React, { useEffect, useState } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
      const baseUrl = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev`
        : 'http://localhost:8000';
      
      const url = `${baseUrl}/api/users/`;
      
      console.log('Fetching from URL:', url);
      console.log('Codespace name:', codespaceName);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw API response:', data);
      
      // Handle both paginated and plain array responses
      const usersList = data.results ? data.results : Array.isArray(data) ? data : [];
      console.log('Processed users list:', usersList);
      
      setUsers(usersList);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="component-container">
        <div className="text-center py-5">
          <div className="loading-spinner mx-auto mb-3"></div>
          <p className="text-muted">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="component-container">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Users</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <small>Check the browser console and backend API at /api/users/</small>
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
          Users
        </h2>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="text-muted mb-0">
          Total users: <strong>{users.length}</strong>
        </p>
        <button className="btn btn-primary" onClick={fetchUsers}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {users.length === 0 ? (
        <div className="alert alert-warning text-center" role="alert">
          <i className="bi bi-info-circle-fill me-2"></i>
          No users found
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th><i className="bi bi-hash me-1"></i>ID</th>
                <th><i className="bi bi-person-circle me-1"></i>Username</th>
                <th><i className="bi bi-person me-1"></i>Name</th>
                <th><i className="bi bi-envelope me-1"></i>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="fw-bold">#{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>
                    <a href={`mailto:${user.email}`} className="text-decoration-none">
                      {user.email}
                    </a>
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

export default Users;
