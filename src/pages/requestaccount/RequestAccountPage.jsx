import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import './requestaccount.css';

function RequestAccountPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        const newRequest = {
            id: Date.now(),
            fullName,
            email,
            role,
            status: 'Pending'
        };

        const currentRequests = JSON.parse(localStorage.getItem('accountRequests')) || [];
        currentRequests.push(newRequest);
        localStorage.setItem('accountRequests', JSON.stringify(currentRequests));

        setMessage('Account request sent successfully.');
        setFullName('');
        setEmail('');
        setRole('');
    };

    return (
        <>
            <Header />

            <div className="RequestAccount-Container">
                <h2>Request Account</h2>

                <form className="RequestAccount-Form" onSubmit={handleSubmit}>
                    <p className="User">Full Name</p>
                    <input
                        type="text"
                        className="InputBox"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        required
                    />

                    <p className="User">Email</p>
                    <input
                        type="email"
                        className="InputBox"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <p className="User">Role</p>
                    <select
                        className="InputBox"
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="Estates Team Manager">Estates Team Manager</option>
                        <option value="Sustainability Manager">Sustainability Manager</option>
                        <option value="Building Engineer">Building Engineer</option>
                        <option value="On-Site Personnel">On-Site Personnel</option>
                        <option value="Temporary Contractor">Temporary Contractor</option>
                    </select>

                    <button type="submit" className="SendRequest">Send Request</button>
                </form>

                {message && <p id="message">{message}</p>}

                <Link to="/login" className="BackLink">Go back</Link>
            </div>
        </>
    );
}

export default RequestAccountPage;
