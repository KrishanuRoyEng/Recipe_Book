import { useEffect, useState, useCallback } from 'react';
import { getUsers, updateUserRole, } from '../../api/adminService';
import './Styles/userRoleManager.css';

export default function UserRoleManagerPopup({ onClose }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
        const data = await getUsers(search, page);
        setUsers(data.results);
        setPages(data.pages);
    } finally {
        setLoading(false);
    }
    }, [search, page]);

    useEffect(() => {
    fetchUsers();
    }, [fetchUsers]);

  const handleRoleChange = async (id, newRole) => {
    const updated = await updateUserRole(id, newRole);
    setUsers(prev => prev.map(u => u._id === id ? updated : u));
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content large">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Manage Users</h2>
        <input 
          type="text" 
          placeholder="Search users..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />

        {loading ? <p>Loading...</p> : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Role</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className={user.role === 'admin' ? 'admin-row' : ''}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button 
                      className={`role-btn ${user.role === 'admin' ? 'demote' : 'promote'}`}
                      onClick={() => handleRoleChange(user._id, user.role === 'admin' ? 'user' : 'admin')}
                    >
                      {user.role === 'admin' ? 'Demote' : 'Promote'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="pagination">
          {[...Array(pages).keys()].map(p => (
            <button key={p} onClick={() => setPage(p+1)} className={page === p+1 ? 'active' : ''}>{p+1}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
