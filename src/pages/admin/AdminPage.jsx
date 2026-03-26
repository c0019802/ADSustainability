import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { logout, getToken } from '../../lib/apsAuth';
import './admin.css';

function AdminPage() {
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();

        if (!token) {
            navigate('/login');
            return;
        }

        const storedRequests = JSON.parse(localStorage.getItem('accountRequests')) || [];
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        setRequests(storedRequests);
        setUsers(storedUsers);
    }, [navigate]);

    const pendingCount = useMemo(() => {
        return requests.filter((request) => request.status === 'Pending').length;
    }, [requests]);

    const approvedCount = useMemo(() => {
        return users.length;
    }, [users]);

    const saveRequests = (updatedRequests) => {
        setRequests(updatedRequests);
        localStorage.setItem('accountRequests', JSON.stringify(updatedRequests));
    };

    const saveUsers = (updatedUsers) => {
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    const handleCreateAccount = (requestId) => {
        const selectedRequest = requests.find((request) => request.id === requestId);

        if (!selectedRequest) {
            return;
        }

        const updatedUsers = [
            ...users,
            {
                id: Date.now(),
                fullName: selectedRequest.fullName,
                email: selectedRequest.email,
                role: selectedRequest.role
            }
        ];

        const updatedRequests = requests.map((request) =>
            request.id === requestId ? { ...request, status: 'Approved' } : request
        );

        saveUsers(updatedUsers);
        saveRequests(updatedRequests);
        setMessage('Account created successfully.');
    };

    const handleRejectRequest = (requestId) => {
        const updatedRequests = requests.map((request) =>
            request.id === requestId ? { ...request, status: 'Rejected' } : request
        );

        saveRequests(updatedRequests);
        setMessage('Request rejected.');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <Header />

            <nav>
                <ul>
                    <li><a href="#requests">Requests</a></li>
                    <li><a href="#users">Users</a></li>
                    <li>
                        <button type="button" onClick={handleLogout} className="admin-action-btn">
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>

            <div className="horizontal-wrapper">
                <section className="panel" id="requests">
                    <div className="card">
                        <h2>Account Requests</h2>

                        <div className="admin-summary-cards">
                            <div className="status-card">
                                <h3>Pending Requests</h3>
                                <p>{pendingCount}</p>
                            </div>
                            <div className="status-card">
                                <h3>Created Accounts</h3>
                                <p>{approvedCount}</p>
                            </div>
                        </div>

                        {message && <div className="report-box">{message}</div>}

                        <div className="admin-table-box">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.length === 0 ? (
                                        <tr>
                                            <td colSpan="5">No account requests yet.</td>
                                        </tr>
                                    ) : (
                                        requests.map((request) => (
                                            <tr key={request.id}>
                                                <td>{request.fullName}</td>
                                                <td>{request.email}</td>
                                                <td>{request.role}</td>
                                                <td>{request.status}</td>
                                                <td>
                                                    {request.status === 'Pending' ? (
                                                        <>
                                                            <button
                                                                className="admin-action-btn"
                                                                onClick={() => handleCreateAccount(request.id)}
                                                            >
                                                                Create Account
                                                            </button>
                                                            <button
                                                                className="admin-reject-btn"
                                                                onClick={() => handleRejectRequest(request.id)}
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        request.status
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <section className="panel" id="users">
                    <div className="card">
                        <h2>Created Users</h2>

                        <div className="admin-table-box">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="3">No users created yet.</td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.fullName}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default AdminPage;