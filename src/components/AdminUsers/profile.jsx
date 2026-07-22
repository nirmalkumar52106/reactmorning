import React, { useEffect, useState } from "react";
import { SidebarHeader } from "../sidebarheader";

function Profile() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  // Fetch user profile
  useEffect(() => {
    async function fetchProfile(){
      try {
        const res = await fetch("https://dgrnode.vercel.app/admin-profile", { headers });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    }
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (!user) return <div style={{ padding: 20 }}>Loading profile...</div>;

  return ( 

    <>
    
    

  
  <SidebarHeader />

    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
     

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 20px",
          backgroundColor: "#f1f5f9",
        }}
      >
        <h1 style={{ marginBottom: "30px", color: "#0b7285" }}>My Profile</h1>

        {/* Profile Card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: "30px 25px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: 700,
            marginBottom: 30,
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: 10, fontSize: "1.8rem", color: "#333" }}>{user.username}</h2>
          <p style={{ fontSize: 16 }}><strong>Email:</strong> {user.email}</p>
          <p style={{ fontSize: 16 }}><strong>Mobile:</strong> {user.mobile || "-"}</p>
          <p style={{ fontSize: 16 }}><strong>Role:</strong> {user.role}</p>
          <button
            onClick={handleLogout}
            style={{
              marginTop: 20,
              padding: "12px 25px",
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 16,
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#d32f2f")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#f44336")}
          >
            Logout
          </button>
        </div>

        {/* Permissions Card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: "25px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: 700,
          }}
        >
          <h3 style={{ marginBottom: 20, color: "#0b7285" }}>Permissions</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 15,
            }}
          >
            {user.permissions &&
              Object.keys(user.permissions).map((perm) => (
                <div
                  key={perm}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: user.permissions[perm] || user.role==="admin" ? "#4CAF50" : "#e0e0e0",
                    color: user.permissions[perm]  || user.role==="admin" ? "#fff" : "#555",
                    borderRadius: 8,
                    fontWeight: 500,
                    textAlign: "center",
                    transition: "0.3s",
                    cursor: "default",
                  }}
                >
                  {perm}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

export default Profile;