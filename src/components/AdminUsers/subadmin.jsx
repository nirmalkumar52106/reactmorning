import React, { useEffect, useState } from "react";
import { SidebarHeader } from "../sidebarheader";
import Switch from "react-switch";

function SubadminManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    mobile: "",
    permissions: {
      manageStudents: false,
      manageFees: false,
      manageCourses: false,
      enquiry: false,
      staff: false,
      test: false,
    },
  });

  const tokennn = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Authorization": `Bearer ${tokennn}`
  };

  // Fetch all subadmins
  const fetchUsers = async () => {
    try {
      const res = await fetch("https://dgrnode.vercel.app/admin-subadmins", { headers });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Block / Unblock user
  const toggleBlock = async (id) => {
    try {
      const res = await fetch(`https://dgrnode.vercel.app/admin-toggle-block/${id}`, {
        method: "PATCH",
        headers,
      });
      // const data2 = await res.json()
      const data = await res.json();
      alert(data.msg);
      fetchUsers();
    } catch (err) { console.error(err); }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (window.confirm("Delete permanently?")) {
      try {
        const res = await fetch(`https://dgrnode.vercel.app/admin-delete-subadmin/${id}`, {
          method: "DELETE",
          headers,
        });
        const data = await res.json();
        alert(data.msg);
        fetchUsers();
      } catch (err) { console.error(err); }
    }
  };

  // Update user permissions
  const updateUserPermissions = async () => {
    try {
      const res = await fetch(`https://dgrnode.vercel.app/admin-update-subadmin/${editingUser._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ permissions: editingUser.permissions })
      });
      const data = await res.json();
      alert(data.msg);
      setEditingUser(null);
      fetchUsers();
    } catch (err) { console.error(err); }
  };

  // Toggle permission for editing
  const togglePermission = (key) => {
    setEditingUser({
      ...editingUser,
      permissions: {
        ...editingUser.permissions,
        [key]: !editingUser.permissions[key]
      }
    });
  };

  // Handle new user form input
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Toggle new user permission
  const toggleNewUserPermission = (key) => {
    setNewUser({
      ...newUser,
      permissions: { ...newUser.permissions, [key]: !newUser.permissions[key] }
    });
  };

  // Submit new user form
  const createNewUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://dgrnode.vercel.app/admin-create-subadmin", {
        method: "POST",
        headers,
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      alert(data.msg || JSON.stringify(data));
      setShowCreateForm(false);
      setNewUser({
        username: "", email: "", password: "", mobile: "",
        permissions: {
          manageStudents: false,
          manageFees: false,
          manageCourses: false,
          enquiry: false,
          staff: false,
          test: false,
        }
      });
      fetchUsers();
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <SidebarHeader/>
      <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", maxWidth: "900px", margin: "auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Subadmin Management</h2>

        {/* Add New Admin Button */}
        <div style={{ marginBottom: "20px", textAlign: "right" }}>
          <button style={{ ...buttonStyle, backgroundColor: "#4CAF50" }} onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? "Close Form" : "➕ Add New Admin"}
          </button>
        </div>

        {/* Create New User Form */}
        {showCreateForm && (
          <form onSubmit={createNewUser} style={formStyle}>
            <h3>Create New Subadmin</h3>
            <input type="text" name="username" placeholder="Username" value={newUser.username} onChange={handleNewUserChange} required style={inputStyle}/>
            <input type="email" name="email" placeholder="Email" value={newUser.email} onChange={handleNewUserChange} required style={inputStyle}/>
            <input type="password" name="password" placeholder="Password" value={newUser.password} onChange={handleNewUserChange} required style={inputStyle}/>
            <input type="text" name="mobile" placeholder="Mobile" value={newUser.mobile} onChange={handleNewUserChange} style={inputStyle}/>
            <h4>Permissions</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {Object.keys(newUser.permissions).map((key) => (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <input type="checkbox" checked={newUser.permissions[key]} onChange={() => toggleNewUserPermission(key)} />
                  {key}
                </label>
              ))}
            </div>
            <button type="submit" style={{ ...buttonStyle, marginTop: "10px" }}>Create</button>
          </form>
        )}

        {/* Users Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
          <thead>
            <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Mobile</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{u.username}</td>
                <td style={tdStyle}>{u.email}</td>
                <td style={tdStyle}>{u.mobile || "-"}</td>
                <td style={tdStyle}>{u.isBlocked ? "Blocked ❌" : "Active ✅"}</td>
                <td style={tdStyle}>
                  <button style={buttonStyle} onClick={() => setEditingUser(u)}>⚙️ Settings</button>
                  <button style={{ ...buttonStyle, backgroundColor: "#f44336" }} onClick={() => deleteUser(u._id)}>🗑️ Delete</button>
                  <button style={{ ...buttonStyle, backgroundColor: u.isBlocked ? "#4CAF50" : "#FF9800" }}
                    onClick={() => toggleBlock(u._id)}>
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Modal */}
        {editingUser && (
          <div style={modalOverlay}>
            <div style={modalContent}>
              <h3>Edit Permissions: {editingUser.username}</h3>
            {Object.keys(editingUser.permissions).map((key) => (
  <div key={key} style={{ marginBottom: "10px" }}>
    <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Switch
        checked={editingUser.permissions[key]}
        onChange={() => togglePermission(key)}
        onColor="#86d3ff"
        onHandleColor="#2693e6"
        handleDiameter={20}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        height={24}
        width={48}
      />
      {key}
    </label>
  </div>
))}

              <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button style={buttonStyle} onClick={updateUserPermissions}>Save</button>
                <button style={{ ...buttonStyle, backgroundColor: "#f44336" }} onClick={() => setEditingUser(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Styles
const thStyle = { padding: "10px", textAlign: "left" };
const tdStyle = { padding: "10px" };
const buttonStyle = {
  padding: "6px 12px",
  marginRight: "5px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  backgroundColor: "#2196F3",
  color: "white"
};
const modalOverlay = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};
const modalContent = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  maxHeight: "80vh",
  overflowY: "auto",
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
};
const formStyle = {
  marginBottom: "30px",
  padding: "15px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9"
};
const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc"
};

export default SubadminManagement;