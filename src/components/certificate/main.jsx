import React, { useEffect, useMemo, useRef, useState } from "react";

import { SidebarHeader } from "../sidebarheader";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import certificateimage from "../../assets/cerficateimage.jpeg";
import signature from "../../assets/signature.jpeg"

export default function CertificateAdmin() {
  const token = localStorage.getItem("token");

  const certificateRef = useRef();

  const [certificates, setCertificates] = useState([]);

  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState("");

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [showCertificate, setShowCertificate] = useState(false);

  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const [btnLoading, setBtnLoading] = useState({
    add: false,
    update: false,
    deleteId: "",
    viewId: "",
  });

  const [form, setForm] = useState({
    studentName: "",
    fatherName: "",
    rollNo: "",
    certificateId: "",
    courseName: "",
    startDate: "",
    endDate: "",
    verifiedDate: "",
    status: "Active",
  });

  /*
  ========================================
  AUTO GENERATE CERTIFICATE ID
  ========================================
  */

 const generateCertificateId = () => {

  const year = new Date().getFullYear();

  let nextNumber = 1;

  if (certificates.length > 0) {

    const numbers = certificates.map((item) => {

      const parts =
        item.certificateId?.split("/");

      return parseInt(parts[3]) || 0;

    });

    nextNumber =
      Math.max(...numbers) + 1;

  }

  const serial =
    String(nextNumber).padStart(4, "0");

  const randomNumber =
    Math.floor(1000 + Math.random() * 9000);

  const randomLetter =
    String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    );

  return `JDB/${year}/${randomNumber}${randomLetter}/${serial}`;

};

  /*
  ========================================
  HANDLE CHANGE
  ========================================
  */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /*
  ========================================
  GET ALL CERTIFICATES
  ========================================
  */

  const getCertificates = async () => {
    try {
      const response = await fetch(
        "https://dgrnode.vercel.app/certificate/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      setCertificates(data.certificates || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCertificates();
  }, []);

  /*
  ========================================
  AUTO SET CERTIFICATE ID
  ========================================
  */

  useEffect(() => {
    if (!editingId) {
      setForm((prev) => ({
        ...prev,
        certificateId: generateCertificateId(),
      }));
    }
  }, [certificates, editingId]);

  /*
  ========================================
  ADD CERTIFICATE
  ========================================
  */

  const addCertificate = async (e) => {
    e.preventDefault();

    setLoading(true);

    setBtnLoading((prev) => ({
      ...prev,
      add: true,
    }));

    const alreadyExist = certificates.find(
      (item) => item.certificateId === form.certificateId,
    );

    if (alreadyExist) {
      alert("Certificate ID already exists");

      setLoading(false);

      setBtnLoading((prev) => ({
        ...prev,
        add: false,
      }));

      return;
    }

    try {
      const response = await fetch(
        "https://dgrnode.vercel.app/certificate/add",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(form),
        },
      );

      const data = await response.json();

      alert(data.message);

      if (data.success) {
        setForm({
          studentName: "",
          fatherName: "",
          rollNo: "",
          certificateId: generateCertificateId(),
          courseName: "",
          startDate: "",
          endDate: "",
          verifiedDate: "",
          status: "Active",
        });

        setShowForm(false);

        getCertificates();
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);

    setBtnLoading((prev) => ({
      ...prev,
      add: false,
    }));
  };

  /*
  ========================================
  DELETE CERTIFICATE
  ========================================
  */

  const deleteCertificate = async (id) => {
    const confirmDelete = window.confirm("Delete Certificate?");

    if (!confirmDelete) return;

    setBtnLoading((prev) => ({
      ...prev,
      deleteId: id,
    }));

    try {
      const response = await fetch(
        `https://dgrnode.vercel.app/certificate/delete/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      alert(data.message);

      getCertificates();
    } catch (error) {
      console.log(error);
    }

    setBtnLoading((prev) => ({
      ...prev,
      deleteId: "",
    }));
  };

  /*
  ========================================
  EDIT CERTIFICATE
  ========================================
  */

  const editCertificate = (item) => {
    setShowForm(true);

    setEditingId(item._id);

    setForm({
      studentName: item.studentName,
      fatherName: item.fatherName || "",
      rollNo: item.rollNo || "",
      certificateId: item.certificateId,
      courseName: item.courseName,
      startDate: item.startDate,
      endDate: item.endDate,
      verifiedDate: item.verifiedDate,
      status: item.status || "Active",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  ========================================
  UPDATE CERTIFICATE
  ========================================
  */

  const updateCertificate = async (e) => {
    e.preventDefault();

    setLoading(true);

    setBtnLoading((prev) => ({
      ...prev,
      update: true,
    }));

    try {
      const response = await fetch(
        `https://dgrnode.vercel.app/certificate/update/${editingId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(form),
        },
      );

      const data = await response.json();

      alert(data.message);

      setEditingId("");

      setShowForm(false);

      getCertificates();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);

    setBtnLoading((prev) => ({
      ...prev,
      update: false,
    }));
  };

  /*
  ========================================
  DOWNLOAD CERTIFICATE
  ========================================
  */

  const downloadCertificate = async () => {
    const canvas = await html2canvas(certificateRef.current, {
      useCORS: true,
      allowTaint: true,
      imageTimeout: 500,
      scale: 3,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "px", [1400, 1000]);

    pdf.addImage(imgData, "PNG", 0, 0, 1400, 1000);

    pdf.save(`${selectedCertificate.studentName}.pdf`);
  };

  /*
  ========================================
  SEARCH FILTER
  ========================================
  */

  const filteredCertificates = useMemo(() => {
    return certificates.filter((item) =>
      item.studentName?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [certificates, search]);


  const calculateDuration = (startDate, endDate) => {

  if (!startDate || !endDate) return "";

  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = end - start;

  const totalDays = Math.floor(
    diffTime / (1000 * 60 * 60 * 24)
  );

  const months = Math.floor(totalDays / 30);

  const days = totalDays % 30;

  return `${months} Month ${days} Days`;

};

  return (
    <>
      <SidebarHeader />

      <div className="certificate-admin">
        {/* TOP */}

        <div className="top-box">
          <h2>Certificate Management</h2>
        </div>

        {/* NEW CERTIFICATE BUTTON */}

        <div className="top-actions">
          <button
            className="new-certificate-btn"
            onClick={() => {
              setShowForm(!showForm);

              if (editingId) {
                setEditingId("");

                setForm({
                  studentName: "",
                  fatherName: "",
                  rollNo: "",
                  certificateId: generateCertificateId(),
                  courseName: "",
                  startDate: "",
                  endDate: "",
                  verifiedDate: "",
                  status: "Active",
                });
              }
            }}
          >
            {showForm ? "Close Form" : "New Certificate"}
          </button>
        </div>

        {/* FORM */}

        {showForm && (
          <form
            className="certificate-form"
            onSubmit={editingId ? updateCertificate : addCertificate}
          >
            <div className="input-group">
              <label>Student Name</label>

              <input
                type="text"
                name="studentName"
                placeholder="Student Name"
                value={form.studentName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Father Name</label>

              <input
                type="text"
                name="fatherName"
                placeholder="Father Name"
                value={form.fatherName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Certificate ID</label>

              <input
                type="text"
                name="certificateId"
                value={form.certificateId}
                readOnly
              />
            </div>

            <div className="input-group">
              <label>Roll No</label>

              <input
                type="text"
                name="rollNo"
                placeholder="Roll Number"
                value={form.rollNo}
                onChange={handleChange}
                required
              />
            </div>


<div className="input-group">
  <label>Course Name:</label>
 <select
  name="courseName"
  value={form.courseName}
  onChange={handleChange}
  required
>
  <option value="">Select Course</option>

  <option value="Digital Marketing">
    Digital Marketing
  </option>

  <option value="MERN Stack Development">
    MERN Stack Development
  </option>

  <option value="Web Design">
    Web Design
  </option>

  <option value="Web Development">
    Web Development
  </option>

  <option value="Full Stack Development">
    Full Stack Development
  </option>

  <option value="Data Science">
    Data Science
  </option>

  <option value="Data Analytics">
    Data Analytics
  </option>

  <option value="Web Development Internship">
    Web Development Internship
  </option>

  <option value="Digital Marketing Internship">
    Digital Marketing Internship
  </option>

  <option value="JavaScript">
    JavaScript
  </option>
</select>
</div>
           

            <div className="input-group">
              <label>Start Date</label>

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>End Date</label>

              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Verified Date</label>

              <input
                type="date"
                name="verifiedDate"
                value={form.verifiedDate}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Status</label>

              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <button type="submit" className="submit-btn">
              {btnLoading.add || btnLoading.update ? (
                <span className="btn-loader"></span>
              ) : editingId ? (
                "Update Certificate"
              ) : (
                "Add Certificate"
              )}
            </button>
          </form>
        )}

        {/* SEARCH */}

        <div className="search-box">
          <input
            type="text"
            placeholder="Search Student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Father Name</th>
                <th>Roll No</th>
                <th>Certificate ID</th>
                <th>Course</th>
                <th>Status</th>
                <th>Verified Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCertificates.map((item) => (
                <tr key={item._id}>
                  <td>{item.studentName}</td>
                  <td>{item.fatherName}</td>
                  <td>{item.rollNo}</td>
                  <td>{item.certificateId}</td>
                  <td>{item.courseName}</td>
                  <td>{item.status}</td>
                  <td>{item.verifiedDate}</td>

                  <td>
                    <div className="actions">
                      <button
                        type="button"
                        className="view-btn"
                        onClick={() => {
                          setBtnLoading((prev) => ({
                            ...prev,
                            viewId: item._id,
                          }));

                          setTimeout(() => {
                            setSelectedCertificate(item);

                            setShowCertificate(true);

                            setBtnLoading((prev) => ({
                              ...prev,
                              viewId: "",
                            }));
                          }, 300);
                        }}
                      >
                        {btnLoading.viewId === item._id ? (
                          <span className="mini-loader"></span>
                        ) : (
                          "View"
                        )}
                      </button>

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => editCertificate(item)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => deleteCertificate(item._id)}
                      >
                        {btnLoading.deleteId === item._id ? (
                          <span className="mini-loader"></span>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CERTIFICATE MODAL */}

      {showCertificate && selectedCertificate && (
        <div className="certificate-modal">
          <div className="certificate-popup">
            <button className="download-btn" onClick={downloadCertificate}>
              Download Certificate
            </button>

            <button
              className="close-btn"
              onClick={() => setShowCertificate(false)}
              style={{ color: "white" }}
            >
              ×
            </button>

            <div
              className="certificate-preview"
              ref={certificateRef}
              style={{ borderRadius: "10px" }}
            >
              <img
                style={{ borderRadius: "10px" }}
                src={certificateimage}
                alt=""
                className="certificate-bg"
              />

              <div className="certificate-id">
                {selectedCertificate.certificateId}
              </div>

              <img
                className="qr-code"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://jdbinfotech.co.in/verify-certificate`}
                alt=""
              />

              <div className="student-name">
                {selectedCertificate.studentName}
              </div>

              <div className="father-name">
                  Father's Name: {selectedCertificate.fatherName}
              </div>

              <div className="course-name">
                <b>{selectedCertificate.courseName}</b>
              </div>

              <div className="course-time">

  {calculateDuration(
    selectedCertificate.startDate,
    selectedCertificate.endDate
  )}

</div>

              <div className="roll-no">

  Roll No :
  {selectedCertificate.rollNo}

</div>

              <div className="course-duration">
                <b>{selectedCertificate.startDate}</b>

                <span className="bbb">{selectedCertificate.endDate}</span>
              </div>

              <img
  src={signature}
  alt="signature"
  className="certificate-signature"
/>

              <div className="verified-date">
                {selectedCertificate.verifiedDate}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS */}

      <style>
        {`

        .certificate-admin{
          width:80%;
          margin:20px auto;
        }

        .top-box{
          margin-bottom:20px;
        }

        .top-box h2{
          font-size:32px;
          font-weight:700;
          color:#111827;
        }

        .top-actions{
          margin-bottom:25px;
        }

        .new-certificate-btn{
          background:linear-gradient(
            135deg,
            #2563eb,
            #1d4ed8
          );

          color:#fff;

          border:none;

          padding:14px 24px;

          border-radius:10px;

          font-size:15px;

          font-weight:600;

          cursor:pointer;
        }

        .certificate-form{
          background:#fff;
          padding:25px;
          border-radius:18px;
          display:grid;
          grid-template-columns:
          repeat(auto-fit,minmax(280px,1fr));
          gap:20px;
          margin-bottom:30px;
          box-shadow:
          0 10px 30px rgba(0,0,0,0.08);
        }

        .input-group{
          display:flex;
          flex-direction:column;
        }

        .input-group label{
          margin-bottom:8px;
          font-size:14px;
          font-weight:600;
          color:#374151;
        }

        .input-group input{
          padding:14px;
          border:1px solid #d1d5db;
          border-radius:10px;
          outline:none;
          font-size:15px;
        }

        .submit-btn{
          background:linear-gradient(
            135deg,
            #16a34a,
            #15803d
          ) !important;

          height:52px;

          color:#fff;

          border:none;

          border-radius:10px;

          cursor:pointer;

          font-size:16px;

          font-weight:600;

          display:flex;

          align-items:center;

          justify-content:center;
        }

        .search-box{
          margin-bottom:20px;
        }

        .search-box input{
          width:100%;
          padding:14px;
          border-radius:10px;
          border:1px solid #ddd;
        }

        .table-container{
          background:#fff;
          border-radius:18px;
          overflow:auto;
          box-shadow:
          0 10px 30px rgba(0,0,0,0.08);
        }

        table{
          width:100%;
          border-collapse:collapse;
        }

        table th{
          background:#111827;
          color:#fff;
          padding:16px;
        }

        table td{
          padding:16px;
          border-bottom:1px solid #eee;
        }

        .actions{
          display:flex;
          gap:12px;
        }

        .actions button{
          min-width:90px;
          height:42px;

          display:flex;
          justify-content:center;
          align-items:center;

          border:none;
          border-radius:8px;
          cursor:pointer;
          color:#fff;
          font-weight:600;
        }

        .view-btn{
          background:#16a34a;
        }

        .edit-btn{
          background:#f59e0b;
        }

        .delete-btn{
          background:#ef4444;
        }

        .btn-loader{
          width:22px;
          height:22px;
          border:3px solid #fff;
          border-top-color:transparent;
          border-radius:50%;
          animation:spin 0.8s linear infinite;
        }

        .mini-loader{
          width:16px;
          height:16px;
          border:2px solid #fff;
          border-top-color:transparent;
          border-radius:50%;
          display:inline-block;
          animation:spin 0.8s linear infinite;
        }

        @keyframes spin{
          to{
            transform:rotate(360deg);
          }
        }

        .certificate-modal{
          position:fixed;
          top:0;
          left:0;
          width:100%;
          height:100%;
          background:rgba(0,0,0,0.8);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:9999;
          padding:20px;
        }

        .certificate-popup{
          background:black;
          width:100%;
          max-width:1100px;
          border-radius:16px;
          padding:20px;
          position:relative;
          overflow:auto;
          max-height:95vh;
        }

        .close-btn{
          position:absolute;
          top:10px;
          right:20px;
          border:none;
          background:none;
          font-size:40px;
          cursor:pointer;
        }

        .certificate-preview{
          position:relative;
          width:100%;
          max-width:1000px;
          margin:auto;
        }

        .certificate-bg{
          width:100%;
          display:block;
        }

        .certificate-id{
          position:absolute;
          top:10%;
          right:8%;
          font-size:18px;
          font-weight:700;
        }

        .qr-code{
          position:absolute;
          top:14%;
          right:7%;
          width:85px;
          height:85px;
        }

        .student-name{
          position:absolute;
          top:48%;
          left:50%;
          transform:translateX(-50%);
          width:80%;
          text-align:center;
          font-size:41px;
          font-weight:600;
          color:#353f56;
        }

        .course-name{
          position:absolute;
          top:64%;
          left:38%;
          transform:translateX(-50%);
          width:75%;
          text-align:center;
          font-size:19px;
          line-height:1.6;
          color:#3a4868;
        }

        .course-duration{
          position:absolute;
          top:65%;
          left:74%;
          transform:translateX(-50%);
          width:75%;
          text-align:center;
          font-size:16px;
          color:#111827;
        }

        .bbb{
          margin-left:40px;
        }

        .verified-date{
          position:absolute;
          bottom:18%;
          right:22%;
          font-size:18px;
          font-weight:600;
        }

        .download-btn{
          margin-top:20px;
          background:#2563eb;
          color:#fff;
          border:none;
          padding:14px 22px;
          border-radius:10px;
          cursor:pointer;
          font-size:16px;
          font-weight:600;
        }

        @media(max-width:768px){

          .certificate-admin{
            width:95%;
          }

          .certificate-form{
            grid-template-columns:1fr;
          }

          .actions{
            flex-wrap:wrap;
          }

          .student-name{
            font-size:24px;
          }

          .course-name{
            font-size:10px;
          }

          .course-duration{
            font-size:10px;
          }

        }
          
        .input-group select{
  padding:14px;
  border:1px solid #d1d5db;
  border-radius:10px;
  outline:none;
  font-size:15px;
}

.father-name{
  position:absolute;
  top:55%;
  left:50%;
  transform:translateX(-50%);
  width:80%;
  text-align:center;
  font-size:20px;
  color:#4b5563;
  font-weight: bold;
}

.roll-no{
  position:absolute;
  top:6%;
  left:75%;
  font-size:18px;
  font-weight:600;
}

.course-time{
  position:absolute;
  top:61%;
  left:73%;
  transform:translateX(-50%);
  font-size:14px;
  font-weight:600;
  color:#2c3e50;
}

.certificate-signature{
  position:absolute;
  bottom:21%;
  left:9%;
  width:161px;
}


        `}
      </style>
    </>
  );
}
