import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Sheffield Hallam Sustainability Manager</h1>
      <p>Welcome to the sustainability management system.</p>

      <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
        <Link to="/login">
          <button type="button">Login</button>
        </Link>

        <Link to="/request-account">
          <button type="button">Request Account</button>
        </Link>
      </div>
    </div>
  );
}