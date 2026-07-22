import React, { useState, useEffect } from "react";

export default function CreateBatch() {
  const [form, setForm] = useState({
    name: "",
    start: "",
    end: "",
    staffId: "",

    // ✅ NEW (added only)
    course: "",
    currentSubject: "",
    currentTopic: ""
  });

  const [staffs, setStaffs] = useState([]);

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };

  useEffect(() => {
    fetch("https://dgrnode.vercel.app/api/staff", {
      headers,
    })
      .then(res => {
        
        return res.json(); // ✅ FIX (return added)
      })
      .then(data => {
     
        setStaffs(Array.isArray(data) ? data : data.staff || []); // ✅ SAFE SET
      })
      .catch(err => console.log("error 👉", err));
  }, []);

  
  const handleSubmit = async () => {
    const res = await fetch("https://dgrnode.vercel.app/api/batch/create", {
      method: "POST",
      headers,
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data.msg || "Batch Created");
  };

  return (
    <div className="batch-card">
      <h3>Create Batch</h3>

      <input
        placeholder="Batch Name"
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="time"
        onChange={e => setForm({ ...form, start: e.target.value })}
      />

      <input
        type="time"
        onChange={e => setForm({ ...form, end: e.target.value })}
      />

      <select onChange={e => setForm({ ...form, staffId: e.target.value })}>
        <option>Select Staff</option>

        {staffs?.map(s => (
          <option key={s._id} value={s._id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* ✅ NEW INPUTS (added below) */}

      

      <select
  
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
        placeholder="Subject (e.g. HTML, CSS, JS)"
        onChange={e => setForm({ ...form, currentSubject: e.target.value })}
      />

      <input
        placeholder="Current Topic (e.g. Forms)"
        onChange={e => setForm({ ...form, currentTopic: e.target.value })}
      />

      <button className="btn btn-primary" onClick={handleSubmit}>
        Create
      </button>
    </div>
  );
}