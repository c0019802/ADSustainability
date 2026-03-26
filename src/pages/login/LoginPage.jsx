import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { startApsLogin } from '../../lib/apsAuth';

export default function SignIn() {
  const navigate = useNavigate();

  useEffect(() => {
    const rawUser = localStorage.getItem('currentUser');
    const currentUser = rawUser ? JSON.parse(rawUser) : null;

    if (currentUser?.dashboardRoute) {
      navigate(currentUser.dashboardRoute);
    }
  }, [navigate]);

  return (
    <div style={{ padding: '40px' }}>
      <h1>Sign In</h1>
      <p>Autodesk Account</p>

      <button type="button" onClick={startApsLogin}>
        Sign in with Autodesk
      </button>

      <div style={{ marginTop: '20px' }}>
        <Link to="/">Go back</Link>
      </div>
    </div>
  );
}