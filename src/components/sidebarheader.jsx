

import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaPlusCircle,
  FaBook,
  FaBlog,
  FaEnvelope,
  FaUserGraduate,
  FaMoneyCheckAlt,
  FaClipboardList,
  FaBars,
  FaSignOutAlt 
} from "react-icons/fa";

function SidebarHeader() {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState(null); // dynamic user state

  // Fetch user profile from backend
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("https://dgrnode.vercel.app/admin-profile", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  useEffect(() => {
    fetchUser();

    const handleStorage = (e) => {
      if (e.key === "token") fetchUser();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Define all menus (same as original)
  const menus = [
    { id: 1, menuname: "Dashboard", path: "home", icon: <FaHome /> },
    { id: 2, menuname: "Enquiry", path: "addenquiry", icon: <FaPlusCircle />, requiredPermission: "enquiry" },
    { id: 5, menuname: "Online Enquiry", path: "webenq", icon: <FaEnvelope />, requiredPermission: "enquiry" },

    { id: 3, menuname: "Courses", path: "courses", icon: <FaBook />, requiredPermission: "manageCourses" },
    { id: 4, menuname: "Blog", path: "blog", icon: <FaBlog />, requiredPermission: "manageCourses" },
    { id: 4, menuname: "Free Notes", path: "notes", icon: <FaBook />, requiredPermission: "notes" },
    { id: 6, menuname: "Manage Students", path: "studentportal", icon: <FaUserGraduate />, requiredPermission: "manageStudents" },
    { id: 6, menuname: "Placed Students", path: "placedstudents", icon: <FaUserGraduate />, requiredPermission: "manageStudents" },
    { id: 6, menuname: "Manage Certificate", path: "issuecertificate", icon: <FaUserGraduate />, requiredPermission: "manageStudents" },
    { id: 7, menuname: "Manage Fees", path: "studentfeesportal", icon: <FaMoneyCheckAlt />, requiredPermission: "manageFees" },
    { id: 8, menuname: "Manage Test", path: "test", icon: <FaClipboardList />, requiredPermission: "test" },
    { id: 9, menuname: "Manage Staff", path: "staff", icon: <FaUserGraduate />, requiredPermission: "staff" },
    { id: 10, menuname: "Manage Admin Users", path: "create-new-admin", icon: <FaUserGraduate />, requiredPermission: "manageUsers" },
    { id: 11, menuname: "Profile", path: "profile", icon: <FaUserGraduate /> },
  ];

  // Filter menus dynamically
  const visibleMenus = user
    ? user.role === "admin"
      ? menus
      : menus.filter(menu => !menu.requiredPermission || user.permissions?.[menu.requiredPermission])
    : [];

  const Logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div
      className={`sidebar ${isOpen ? "open" : "closed"}`}
      style={{
        ...styles.sidebar,
        width: isOpen ? 255 : 78,
        overflowY: "scroll"
      }}
    >
      <button
        className="toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...styles.toggleButton,
          alignSelf: isOpen ? "flex-end" : "center",
          width: isOpen ? "42px" : 42,
          height: 42,
          borderRadius: "50%",
        }}
      >
        <FaBars />
      </button>

      {isOpen ? (
        <div style={{ textAlign: "center", padding: "10px 20px 20px 20px" }}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAL-0nRxdm_5TXMrt2s_oaOHhM0wZ0oK7Ikw&s"
            alt="Logo"
            style={styles.logoImg}
          />
          <h3 style={styles.brandTitle}>JDB Infotech</h3>
          <p style={styles.brandSub}>Admin Panel</p>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAL-0nRxdm_5TXMrt2s_oaOHhM0wZ0oK7Ikw&s"
            alt="Logo"
            style={{ ...styles.logoImg, width: 45, height: 45 }}
          />
        </div>
      )}

      <ul className="nav-list" style={styles.navList}>
        {visibleMenus.map(menuitem => (
          <li key={menuitem.id} className="nav-item" style={styles.navItem}>
            <NavLink
              to={`/${menuitem.path}`}
              style={({ isActive }) => ({
                ...styles.navLink,
                justifyContent: isOpen ? "flex-start" : "center",
                background: isActive
                  ? "linear-gradient(135deg,#0b7285,#1098ad)"
                  : "rgba(255,255,255,0.08)",
                color: isActive ? "white" : "#e5e7eb",
                transform: isActive ? "translateX(4px)" : "translateX(0px)",
              })}
            >
              <span style={styles.icon}>{menuitem.icon}</span>
              {isOpen && <span>{menuitem.menuname}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      <div
        className="logout-container"
        style={{
          marginTop: "auto",
          padding: 12,
          textAlign: isOpen ? "center" : "center",
        }}
      >
        <button
          onClick={Logout}
          className="logout-button"
          style={{
            ...styles.logoutButton,
            width: isOpen ? "100%" : 52,
            padding: isOpen ? "12px" : 12,
            justifyContent: "center",
          }}
        >
          <FaSignOutAlt />
          {isOpen && <span style={{ marginLeft: 8 }}>Logout</span>}
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#0f172a,#111827,#1e293b)",
    display: "flex",
    flexDirection: "column",
    padding: "12px 10px",
    transition: "width 0.35s ease",
    boxShadow: "8px 0 28px rgba(0,0,0,0.28)",
    overflow: "hidden",
    borderRight: "1px solid rgba(255,255,255,0.08)",
  },
  toggleButton: {
    background: "linear-gradient(135deg,#06b6d4,#0ea5e9)",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: 18,
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s",
    boxShadow: "0 10px 22px rgba(14,165,233,0.35)",
  },
  logoImg: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    objectFit: "cover",
    transition: "all 0.3s",
    border: "4px solid rgba(255,255,255,0.15)",
    boxShadow: "0 12px 25px rgba(0,0,0,0.35)",
  },
  brandTitle: {
    color: "white",
    marginTop: 14,
    marginBottom: 4,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  brandSub: {
    color: "#94a3b8",
    fontSize: 13,
    margin: 0,
  },
  navList: {
    listStyle: "none",
    padding: 0,
    flex: 1,
    marginTop: 10,
  },
  navItem: {
    marginBottom: 10,
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    padding: "13px 14px",
    borderRadius: 14,
    transition: "all 0.3s ease",
    fontWeight: "600",
    fontSize: "14px",
    backdropFilter: "blur(10px)",
  },
  icon: {
    marginRight: 12,
    fontSize: 18,
    minWidth: 20,
  },
  logoutButton: {
    background: "linear-gradient(135deg,#ef4444,#dc2626)",
    color: "white",
    border: "none",
    borderRadius: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    transition: "all 0.3s",
    boxShadow: "0 12px 22px rgba(239,68,68,0.28)",
  },
};

export { SidebarHeader };