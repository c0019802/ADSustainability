import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import "./estateTeam.css";

function getRoleRoute(role) {
  switch (role) {
    case "EstateTeamManager":
      return "/dashboard/estateteammanager";
    case "SustainabilityManager":
      return "/dashboard/sustainabilitymanager";
    case "BuildingEngineer":
    case "BuildingEngineers":
      return "/dashboard/buildingengineers";
    case "OnSitePersonnel":
    case "OnSiteEstatesPersonnel":
      return "/dashboard/onsitepersonnel";
    case "TemporaryContractor":
    case "TeamporaryContractor":
      return "/dashboard/temporarycontractor";
    case "FacilitiesSustainabilityCoordinator":
      return "/dashboard/facilitiessustainabilitycoordinator";
    case "HealthEnvironmentalComplianceOfficer":
    case "Health & Environmental Compliance Officer":
      return "/dashboard/healthenvironmentalcomplianceofficer";
    case "LecturerOrAcademicStaff":
    case "Lecturers / Academic Staff":
      return "/dashboard/lectureroracademicstaff";
    case "Student":
    case "Students":
      return "/dashboard/students";
    case "SystemAdministrator":
    case "SystemsAdministrator":
      return "/dashboard/systemsadministrator";
    case "Admin":
      return "/admin";
    default:
      return "/login";
  }
}

export default function EstateTeamPage() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role !== "EstateTeamManager") {
      navigate(getRoleRoute(currentUser.role));
      return;
    }

    if (chartRef.current) {
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Energy Usage (kWh)",
              data: [120, 135, 128, 142, 150, 138, 125],
              borderColor: "green",
              backgroundColor: "rgba(0,128,0,0.15)",
              fill: true,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    const container = scrollContainerRef.current;

    const handleWheel = (e) => {
      e.preventDefault();
      container.scrollBy({
        left: e.deltaY,
        behavior: "smooth",
      });
    };

    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [navigate]);

  const scrollToSection = (sectionId) => {
    const container = scrollContainerRef.current;
    const target = document.getElementById(sectionId);

    if (container && target) {
      container.scrollTo({
        left: target.offsetLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <header className="estate-header">
        <h1>University Estates Sustainability Dashboard</h1>
      </header>

      <nav className="estate-nav">
        <ul>
          <li>
            <button type="button" onClick={() => scrollToSection("model")}>
              3D Model
            </button>
          </li>
          <li>
            <button type="button" onClick={() => scrollToSection("energy")}>
              Energy Trends
            </button>
          </li>
          <li>
            <button type="button" onClick={() => scrollToSection("waste")}>
              Waste Analysis
            </button>
          </li>
          <li>
            <button type="button" onClick={() => scrollToSection("reports")}>
              Reports
            </button>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>

      <div className="horizontal-wrapper" ref={scrollContainerRef}>
        <section id="model" className="panel">
          <div className="card">
            <h2>3D Building Model with Temperature Data</h2>

            <div id="building3D">
              <div className="floor floor1">Ground Floor - 24°C</div>
              <div className="floor floor2">First Floor - 21°C</div>
              <div className="floor floor3">Second Floor - 19°C</div>
            </div>
          </div>
        </section>

        <section id="energy" className="panel">
          <div className="card">
            <h2>Energy Usage Trends</h2>
            <div className="chart-box">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </section>

        <section id="waste" className="panel">
          <div className="card">
            <h2>Energy Waste Identification</h2>

            <div className="report-box">
              <ul>
                <li>Ground floor HVAC running above required temperature.</li>
                <li>Lighting usage 18% higher than average after 8PM.</li>
                <li>Lab wing consuming 25% more power than baseline.</li>
              </ul>
            </div>

            <div className="waste-summary-cards">
              <div className="status-card status-red">
                <h3>High Risk Areas</h3>
                <p>2</p>
              </div>

              <div className="status-card status-amber">
                <h3>Medium Risk Areas</h3>
                <p>1</p>
              </div>

              <div className="status-card status-green">
                <h3>Low Risk Areas</h3>
                <p>3</p>
              </div>

              <div className="status-card status-score">
                <h3>Waste Severity Score</h3>
                <p>58%</p>
              </div>
            </div>

            <div className="ai-box">
              <h3>Recommendation</h3>
              <p>
                Reduce HVAC output on overheated floors, introduce motion-sensor
                lighting in lab areas, and review after-hours energy usage
                patterns.
              </p>
            </div>
          </div>
        </section>

        <section id="reports" className="panel">
          <div className="card">
            <h2>Building Performance Report</h2>

            <div className="report-box">
              <p>
                <strong>Sustainability Score:</strong> 78%
              </p>
              <p>
                <strong>Carbon Emissions:</strong> 12% lower than last quarter
              </p>
              <p>
                <strong>Recommendation:</strong> Upgrade HVAC control system to
                smart adaptive mode.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}