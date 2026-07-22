import React, { useEffect, useState } from "react";

export default function BatchCard({ batch, refresh }) {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingRemoveId, setLoadingRemoveId] = useState(null);

  const [open, setOpen] = useState(false);

  // ✅ NEW STATES (EDIT)
  const [editMode, setEditMode] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [staffs, setStaffs] = useState([]);

  console.log("staff", staffs);

  const [showHistory, setShowHistory] = useState(false);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const [form, setForm] = useState({
    name: batch.name || "",
    start: batch.timing?.start || "",
    end: batch.timing?.end || "",
    staffId: batch.staffId?._id || "",

    // ✅ NEW (added only)
    course: batch.course || "",
    currentSubject: batch.currentSubject || "",
    currentTopic: batch.currentTopic || "",
  });

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 👉 Fetch students
  useEffect(() => {
    fetch("https://dgrnode.vercel.app/allstudents", { headers })
      .then((res) => res.json())
      .then((data) =>
        setAllStudents(Array.isArray(data) ? data : data.students || []),
      );
  }, []);

  // ✅ FETCH STAFF (EDIT)
  useEffect(() => {
    fetch("https://dgrnode.vercel.app/api/staff", { headers })
      .then((res) => res.json())
      .then((data) => setStaffs(Array.isArray(data) ? data : data.staff || []));
  }, []);

  // ❌ Delete Batch
  const deleteBatch = async () => {
    const confirmDelete = window.confirm("Are you sure to delete this batch?");

    if (confirmDelete) {
      setLoadingDelete(true);
      try {
        await fetch(`https://dgrnode.vercel.app/api/batch/${batch._id}`, {
          method: "DELETE",
          headers,
        });
        refresh();
      } finally {
        setLoadingDelete(false);
      }
    }
  };

  // ✅ UPDATE BATCH (EDIT)
  const updateBatch = async () => {
    setLoadingUpdate(true);

    try {
      await fetch(`https://dgrnode.vercel.app/api/batch/update/${batch._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(form),
      });

      alert("Batch updated ✅");
      setEditMode(false);
      refresh();
    } finally {
      setLoadingUpdate(false);
    }
  };

  // ✅ Select Student
  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  // ✅ ADD Students
  const addStudentsToBatch = async () => {
    if (selectedStudents.length === 0) return alert("Select students");

    setLoadingAdd(true);

    try {
      for (let studentId of selectedStudents) {
        await fetch("https://dgrnode.vercel.app/api/batch/add-student", {
          method: "POST",
          headers,
          body: JSON.stringify({
            batchId: batch._id,
            studentId,
          }),
        });
      }

      alert("Students added ✅");
      setSelectedStudents([]);
      refresh();
    } finally {
      setLoadingAdd(false);
    }
  };

  // ❌ REMOVE Student
  const removeStudent = async (studentId) => {
    setLoadingRemoveId(studentId);

    try {
      await fetch("https://dgrnode.vercel.app/api/batch/remove-student", {
        method: "POST",
        headers,
        body: JSON.stringify({
          batchId: batch._id,
          studentId,
        }),
      });

      refresh();
    } finally {
      setLoadingRemoveId(null);
    }
  };

  // 🔍 filter
  const filteredStudents = allStudents
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .filter((s) => !batch.students?.some((bs) => bs._id === s._id));

  useEffect(() => {
    fetch("https://dgrnode.vercel.app/studentswithtodayattendance", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const map = {};
          data.students.forEach((s) => {
            map[s.studentId] = s.attendance;
          });
          setAttendanceMap(map);
        }
      });
  }, []);

  // 👉 Mark attendance
  const markAttendance = async (studentId, status) => {
    setLoadingId(studentId);

    try {
      const res = await fetch("https://dgrnode.vercel.app/updateattendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId, status }),
      });

      const data = await res.json();

      if (data.success) {
        setAttendanceMap((prev) => ({
          ...prev,
          [studentId]: status,
        }));
      }
    } catch (err) {
      console.error(err);
    }

    setLoadingId(null);
  };

 

  return (
    <>
    
      <div className="batch-card">
        {/* 🔥 HEADER */}
        <div
          onClick={() => setOpen(!open)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
            alignItems: "center",
          }}
        >
          <div className="batch-title">{batch.name}</div>
          <div>{open ? "🔽" : "▶️"}</div>
        </div>

        {open && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                gap: "10px",
              }}
            >
              <button
                className="btn btn-danger"
                onClick={deleteBatch}
                disabled={loadingDelete}
              >
                {loadingDelete ? "Deleting..." : "Delete Batch"}
              </button>

              {/* ✅ EDIT BUTTON */}
              <button
                className="btn btn-primary"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? "Cancel" : "Edit"}
              </button>

              <button
                className="btn btn-warning"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? "Hide Topics" : "Completed Topics"}
              </button>
            </div>

            {/* ✅ EDIT FORM */}

            {showHistory && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  borderRadius: "10px",
                  background: "#fff",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                <h4 style={{ marginBottom: "8px" }}>📚 Topic History</h4>

                {batch.topicHistory?.length === 0 && (
                  <div>No history found</div>
                )}

                {batch.topicHistory?.map((t, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "6px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div>
                      <b>{t.subject}</b> - {t.topic}
                    </div>
                    <small>{new Date(t.date).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            )}
            {editMode && (
              <div style={{ marginTop: "10px" }}>
                <input
                  placeholder="Batch Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="time"
                  value={form.start}
                  onChange={(e) => setForm({ ...form, start: e.target.value })}
                />
                <input
                  type="time"
                  value={form.end}
                  onChange={(e) => setForm({ ...form, end: e.target.value })}
                />
                <br />
                Select Trainer :
                <select
                  value={form.staffId}
                  onChange={(e) =>
                    setForm({ ...form, staffId: e.target.value })
                  }
                >
                  <option>Select Staff</option>
                  {staffs.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {/* ✅ NEW EDIT FIELDS */}
                Course:{" "}
                <select
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                >
                  <option value="">Select Course</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Web Design">Web Design</option>
                </select>
                <input
                  placeholder="Subject"
                  value={form.currentSubject}
                  onChange={(e) =>
                    setForm({ ...form, currentSubject: e.target.value })
                  }
                />
                <input
                  placeholder="Topic"
                  value={form.currentTopic}
                  onChange={(e) =>
                    setForm({ ...form, currentTopic: e.target.value })
                  }
                />
                <button
                  className="btn btn-success"
                  onClick={updateBatch}
                  disabled={loadingUpdate}
                >
                  {loadingUpdate ? "Updating..." : "Update"}
                </button>
              </div>
            )}

            <div
              style={{
                marginTop: "10px",
                padding: "12px",
                borderRadius: "10px",
                background: "#f9fafb",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ marginBottom: "6px", fontSize: "14px" }}>
                ⏰ <b>Timing:</b> {batch.timing?.start} - {batch.timing?.end}
              </div>

              <div style={{ marginBottom: "6px", fontSize: "14px" }}>
                👨‍🏫 <b>Trainer:</b> {batch.staffId?.name || "No Staff"}
              </div>

              {/* 🔥 Highlight Section */}
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "#fff",
                }}
              >
                <div style={{ fontSize: "13px", opacity: 0.9 }}>📘 Course</div>
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {batch.course || "-"}
                </div>

                <div
                  style={{ marginTop: "6px", fontSize: "13px", opacity: 0.9 }}
                >
                  📗 Subject
                </div>
                <div style={{ fontSize: "15px" }}>
                  {batch.currentSubject || "-"}
                </div>

                <div
                  style={{ marginTop: "6px", fontSize: "13px", opacity: 0.9 }}
                >
                  📕 Topic
                </div>
                <div style={{ fontSize: "15px", fontWeight: "500" }}>
                  {batch.currentTopic || "-"}
                </div>
              </div>

              {/* 👥 Students */}
              <div
                style={{
                  marginTop: "10px",
                  padding: "8px",
                  borderRadius: "6px",
                  background: "#eef2ff",
                  fontWeight: "500",
                }}
              >
                👥 Total Students: {batch.students?.length}
              </div>
            </div>

            <ul style={{ marginTop: "15px", padding: 0 }}>
              {batch.students?.map((s) => (
                <li
                  key={s._id}
                  style={{
                    listStyle: "none",
                    marginBottom: "12px",
                    padding: "12px 15px",
                    borderRadius: "10px",
                    background: "#f9f9f9",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {/* 👨‍🎓 Student Name */}
                  <div style={{ fontWeight: "600", fontSize: "15px" }}>
                    {s.name}
                  </div>

                  {/* 🎯 Buttons + Status */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {/* ✅ Present Button */}
                      <button
                        onClick={() => markAttendance(s.studentId, "Present")}
                        disabled={loadingId === s.studentId}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "25px",
                          border: "none",
                          background:
                            "linear-gradient(135deg, #28a745, #218838)",
                          color: "#fff",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                          boxShadow: "0 2px 6px rgba(40,167,69,0.4)",
                        }}
                      >
                        Present
                      </button>

                      {/* ❌ Absent Button */}
                      <button
                        onClick={() => markAttendance(s.studentId, "Absent")}
                        disabled={loadingId === s.studentId}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "25px",
                          border: "2px solid #dc3545",
                          background: "#fff",
                          color: "#dc3545",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Absent
                      </button>
                    </div>

                    {/* 📌 Status Badge */}
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        background:
                          attendanceMap[s.studentId] === "Present"
                            ? "#d4edda"
                            : attendanceMap[s.studentId] === "Absent"
                              ? "#f8d7da"
                              : "#e2e3e5",
                        color:
                          attendanceMap[s.studentId] === "Present"
                            ? "#155724"
                            : attendanceMap[s.studentId] === "Absent"
                              ? "#721c24"
                              : "#383d41",
                      }}
                    >
                      {loadingId === s.studentId
                        ? "Updating..."
                        : attendanceMap[s.studentId] || "Not Marked"}
                    </span>

                    {/* ❌ Remove Button */}
                    <button
                      className="btn btn-danger"
                      style={{ padding: "5px 10px", fontSize: "13px" }}
                      onClick={() => removeStudent(s._id)}
                    >
                      🗑 Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* 🔍 Search */}
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginTop: "15px", width: "100%", padding: "6px" }}
            />

            {/* 👇 All Students */}
            <ul style={{ maxHeight: "150px", overflowY: "auto" }}>
              {filteredStudents.map((s) => (
                <li key={s._id} style={{ marginBottom: "8px" }}>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(s._id)}
                    onChange={() => toggleStudent(s._id)}
                  />

                  <span style={{ marginLeft: "8px" }}>{s.name}</span>
                </li>
              ))}
            </ul>

            {/* 🚀 ADD BUTTON */}
            <button
              className="btn btn-primary"
              style={{ marginTop: "15px", width: "100%" }}
              onClick={addStudentsToBatch}
              disabled={loadingAdd}
            >
              {loadingAdd ? "Adding..." : "➕ Add Selected Students"}
            </button>
          </>
        )}
      </div>
    </>
  );
}
