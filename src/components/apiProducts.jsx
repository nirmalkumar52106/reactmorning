import React, { useEffect, useState, useMemo, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ExportExcel } from "./enquiryReport";
import { Link } from "react-router-dom";

function ApiFetching() {
  const [allproducts, setAllProducts] = useState([]);
  const [filterProduct, setFilterProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const recordsPerPage = 12;

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      try {
        setPageLoading(true);

        const response = await fetch("https://dgrnode.vercel.app/allenquiry", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

      const sortedData = [...data].reverse();

setAllProducts(sortedData);
setFilterProduct(sortedData);
      } catch (error) {
        toast.error("Failed to fetch data.");
      } finally {
        setPageLoading(false);
      }
    }

    fetchData();
  }, [token]);

  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm("Are you sure you want to delete this Enquiry?")) {
        try {
          setDeleteLoadingId(id);

          await fetch(`https://dgrnode.vercel.app/allenquiry/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          toast.success("Enquiry deleted");

          const updatedData = allproducts.filter((item) => item._id !== id);

          setAllProducts(updatedData);
          setFilterProduct(updatedData);
        } catch (error) {
          toast.error("Try again...");
        } finally {
          setDeleteLoadingId(null);
        }
      }
    },
    [allproducts, token],
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filterProduct.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );

  const totalPages = Math.ceil(filterProduct.length / recordsPerPage);

  const nextPage = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  const filterByCourse = (e) => {
    const value = e.target.value;

    if (value) {
      setFilterProduct(allproducts.filter((item) => item.cource === value));
    } else {
      setFilterProduct(allproducts);
    }
  };

  const filterByStatus = (e) => {
    const value = e.target.value;

    if (value) {
      setFilterProduct(allproducts.filter((item) => item.statuss === value));
    } else {
      setFilterProduct(allproducts);
    }
  };

  const Searchbyname = (e) => {
    const getnamee = e.target.value.toLowerCase();

    const filteredStudents = allproducts.filter((student) =>
      student.namee.toLowerCase().includes(getnamee),
    );

    if (getnamee) {
      setFilterProduct(filteredStudents);
    } else {
      setFilterProduct(allproducts);
    }
  };

  const resetFilters = () => {
    toast.success("All Recent Filters Reset ✅");
    setFilterProduct(allproducts);
  };

  const registeredCount = allproducts.filter(
    (item) => item.statuss === "Registered",
  ).length;

  const pendingCount = allproducts.filter(
    (item) => item.statuss === "Pending",
  ).length;

  const totalEnquiries = allproducts.length;

  const registeredPercentage = totalEnquiries
    ? ((registeredCount / totalEnquiries) * 100).toFixed(2)
    : 0;

  const pendingPercentage = totalEnquiries
    ? ((pendingCount / totalEnquiries) * 100).toFixed(2)
    : 0;

  const pendingStudents = allproducts.filter(
    (item) => item.statuss === "Pending",
  );

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const lastReminder = localStorage.getItem("lastReminder");

    if (!lastReminder || new Date(lastReminder).getDate() !== now.getDate()) {
      if (currentHour >= 10) {
        if (pendingStudents.length > 0) {
          toast(
            `Reminder: Call ${pendingStudents.length} pending students today! ☎️`,
          );
          localStorage.setItem("lastReminder", now);
        }
      }
    }
  }, [allproducts]);

  const [seepending, setseepending] = useState("none");
  const [pendingSearch, setPendingSearch] = useState("");
  const [statusLoadingId, setStatusLoadingId] = useState(null);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setStatusLoadingId(id); // ✅ loader start

      await fetch(`https://dgrnode.vercel.app/allenquiry/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ statuss: newStatus }),
      });

      toast.success("Status updated ✅");

      const updatedData = allproducts.map((item) =>
        item._id === id ? { ...item, statuss: newStatus } : item,
      );

      setAllProducts(updatedData);
      setFilterProduct(updatedData);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setStatusLoadingId(null); // ✅ loader stop
    }
  };

  const filteredPendingStudents = pendingStudents.filter(
    (student) =>
      student.namee.toLowerCase().includes(pendingSearch.toLowerCase()) ||
      student.mobile.includes(pendingSearch),
  );

  const seependingggg = () => {
    setseepending("block");
  };

  const closepending = () => {
    setseepending("none");
  };

  const [formData, setFormData] = useState({
    namee: "",
    mobile: "",
    email: "",
    adress: "",
    dob: "",
    cource: "",
    responsee: "",
    statuss: "",
    comments: "",
    enqdate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // handleSubmit replace karo
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);

      const response = await fetch("https://dgrnode.vercel.app/addenquiry", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("New Enquiry added..");

        const newData = await response.json().catch(() => null);

        if (newData) {
          setAllProducts((prev) => [newData, ...prev]);
          setFilterProduct((prev) => [newData, ...prev]);
        } else {
          setTimeout(() => window.location.reload(), 700);
        }

        Hide();
      } else {
        toast.error("Please try again");
      }
    } catch (error) {
      toast.error("Please try again");
    } finally {
      setSubmitLoading(false);
    }
  };

  const tokeennn = localStorage.getItem("token");

  if (!tokeennn) {
    setTimeout(() => window.location.replace("/"), 500);
  }

  const [showw, setshoww] = useState(true);

  const Show = () => setshoww(false);
  const Hide = () => setshoww(true);

  return (
    <>
      <Toaster />

      <style>{`
      body{
        margin:0;
        padding:0;
        background:#eef2f7;
        font-family:Arial;
      }

      .dashboard{
        width:95%;
        margin:auto;
      }

      .analysis-section{
        background:linear-gradient(135deg,#1e293b,#0f172a);
        color:white;
        padding:25px;
        border-radius:18px;
        margin-top:25px;
        box-shadow:0 10px 30px rgba(0,0,0,.12);
      }

      .analysis-section h3{
        margin-bottom:15px;
      }

      .analysis-section p{
        margin:8px 0;
        font-size:16px;
      }

      .filter-section{
        background:white;
        padding:20px;
        border-radius:18px;
        margin-top:20px;
        display:flex;
        flex-wrap:wrap;
        gap:12px;
        box-shadow:0 8px 20px rgba(0,0,0,.08);
      }

      .filter-section input,
      .filter-section select{
        padding:12px;
        border-radius:10px;
        border:1px solid #ddd;
        min-width:220px;
        outline:none;
      }

      .filter-section button{
        padding:12px 18px;
        border:none;
        border-radius:10px;
        cursor:pointer;
        color:white;
        font-weight:bold;
        background:linear-gradient(135deg,#2563eb,#1d4ed8);
      }

      table{
        width:100%;
        margin-top:25px;
        border-collapse:collapse;
        background:white;
        border-radius:16px;
        overflow:hidden;
        box-shadow:0 8px 20px rgba(0,0,0,.08);
      }

      table thead{
        background:#111827;
        color:white;
      }

      th,td{
        padding:14px;
        text-align:center;
      }

      tbody tr:nth-child(even){
        background:#f9fafb;
      }

      tbody tr:hover{
        background:#eef6ff;
      }

      .delete-btn{
        background:red;
        color:white;
        border:none;
        padding:10px 14px;
        border-radius:8px;
        cursor:pointer;
      }

      .save{
        background:#16a34a!important;
        color:white;
        border:none;
        padding:10px 14px;
        border-radius:8px;
        cursor:pointer;
      }

      .pagination{
        margin:20px 0;
        display:flex;
        justify-content:center;
        align-items:center;
        gap:15px;
      }

      .pagination button{
        background:#2563eb;
        color:white;
        border:none;
        padding:10px 18px;
        border-radius:8px;
        cursor:pointer;
      }

      .popup-overlay{
        position:fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        background:rgba(0,0,0,.45);
        z-index:9999;
        display:flex;
        justify-content:center;
        align-items:center;
      }

      .form-box{
        background:white;
        width:700px;
        max-width:95%;
        padding:30px;
        border-radius:20px;
        box-shadow:0 20px 50px rgba(0,0,0,.25);
        max-height:90vh;
        overflow:auto;
      }

      .form-box h2{
        margin:0;
      }

      .cross-flex{
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:20px;
      }

      .close-btn{
        background:red;
        color:white;
        border:none;
        padding:10px 14px;
        border-radius:10px;
        cursor:pointer;
      }

      .enquiry-form{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:15px;
      }

      .form-group{
        display:flex;
        flex-direction:column;
      }

      .form-group label{
        font-size:14px;
        margin-bottom:6px;
        font-weight:bold;
      }

      .form-group input,
      .form-group select,
      .form-group textarea{
        padding:12px;
        border:1px solid #ddd;
        border-radius:10px;
        outline:none;
      }

      .full{
        grid-column:1/3;
      }

      .submit-btn{
        grid-column:1/3;
        padding:14px;
        border:none;
        border-radius:12px;
        color:white;
        font-size:16px;
        font-weight:bold;
        background:linear-gradient(135deg,#16a34a,#15803d);
        cursor:pointer;
      }

      .reminder-section{
        background:#fff7ed;
        border-left:6px solid orange;
        padding:20px;
        border-radius:14px;
        margin-top:20px;
      }

      @media(max-width:768px){
        .enquiry-form{
          grid-template-columns:1fr;
        }

        .full,.submit-btn{
          grid-column:auto;
        }

        .filter-section{
          flex-direction:column;
        }

        .filter-section input,
        .filter-section select,
        .filter-section button{
          width:100%;
        }

        table{
          font-size:13px;
        }
      }
       
.loader-spin{
  width:18px;
  height:18px;
  border:3px solid rgba(255,255,255,.4);
  border-top:3px solid #fff;
  border-radius:50%;
  display:inline-block;
  animation:spin .7s linear infinite;
}

.big-loader{
  width:45px;
  height:45px;
  border:5px solid #ddd;
  border-top:5px solid #2563eb;
  border-radius:50%;
  animation:spin .7s linear infinite;
  margin:auto;
}

.page-loader-wrap{
  padding:80px;
  text-align:center;
}

@keyframes spin{
  100%{
    transform:rotate(360deg);
  }
}

.pending-container{
  margin-top:20px;
  padding:25px;
  background:linear-gradient(135deg,#fff,#f8fafc);
  border-radius:18px;
  box-shadow:0 10px 25px rgba(0,0,0,.08);
}

.pending-container h3{
  margin-bottom:20px;
  color:#1e293b;
}

.pending-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:18px;
}

.pending-card{
  background:white;
  padding:18px;
  border-radius:16px;
  box-shadow:0 8px 18px rgba(0,0,0,.06);
  transition:.3s;
  border-left:5px solid orange;
}

.pending-card:hover{
  transform:translateY(-5px);
}

.pending-top{
  display:flex;
  justify-content:space-between;
  margin-bottom:10px;
}

.pending-index{
  font-weight:bold;
  color:#64748b;
}

.pending-status{
  background:#fef3c7;
  color:#92400e;
  padding:4px 10px;
  border-radius:20px;
  font-size:12px;
}

.pending-card h4{
  margin:8px 0;
  color:#0f172a;
}

.pending-card p{
  margin:4px 0;
  font-size:14px;
  color:#475569;
}

.pending-actions{
  margin-top:12px;
}

.update-btn{
  width:100%;
  padding:10px;
  border:none;
  border-radius:10px;
  background:linear-gradient(135deg,#2563eb,#1d4ed8);
  color:white;
  font-weight:bold;
  cursor:pointer;
  transition:.3s;
}

.update-btn:hover{
  opacity:.9;
}

.pending-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:15px;
}

.pending-count{
  background:#fee2e2;
  color:#991b1b;
  padding:6px 14px;
  border-radius:20px;
  font-size:13px;
  font-weight:bold;
}

.pending-search{
  width:100%;
  padding:12px;
  border-radius:10px;
  border:1px solid #ddd;
  margin-bottom:18px;
  outline:none;
}

.status-dropdown{
  width:100%;
  padding:10px;
  border-radius:10px;
  border:1px solid #ddd;
  margin-top:10px;
  cursor:pointer;
}

.status-loader-wrap{
  display:flex;
  align-items:center;
  justify-content:center;
  padding:10px;
  border:1px solid #ddd;
  border-radius:10px;
  background:#f9fafb;
  font-size:14px;
}

.table-wrapper{
  width:82%;
  margin:30px auto;
  border-radius:20px;
  background:linear-gradient(145deg,#ffffff,#f8fafc);
  box-shadow:0 20px 50px rgba(0,0,0,.08);
  overflow:hidden;
}

/* Top Bar */
.table-header-bar{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:18px 25px;
  background:linear-gradient(135deg,#1e293b,#0f172a);
  color:white;
}

.table-header-bar h3{
  margin:0;
  font-size:18px;
}

.table-count{
  background:rgba(255,255,255,.15);
  padding:6px 14px;
  border-radius:20px;
  font-size:13px;
}

/* Scroll */
.table-scroll{
  overflow-x:auto;
}

/* Table */
.pro-table{
  width:100%;
  border-collapse:separate;
  border-spacing:0;
}

/* Sticky Header */
.pro-table thead th{
 
  background:#0f172a;
  color:white;
  padding:16px;
  font-size:13px;
  // text-align:left;
  z-index:2;
}

/* Rows */
.pro-table tbody tr{
  transition:.25s ease;
}

.pro-table tbody tr:hover{
  background:#f1f5f9;
  transform:scale(1.002);
}

/* Cells */
.pro-table td{
  padding:15px;
  border-bottom:1px solid #f1f5f9;
}

/* Avatar + Name */
.user-info{
  display:flex;
  align-items:center;
  gap:12px;
}

.avatar{
  width:38px;
  height:38px;
  border-radius:50%;
  background:linear-gradient(135deg,#2563eb,#1d4ed8);
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:bold;
  font-size:15px;
  box-shadow:0 5px 12px rgba(37,99,235,.3);
}

.name{
  font-weight:600;
  color:#0f172a;
  font-size:14px;
}

/* Contact */
.contact{
  font-size:13px;
  color:#475569;
}

/* Course Badge */
.course-badge{
  background:linear-gradient(135deg,#e0f2fe,#bae6fd);
  color:#0369a1;
  padding:6px 12px;
  border-radius:20px;
  font-size:12px;
  font-weight:500;
}

/* Status Badge */
.status-badge{
  padding:6px 14px;
  border-radius:20px;
  font-size:12px;
  font-weight:bold;
}

.status-badge.green{
  background:#dcfce7;
  color:#166534;
}

.status-badge.orange{
  background:#fef3c7;
  color:#92400e;
}

.status-badge.red{
  background:#fee2e2;
  color:#991b1b;
}

/* Buttons */
.action-buttons{
  display:flex;
  gap:10px;
}

.view-btn{
  background:linear-gradient(135deg,#2563eb,#1d4ed8);
  color:white;
  border:none;
  padding:8px 14px;
  border-radius:8px;
  cursor:pointer;
  transition:.2s;
}

.view-btn:hover{
  transform:translateY(-2px);
  box-shadow:0 6px 14px rgba(37,99,235,.3);
}

.delete-btn{
  background:linear-gradient(135deg,#ef4444,#dc2626);
  color:white;
  border:none;
  padding:8px 14px;
  border-radius:8px;
  cursor:pointer;
  transition:.2s;
}

.delete-btn:hover{
  transform:translateY(-2px);
  box-shadow:0 6px 14px rgba(239,68,68,.3);
}

/* Empty */
.no-data{
  text-align:center;
  padding:30px;
  color:#64748b;
  font-size:14px;
}

/* Mobile */
@media(max-width:768px){
  .table-header-bar{
    flex-direction:column;
    gap:8px;
    align-items:flex-start;
  }

  .pro-table th,
  .pro-table td{
    padding:12px;
    font-size:12px;
  }
}
      `}</style>

      <div className="dashboard">
        {showw === false && (
          <div className="popup-overlay">
            <div className="form-box">
              <div className="cross-flex">
                <h2>Add Enquiry</h2>
                <button onClick={Hide} className="close-btn">
                  X
                </button>
              </div>

              <form onSubmit={handleSubmit} className="enquiry-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    name="namee"
                    value={formData.namee}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mobile</label>
                  <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Adress</label>
                  <input
                    name="adress"
                    value={formData.adress}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Date of Birth{" "}
                    <span style={{ fontSize: "13px", color: "orange" }}>
                      Optional
                    </span>
                  </label>

                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Cource</label>
                  <select required name="cource" onChange={handleChange}>
                    <option value="">Choose cource</option>
                    <option>Web Development</option>
                    <option>Web Design</option>
                    <option>Digital marketing</option>
                    <option>App Development</option>
                    <option>Graphic Design</option>
                    <option>Video Editing</option>
                    <option>Data Science</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Response</label>
                  <select required name="responsee" onChange={handleChange}>
                    <option value="">Response</option>
                    <option>Negative</option>
                    <option>Positive</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select required name="statuss" onChange={handleChange}>
                    <option value="">Status</option>
                    <option>Pending</option>
                    <option>NotInterested</option>
                    <option>Registered</option>
                  </select>
                </div>

                <div className="form-group full">
                  <label>Comments</label>
                  <textarea name="comments" onChange={handleChange}></textarea>
                </div>

                <div className="form-group">
                  <label>Enquiry Date</label>
                  <input type="date" name="enqdate" onChange={handleChange} />
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <>
                      <span className="loader-spin"></span> Adding...
                    </>
                  ) : (
                    "Add Enquiry"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* <div className="analysis-section">
          <h3>📊 Enquiry Analysis</h3>
          <p>Total Enquiries: <b>{totalEnquiries}</b></p>
          <p>✅ Registered: <b>{registeredCount}</b> ({registeredPercentage}%)</p>
          <p>⏳ Pending: <b>{pendingCount}</b> ({pendingPercentage}%)</p>
        </div> */}

        <div style={{ display: seepending }}>
          {pendingStudents.length > 0 && (
            <div
              className="pending-container"
              style={{ width: "80%", margin: "20px auto" }}
            >
              <div className="pending-header">
                <h3>📞 Pending Enquiries</h3>
                <span className="pending-count">
                  Total: {pendingStudents.length}
                </span>
              </div>

              <input
                type="text"
                placeholder="Search by Name or Mobile..."
                className="pending-search"
                onChange={(e) => setPendingSearch(e.target.value)}
              />

              <div className="pending-grid">
                {filteredPendingStudents.length > 0 ? (
                  filteredPendingStudents.map((student, index) => (
                    <div className="pending-card" key={student._id}>
                      <div className="pending-top">
                        <span>#{index + 1}</span>
                        <span className="pending-status">Pending</span>
                      </div>

                      <h4>{student.namee}</h4>
                      <p>📱 {student.mobile}</p>
                      <p>🎓 {student.cource}</p>

                      <h4>Update Status:</h4>
                      {/* 🔥 STATUS DROPDOWN */}
                      {statusLoadingId === student._id ? (
                        <div className="status-loader-wrap">
                          <span className="loader-spin"></span>
                          <span style={{ marginLeft: "8px" }}>Updating...</span>
                        </div>
                      ) : (
                        <select
                          className="status-dropdown"
                          value={student.statuss}
                          onChange={(e) =>
                            handleStatusUpdate(student._id, e.target.value)
                          }
                        >
                          <option>Pending</option>
                          <option>NotInterested</option>
                          <option>Registered</option>
                        </select>
                      )}

                      <div className="pending-actions">
                        <Link to={`/enqdetail?id=${student._id}`}>
                          <button className="update-btn">Update Enquiry</button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: "center" }}>No results found</p>
                )}
              </div>
            </div>
          )}
        </div>

        

        <div className="table-wrapper">
          <div className="table-header-bar">
            <h3>📊 Enquiry Management</h3>
            <span className="table-count">{filterProduct.length} Records</span>
            
          </div>
          <div
          className="filter-section"
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            right: 0,
            width: "70%",
          }}
        >
          {seepending === "none" ? (
            <button style={{ background: "orange" }} onClick={seependingggg}>
              Pending Enquiries
            </button>
          ) : (
            <button onClick={closepending}>Close Enquiries</button>
          )}

          <select onChange={filterByCourse}>
            <option disabled selected>
              Filter by cource
            </option>
            <option>Web Development</option>
            <option>Web Design</option>
            <option>Digital marketing</option>
            <option>App Development</option>
            <option>Graphic Design</option>
            <option>Video Editing</option>
            <option>Data Science</option>
          </select>

          <select onChange={filterByStatus}>
            <option value="">Filter by Status</option>
            <option>Pending</option>
            <option>NotInterested</option>
            <option>Registered</option>
          </select>

          <button onClick={Show}>+ Add New Enquiry</button>

          <input
            type="text"
            placeholder="Search by Name..."
            onChange={Searchbyname}
          />

          <button onClick={resetFilters}>Reset Filters</button>
        </div>

          <div className="table-scroll">
            <table className="pro-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Contact</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((item, index) => (
                    <tr key={item._id}>
                      <td className="index">
                        {index + 1 + (currentPage - 1) * recordsPerPage}
                      </td>

                      <td>
                        <div className="user-info">
                          <div className="avatar">
                            {item.namee?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="name">{item.namee}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div
                          className="contact"
                          style={{ fontWeight: "bold", fontSize: "16px" }}
                        >
                          📱 {item.mobile}
                        </div>
                      </td>

                      <td>
                        <span className="course-badge">{item.cource}</span>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            item.statuss === "Registered"
                              ? "green"
                              : item.statuss === "Pending"
                                ? "orange"
                                : "red"
                          }`}
                        >
                          {item.statuss}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <Link to={`/enqdetail?id=${item._id}`}>
                            <button className="view-btn">View</button>
                          </Link>

                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(item._id)}
                            disabled={deleteLoadingId === item._id}
                          >
                            {deleteLoadingId === item._id ? (
                              <span className="loader-spin"></span>
                            ) : (
                              "Delete"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No data found 😔
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {filterProduct.length > 5 && (
          <div className="pagination">
            <button onClick={prevPage}>Prev</button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={nextPage}>Next</button>
          </div>
        )}

        <ExportExcel tableData={allproducts} fileName="StudentData" />
      </div>
    </>
  );
}

export { ApiFetching };
