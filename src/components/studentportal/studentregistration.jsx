import React, { useState, useEffect } from "react";
import { SidebarHeader } from "../sidebarheader";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import BatchPage from "../studentBatch/BatchPage";


const StudentPanel = () => {
  const [activeTab, setActiveTab] = useState("all");
 const [formData, setFormData] = useState({
  studentId: "",
  password: "", 
  name: "",
  email: "",
  mobile: "",
  parentMobile: "",
  address: "",
  courseName: ""
});



 const tokennn = localStorage.getItem("token");
   const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${tokennn}`
    };

  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  // Search & selection state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMap, setSelectedMap] = useState({}); // { studentId: true }
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit new student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
        const response = await fetch("https://dgrnode.vercel.app/studentregister", {
            method: "POST",
            headers,
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            // Attempt to read the error message from the response body
            const errorData = await response.json(); 
            throw new Error(errorData.message || `Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            alert("Student added successfully ✅");
            
            // Clear form fields
           setFormData({
  studentId: "",
  password: "",
  name: "",
  email: "",
  mobile: "",
  parentMobile: "",
  address: "",
  courseName: ""
});
            // If fetchAllStudents is available and needed:
            // if (["all", "manage"].includes(activeTab)) fetchAllStudents();
            
        } else {
            alert("Failed: " + data.message);
        }

    } catch (error) {
        console.error("Error in handleAddStudent:", error.message);
        alert(`Error adding student: ${error.message}`);
    } finally {
        setIsLoading(false); // Stop loading, regardless of success or failure
    }
};

  // Fetch all students
  const fetchAllStudents = async () => {
    try {
      const res = await fetch("https://dgrnode.vercel.app/allstudents" , {
        headers,
      });
      const data = await res.json();
      if (data.success) {
        setStudents(data.students || []);
        // reset selection
        setSelectedMap({});
        setSelectAllChecked(false);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    if (["all", "manage"].includes(activeTab)) {
      fetchAllStudents();
    }
   
  }, [activeTab]);

 
  const handleAttendanceChange = (index, status) => {
    const updated = [...students];
    updated[index].attendanceStatus = status;
    setStudents(updated);
  };

  // Submit marked attendance
  const handleMarkAttendance = async () => {
    const attendanceList = students.map((s) => ({
      studentId: s.studentId,
      date: new Date().toISOString().split("T")[0],
      status: s.attendanceStatus || "Absent",
    }));

    try {
      const res = await fetch("https://dgrnode.vercel.app/markattendance", {
        method: "POST",
        headers,
        body: JSON.stringify({ attendance: attendanceList }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Attendance marked successfully");
      } else alert("Error: " + data.message);
    } catch (err) {
      console.error(err);
      alert("Error marking attendance");
    }
  };

  // Fetch attendance for specific student
  const handleViewAttendance = async (studentId) => {
    setSelectedStudentId(studentId);
    try {
      const res = await fetch(`https://dgrnode.vercel.app/getattendance/${studentId}` ,{
        headers,
      });
      const data = await res.json();
      if (data.success) {
        setAttendanceData(data.attendance || []);
        // switch to All tab still displays the attendance block as before
      } else {
        alert("Failed to fetch attendance");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching attendance");
    }
  };

  // CSV Headers
  const csvHeaders = [
    { label: "Student ID", key: "studentId" },
    { label: "Date", key: "date" },
    { label: "Status", key: "status" },
  ];

  // absent present record
  const [summaryDate, setSummaryDate] = useState("");
  const [summaryData, setSummaryData] = useState(null);

  const fetchSummary = async () => {
    if (!summaryDate) return alert("Select a date");
    try {
      const res = await fetch(`https://dgrnode.vercel.app/attendance-summary/${summaryDate}` ,{
        headers,      });
      const data = await res.json();
      if (data.success) setSummaryData(data);
      else alert("No data found");
    } catch (err) {
      console.error(err);
      alert("Error fetching summary");
    }
  };

  const goto = useNavigate();

  useEffect(() => {
    const tokeennnn = localStorage.getItem("token");
    if (!tokeennnn) {
      window.location.replace("/"); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goto]);

  // Single delete (keeps existing message)
  const handleDeleteStudent = async (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student and all related records?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://dgrnode.vercel.app/deletestudent/${studentId}`, {
        method: "DELETE",
        headers,
      });

      const data = await res.json();
      alert(data.message || "ok");

      // Refresh list after delete
      setStudents((prev) => prev.filter((s) => s.studentId !== studentId));
      setSelectedMap((prev) => {
        const copy = { ...prev };
        delete copy[studentId];
        return copy;
      });
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  // Checkbox handlers
  const handleCheckboxChange = (studentId) => {
    setSelectedMap((prev) => {
      const copy = { ...prev };
      if (copy[studentId]) delete copy[studentId];
      else copy[studentId] = true;
      // update selectAllChecked
      const total = filteredStudents.length;
      const selectedCount = Object.keys(copy).length;
      setSelectAllChecked(selectedCount === total && total > 0);
      return copy;
    });
  };

  const handleSelectAll = () => {
    if (selectAllChecked) {
      // uncheck all
      setSelectedMap({});
      setSelectAllChecked(false);
    } else {
      const newMap = {};
      filteredStudents.forEach((s) => {
        newMap[s.studentId] = true;
      });
      setSelectedMap(newMap);
      setSelectAllChecked(true);
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    const ids = Object.keys(selectedMap);
    if (ids.length === 0) return alert("No students selected");
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${ids.length} selected students and all related records?`
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      // delete sequentially or in parallel - doing sequentially to observe server load
      for (const id of ids) {
        // await each to avoid overwhelming backend
        await fetch(`https://dgrnode.vercel.app/deletestudent/${id}`, { method: "DELETE" , headers });
      }

      alert(`${ids.length} students deleted`);
      // refresh list
      fetchAllStudents();
    } catch (err) {
      console.error(err);
      alert("Bulk delete failed");
    } finally {
      setLoading(false);
    }
  };

  // Search filter (studentId, name, mobile)
  const filteredStudents = students.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (s.studentId && s.studentId.toLowerCase().includes(q)) ||
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.mobile && s.mobile.toString().toLowerCase().includes(q))
    );
  });

  // Edit student modal handlers
  const openEditModal = (student) => {
    setEditData({
      ...student,
      // do not expose password for edit by default
      password: "",
    });
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditData(null);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editData || !editData.studentId) return;
    try {
      const res = await fetch(
        `https://dgrnode.vercel.app/editstudent/${encodeURIComponent(editData.studentId)}`,
        {
          method: "PATCH",
          headers,
         body: JSON.stringify({
  name: editData.name,
  email: editData.email,
  mobile: editData.mobile,
  parentMobile: editData.parentMobile,
  address: editData.address,
  courseName: editData.course?.name,
  courseStatus: editData.course?.status,
  grade: editData.grade
})
        }
      );

      const data = await res.json();
      if (data.success) {
        alert("Student updated successfully");
        window.location.reload()
        closeEditModal();
        fetchAllStudents();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating student");
    }
  };

  // Small reusable styles (inline)
  const containerStyle = {
    padding: "18px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#1f2937",
  };

  const cardStyle = {
    background: "white",
    padding: "18px",
    borderRadius: "10px",
    boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
    marginTop: "16px",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  };

  const searchInputStyle = {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    width: "320px",
    outline: "none",
  };

  const actionBtnStyle = {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "12px",
  };

  const thStyle = {
    textAlign: "center",
    padding: "10px 12px",
    background: "#f8fafc",
    fontWeight: 600,
    borderBottom: "1px solid #e6e6e6",
  };

  const tdStyle = {
    padding: "10px 12px",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
  };

  

  return (
    <>
      <SidebarHeader />
      <div className="student-panel-container" style={containerStyle}>
        <h3 className="student-panel-title" style={{ marginBottom: 8 }}>
          Student Management Panel
        </h3>

        {/* Tabs */}
        <div className="tab-buttons" style={{ display: "flex", gap: 8 }}>
          <button
            className={`tab-button ${activeTab === "add" ? "active" : ""}`}
            onClick={() => setActiveTab("add")}
            style={{
              ...actionBtnStyle,
              background: activeTab === "add" ? "#111827" : "white",
              color: activeTab === "add" ? "white" : "#111827",
              border: "1px solid #e5e7eb",
            }}
          >
            Add Student
          </button>
          <button
            className={`tab-button ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
            style={{
              ...actionBtnStyle,
              background: activeTab === "all" ? "#111827" : "white",
              color: activeTab === "all" ? "white" : "#111827",
              border: "1px solid #e5e7eb",
            }}
          >
            All Students
          </button>
          <button
            className={`tab-button ${activeTab === "batch" ? "active" : ""}`}
            onClick={() => setActiveTab("batch")}
            style={{
              ...actionBtnStyle,
              background: activeTab === "batch" ? "#111827" : "white",
              color: activeTab === "batch" ? "white" : "#111827",
              border: "1px solid #e5e7eb",
            }}
          >
           Students Batch
          </button>
          {/* <button
            className={`tab-button ${activeTab === "manage" ? "active" : ""}`}
            onClick={() => setActiveTab("manage")}
            style={{
              ...actionBtnStyle,
              background: activeTab === "manage" ? "#111827" : "white",
              color: activeTab === "manage" ? "white" : "#111827",
              border: "1px solid #e5e7eb",
            }}
          >
            Manage Attendance
          </button> */}
          <button
            className={`tab-button ${activeTab === "summary" ? "active" : ""}`}
            onClick={() => setActiveTab("summary")}
            style={{
              ...actionBtnStyle,
              background: activeTab === "summary" ? "#111827" : "white",
              color: activeTab === "summary" ? "white" : "#111827",
              border: "1px solid #e5e7eb",
            }}
          >
            Attendance Record
          </button>
        </div>


        {activeTab === "all" && (
          <div className="card-box" style={cardStyle}>
            <div style={headerStyle}>
              <h1 style={{ margin: 0 }}>
                All Students{" "}
                <span style={{ color: "green", fontSize: "15px", marginLeft: 8 }}>
                  Total Student = {students.length}
                </span>
              </h1>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  placeholder="Search by ID / name / mobile"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={searchInputStyle}
                />
                <button
                  onClick={() => {
                    setSearchQuery("");
                  }}
                  style={{
                    ...actionBtnStyle,
                    background: "white",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  Clear
                </button>

                <button
                  onClick={() => fetchAllStudents()}
                  style={{
                    ...actionBtnStyle,
                    background: "white",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  Refresh
                </button>

                <button
                  onClick={handleBulkDelete}
                  disabled={Object.keys(selectedMap).length === 0 || loading}
                  style={{
                    ...actionBtnStyle,
                    background: Object.keys(selectedMap).length === 0 || loading ? "#f8d7da" : "#dc2626",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: Object.keys(selectedMap).length === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Deleting..." : `Delete Selected (${Object.keys(selectedMap).length})`}
                </button>
              </div>
            </div>

            <table className="student-table" style={tableStyle}>
              <thead>
                <tr style={{color : "black",textAlign : "center"}}>
                  <th style={thStyle}>
                    <input
                      type="checkbox"
                      checked={selectAllChecked}
                      onChange={handleSelectAll}
                    />
                  </th>
                  {/* <th style={thStyle}>Student ID</th> */}
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Mobile</th>
                  {/* <th style={thStyle}>Parent Mobile</th> */}
                  {/* <th style={thStyle}>Address</th> */}
                  <th style={thStyle}>Course</th>
<th style={thStyle}>Status</th>
<th style={thStyle}>Grade</th>
                  <th style={thStyle}>Actions</th>
                  <th style={thStyle}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={index} style={{ background: index % 2 === 0 ? "#ffffff" : "#fbfbfb" }}>
                    <td style={tdStyle}>
                      <input
                        type="checkbox"
                        checked={!!selectedMap[student.studentId]}
                        onChange={() => handleCheckboxChange(student.studentId)}
                      />
                    </td>
                    {/* <td style={tdStyle}>{student.studentId}</td> */}
                    <td style={tdStyle}>{student.name}</td>
                    <td style={tdStyle}>{student.email}</td>
                    <td style={tdStyle}>{student.mobile}</td>
                    {/* <td style={tdStyle}>{student.parentMobile}</td> */}
                    {/* <td style={tdStyle}>{student.address}</td> */}
                    <td style={tdStyle}>{student.course?.name}</td>
<td style={{margin : "5px" , padding : "0"}} className={`grade ${student.grade}`}>
  {student.grade}
</td>

<td className={`status ${student.course?.status}`}>
  {student.course?.status}
</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleViewAttendance(student.studentId)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "1px solid #e5e7eb",
                          background: "white",
                          cursor: "pointer",
                          marginRight: 8,
                        }}
                      >
                        👁 View Attendance
                      </button>

                      <button
                        onClick={() => openEditModal(student)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "1px solid #e5e7eb",
                          background: "white",
                          cursor: "pointer",
                        }}
                      >
                        ✏️ Edit
                      </button>
                    </td>

                    {/* NEW DELETE BUTTON TD (attractive) */}
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleDeleteStudent(student.studentId)}
                        style={{
                          backgroundColor: "#ff4d4d",
                          color: "white",
                          padding: "6px 12px",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          boxShadow: "0 0 5px rgba(255,0,0,0.2)",
                        }}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ padding: 20, textAlign: "center" }}>
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Show attendance if student selected */}
            {attendanceData.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h6>Attendance for {selectedStudentId}</h6>
                <table className="student-table" style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Date</th>
                      <th style={thStyle}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((att, i) => (
                      <tr key={i}>
                        <td style={tdStyle}>{att.date}</td>
                        <td style={tdStyle}>{att.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Export CSV */}
                <CSVLink
                  data={attendanceData}
                  headers={csvHeaders}
                  filename={`attendance_${selectedStudentId}.csv`}
                  className="export-button"
                  style={{
                    display: "inline-block",
                    marginTop: 10,
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "#111827",
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  Export Attendance as CSV
                </CSVLink>
              </div>
            )}
          </div>
        )}

        {/* Add Student */}
        {activeTab === "add" && (
    <div className="card-box" style={{
        // Card style: Added shadow, light background, and rounded corners
        backgroundColor: '#ffffff',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0e0e0' 
    }}>
        <form onSubmit={handleAddStudent}>
            <h3 style={{ color: '#0b7285', marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
                Add New Student
                {/* Style tag is included here for the spinner animation (@keyframes spin) */}
<style>{`
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`}</style>
<button
    type="submit"
    className="save-button"
    disabled={isLoading} // Disables button when loading
    style={{
        marginTop: "25px",
        background: isLoading ? "#5e7c85" : "#0b7285", // Color change on loading
        color: "white",
        padding: "12px 25px",
        borderRadius: 8,
        border: "none",
        cursor: isLoading ? "not-allowed" : "pointer", 
        fontWeight: "bold",
        fontSize: "16px",
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', 
        transition: "background-color 0.3s, transform 0.1s",
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
    }}
    onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#085f6e')} 
    onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#0b7285')} 
    onMouseDown={(e) => !isLoading && (e.target.style.transform = 'scale(0.98)')} 
    onMouseUp={(e) => !isLoading && (e.target.style.transform = 'scale(1)')} 
>
    {isLoading ? (
        <>
            <span style={{ 
                display: 'inline-block',
                width: '18px',
                height: '18px',
                border: '3px solid rgba(255, 255, 255, .3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                verticalAlign: 'middle',
                marginRight: '8px'
            }} />
            Saving...
        </>
    ) : (
        '💾 Save Student'
    )}
</button>
            </h3>

            
            
            <div className="form-row" style={{ display: "flex", flexWrap: "wrap", gap: 20 ,
              padding : "20px"
             }}>
                
                {/* Input Fields Container */}
                <div className="form-col-half" style={{ flex: "1 1 250px" }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>Student ID</label>
                    <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            transition: "border-color 0.3s, box-shadow 0.3s",
                            margin : "7px"
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#0b7285';
                            e.target.style.boxShadow = '0 0 0 3px rgba(11, 114, 133, 0.2)'; // Focus effect
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#ccc';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
                
                <div className="form-col-half" style={{ flex: "1 1 250px" }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            transition: "border-color 0.3s, box-shadow 0.3s",
                            margin : "7px"
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#0b7285';
                            e.target.style.boxShadow = '0 0 0 3px rgba(11, 114, 133, 0.2)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#ccc';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
                
                <div className="form-col-half" style={{ flex: "1 1 250px" , margin : "7px" }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            transition: "border-color 0.3s, box-shadow 0.3s"
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#0b7285';
                            e.target.style.boxShadow = '0 0 0 3px rgba(11, 114, 133, 0.2)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#ccc';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
                
                <div className="form-col-half" style={{ flex: "1 1 250px" }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            transition: "border-color 0.3s, box-shadow 0.3s"
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#0b7285';
                            e.target.style.boxShadow = '0 0 0 3px rgba(11, 114, 133, 0.2)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#ccc';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
                
                <div className="form-col-half" style={{ flex: "1 1 250px" }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>Mobile</label>
                    <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            transition: "border-color 0.3s, box-shadow 0.3s"
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#0b7285';
                            e.target.style.boxShadow = '0 0 0 3px rgba(11, 114, 133, 0.2)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#ccc';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
                
                <div className="form-col-half" style={{ flex: "1 1 250px" }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>Parent Mobile</label>
                    <input
                        type="text"
                        name="parentMobile"
                        value={formData.parentMobile}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            transition: "border-color 0.3s, box-shadow 0.3s"
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#0b7285';
                            e.target.style.boxShadow = '0 0 0 3px rgba(11, 114, 133, 0.2)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#ccc';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
                
                {/* Full-width Address Textarea */}
                <div className="form-col-full" style={{ flex: "1 1 100%", marginTop: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            resize: "vertical", 
                            transition: "border-color 0.3s, box-shadow 0.3s"
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#0b7285';
                            e.target.style.boxShadow = '0 0 0 3px rgba(11, 114, 133, 0.2)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#ccc';
                            e.target.style.boxShadow = 'none';
                        }}
                    ></textarea>
                </div>

                <div className="form-col-half" style={{ flex: "1 1 250px" }}>
  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
    Course Name
  </label>
  <input
    type="text"
    name="courseName"
    value={formData.courseName}
    onChange={handleChange}
    style={{
      width: "100%",
      padding: "10px 12px",
      borderRadius: 8,
      border: "1px solid #ccc"
    }}
  />
</div>
                
            </div>
            
            {/* Submit Button */}
           
        </form>
    </div>
)}
        {/* All Students */}
        

        {/* Manage Attendance */}
        {activeTab === "manage" && (
          <div className="card-box" style={cardStyle}>
            <h5>Mark Attendance</h5>
            <table className="student-table" style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Student ID</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} style={{ background: index % 2 === 0 ? "#ffffff" : "#fbfbfb" }}>
                    <td style={tdStyle}>{student.studentId}</td>
                    <td style={tdStyle}>{student.name}</td>
                    <td style={tdStyle}>
                      <select
                        value={student.attendanceStatus || ""}
                        onChange={(e) => handleAttendanceChange(index, e.target.value)}
                        style={{ padding: 8, borderRadius: 6 }}
                      >
                        <option value="">Select</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleMarkAttendance}
              className="save-button"
              style={{ marginTop: "15px", background: "#0b7285", color: "white", padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer" }}
            >
              Submit Attendance
            </button>
          </div>
        )}

        {
          activeTab === "batch" && (
             <BatchPage/>
          )
        }

        {/* attendance record */}
        {activeTab === "summary" && (
          <div className="card-box" style={cardStyle}>
            <h4>Attendance Summary</h4>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="date"
                value={summaryDate}
                onChange={(e) => setSummaryDate(e.target.value)}
                style={{ padding: 8, borderRadius: 6, border: "1px solid #e6e6e6" }}
              />
              <button onClick={fetchSummary} style={{ marginLeft: "10px", padding: "8px 10px", borderRadius: 6, border: "none", background: "#0b7285", color: "white", cursor: "pointer" }}>
                Get Attendence record
              </button>
            </div>

            {summaryData && (
              <div style={{ marginTop: "20px" }}>
                <p>
                  <strong>Date:</strong> {summaryData.date}
                </p>
                <p>
                  <strong>Total Students:</strong> {summaryData.total}
                </p>
                <p>
                  <strong>Present:</strong> {summaryData.present}
                </p>
                <p>
                  <strong>Absent:</strong> {summaryData.absent}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {isEditOpen && editData && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
          >
            <div style={{ width: 720, maxWidth: "95%", background: "white", borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>Edit Student</h3>
                <button onClick={closeEditModal} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 20 }}>
                  ×
                </button>
              </div>

              <form onSubmit={submitEdit} style={{ marginTop: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label>Student ID</label>
                    <input name="studentId" value={editData.studentId} readOnly disabled style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e6e6e6", background: "#f8fafc" }} />
                  </div>
                  <div>
                    <label>Name</label>
                    <input name="name" value={editData.name || ""} onChange={handleEditChange} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e6e6e6" }} />
                  </div>
                  <div>
                    <label>Email</label>
                    <input name="email" value={editData.email || ""} onChange={handleEditChange} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e6e6e6" }} />
                  </div>
                  <div>
                    <label>Mobile</label>
                    <input name="mobile" value={editData.mobile || ""} onChange={handleEditChange} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e6e6e6" }} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label>Parent Mobile</label>
                    <input name="parentMobile" value={editData.parentMobile || ""} onChange={handleEditChange} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e6e6e6" }} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label>Address</label>
                    <textarea name="address" value={editData.address || ""} onChange={handleEditChange} rows={3} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e6e6e6" }} />
                  </div>
                  <div>
  <select
  value={editData.course?.name || ""}
  onChange={(e) =>
    setEditData({
      ...editData,
      course: { ...editData.course, name: e.target.value }
    })
  }
>
  <option value="">Select Course</option>
  <option value="MERN Stack">MERN Stack</option>
  <option value="Frontend Development">React JS</option>
  <option value="Backend Develoment">Node JS</option>
  <option value="Web Development">Web Development</option>
  <option value="Digital Marketing">Digital Marketing</option>
  <option value="Web Design">Web Design</option>
  <option value="Graphic Design">Graphic Design</option>
  <option value="Video Editing">Video Editing</option>
  <option value="Data Science">Data Science</option>
</select>
</div>

<div>
  <label>Course Status</label>
  <select
    value={editData.course?.status || ""}
    onChange={(e) =>
      setEditData({
        ...editData,
        course: { ...editData.course, status: e.target.value }
      })
    }
    style={{ width: "100%", padding: 8, borderRadius: 6 }}
  >
    <option value="">Select</option>
    <option value="Ongoing">Ongoing</option>
    <option value="Completed">Completed</option>
  </select>
</div>

<div>
  <label>Grade</label>
  <select
  value={editData.grade || ""}
  onChange={(e) =>
    setEditData({ ...editData, grade: e.target.value })
  }
>
  <option value="">Select Grade</option>
  <option value="A">A</option>
  <option value="B">B</option>
  <option value="C">C</option>
  <option value="D">D</option>
</select>
</div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                  <button type="button" onClick={closeEditModal} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#0b7285", color: "white", cursor: "pointer" }}>
                    Update Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
       
      </div>
      
    </>
  );
};

export default StudentPanel;
