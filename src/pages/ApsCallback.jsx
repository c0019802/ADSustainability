import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { finishApsLogin, getApsUserProfile } from "../lib/apsAuth";

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
    default:
      return "/login";
  }
}

export default function ApsCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Signing in with Autodesk...");

  useEffect(() => {
    async function run() {
      try {
        await finishApsLogin();

        const profile = await getApsUserProfile();
        const userEmail = profile?.email?.toLowerCase()?.trim();

        if (!userEmail) {
          setMessage("Could not read Autodesk account email.");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

        const approvedUser = storedUsers.find(
          (user) => user.email?.toLowerCase()?.trim() === userEmail
        );

        if (!approvedUser) {
          setMessage("No approved account found for this Autodesk user.");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        localStorage.setItem("currentUser", JSON.stringify({
          ...approvedUser,
          dashboardRoute: getRoleRoute(approvedUser.role),
          apsEmail: userEmail,
        }));

        navigate("/login");
      } catch (error) {
        console.error(error);
        setMessage("Login failed. Returning to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    }

    run();
  }, [navigate]);

  return <h2>{message}</h2>;
}