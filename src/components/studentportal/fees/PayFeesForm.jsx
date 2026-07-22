import React, { useEffect, useState } from "react";

const PayFeesForm = () => {
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
    amount: "",
    mode: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      studentId: formData.studentId,
      amount: Number(formData.amount),
      mode: formData.mode,
    };

    if (isNaN(payload.amount) || payload.amount <= 0) {
      return alert("Please enter a valid amount.");
    }

    try {
      setLoading(true);

      const res = await fetch("https://dgrnode.vercel.app/payfees", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
      window.location.reload()
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
        maxWidth: "550px",
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
        Pay Student Fees
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search Student ID or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />

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

        <input
          name="amount"
          type="number"
          placeholder="Enter Amount"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="mode"
          placeholder="Payment Mode (Cash / UPI)"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button type="submit" style={btnStyle} disabled={loading}>
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <span style={loaderStyle}></span>
              Processing...
            </span>
          ) : (
            "Submit Payment"
          )}
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

const loaderStyle = {
  width: "18px",
  height: "18px",
  border: "3px solid #ffffff80",
  borderTop: "3px solid #fff",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

export default PayFeesForm;