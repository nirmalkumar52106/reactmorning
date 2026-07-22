// import React, { useEffect, useState } from 'react';

// const UpdateFeesForm = () => {
//    const [students, setStudents] = useState([]);


//    const tokennn = localStorage.getItem("token");
//    const headers = {
//       "Content-Type": "application/json",
//       "Access-Control-Allow-Headers": "Content-Type",
//       "Authorization": `Bearer ${tokennn}`
//     };

//     useEffect(() => {
//     (async () => {
//       const res = await fetch('https://dgrnode.vercel.app/allstudents' , {headers});
//       const data = await res.json();
//       if (data.success) {
//         setStudents(data.students);
//       }
//     })();
//   }, []);

//   const [formData, setFormData] = useState({
//     studentId: '',
//     total: '',
//     paid: '',
//     dueDate: '',
//     emi: ''
//   });

//   const handleChange = e => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();

//     const res = await fetch('https://dgrnode.vercel.app/update-fees', {
//       method: 'POST',
//       headers,
//       body: JSON.stringify(formData)
//     });

//     const data = await res.json();
//     alert(data.message);
//   };

//   return (
//     <div className='payfees-form'>
// <form onSubmit={handleSubmit}>
//       <select
//           name="studentId"
//           value={formData.studentId}
//           onChange={handleChange}
//           required
//         >
//           <option value="" disabled>-- Select Student --</option>
//           {students.map(s => (
//             <option key={s.studentId} value={s.studentId}>
//               {s.studentId} — {s.name}
//             </option>
//           ))}
//         </select>

//       <input name="total" type="number" placeholder="Total Fees" onChange={handleChange} required />
//       <input name="paid" type="number" placeholder="Paid Amount" onChange={handleChange} />
//       <input name="dueDate" type="date" onChange={handleChange} />
      
//       <div className='emi-field'>
//        <label>
//   EMI:
//   <select
//     name="emi"
//     value={formData.emi ? "true" : "false"}
//     onChange={e =>
//       setFormData(prev => ({ ...prev, emi: e.target.value === "true" }))
//     }
//   >
//     <option value="false">No</option>
//     <option value="true">Yes</option>
//   </select>
// </label>
//         </div>

      

//       <button type="submit">Update Fees</button>
//     </form>
//     </div>
    
//   );
// };

// export default UpdateFeesForm;

import React, { useEffect, useState } from "react";

const UpdateFeesForm = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const tokennn = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    Authorization: `Bearer ${tokennn}`,
  };

  useEffect(() => {
    (async () => {
      const res = await fetch("https://dgrnode.vercel.app/allstudents", {
        headers,
      });

      const data = await res.json();

      if (data.success) {
        setStudents(data.students);
      }
    })();
  }, []);

  const [formData, setFormData] = useState({
    studentId: "",
    total: "",
    paid: "",
    dueDate: "",
    emi: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("https://dgrnode.vercel.app/update-fees", {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((s) =>
    `${s.studentId} ${s.name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="payfees-form"
      style={{
        maxWidth: "600px",
        margin: "30px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "14px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "25px",
          color: "#0d6efd",
        }}
      >
        Update Student Fees
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Search Student */}
        <input
          type="text"
          placeholder="Search Student ID or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />

        {/* Student Dropdown */}
        <select
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="" disabled>
            -- Select Student --
          </option>

          {filteredStudents.map((s) => (
            <option key={s.studentId} value={s.studentId}>
              {s.studentId} — {s.name}
            </option>
          ))}
        </select>

        {/* Total Fees */}
        <input
          name="total"
          type="number"
          placeholder="Total Fees"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* Paid */}
        <input
          name="paid"
          type="number"
          placeholder="Paid Amount"
          onChange={handleChange}
          style={inputStyle}
        />

        {/* Due Date */}
        <input
          name="dueDate"
          type="date"
          onChange={handleChange}
          style={inputStyle}
        />

        {/* EMI */}
        <div
          className="emi-field"
          style={{
            marginBottom: "18px",
          }}
        >
          <label
            style={{
              fontWeight: "600",
              display: "block",
              marginBottom: "8px",
            }}
          >
            EMI Option
          </label>

          <select
            name="emi"
            value={formData.emi ? "true" : "false"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                emi: e.target.value === "true",
              }))
            }
            style={inputStyle}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        {/* Submit */}
        <button type="submit" style={btnStyle} disabled={loading}>
          {loading ? "Updating..." : "Update Fees"}
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "15px",
  outline: "none",
};

const btnStyle = {
  width: "100%",
  padding: "13px",
  border: "none",
  borderRadius: "8px",
  background: "#0d6efd",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

export default UpdateFeesForm;
