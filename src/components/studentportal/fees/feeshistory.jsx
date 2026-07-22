// import React, { useEffect, useState, useRef } from 'react';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import logo from "../../../assets/jdblogo.png"

// const FeesHistoryTable = () => {
//   const [students, setStudents] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const receiptRef = useRef();

//    const tokennn = localStorage.getItem("token");
//    const headers = {
//       "Content-Type": "application/json",
//       "Access-Control-Allow-Headers": "Content-Type",
//       "Authorization": `Bearer ${tokennn}`
//     };

//   // Fetch all students on load
//   useEffect(() => {
//     const fetchStudents = async () => {
//       const res = await fetch('https://dgrnode.vercel.app/allstudents' , {headers});
//       const data = await res.json();
//       if (data.success) setStudents(data.students);
//     };
//     fetchStudents();
//   }, []);

//   // Fetch selected student's payment history
//   const handleRowClick = async (studentId) => {
//     const res = await fetch(`https://dgrnode.vercel.app/get-student?studentId=${studentId}` , {
//       headers
//     });
//     const data = await res.json();
//     if (data.success) setSelectedStudent(data.student);
//   };

//   // PDF generation function
//   const generatePDF = () => {
//     const input = receiptRef.current;
//     if (!input) return;

//     html2canvas(input, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//       pdf.save(`${selectedStudent.studentId}_fees_receipt.pdf`);
//     });
//   };

//   return (
//     <div className='fees-history'>
//       <h3>All Students Fees Summary</h3>

//       {/* Selected student's history shown ABOVE table */}
//       {selectedStudent && (
//         <div className='selected-student-details'>
//           <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <h3>
//               Payment History: {selectedStudent.name} ({selectedStudent.studentId})
//             </h3>
//             <div>
//               <button onClick={generatePDF} style={{ marginRight: '10px' }}>Download PDF Receipt</button>
//               <button onClick={() => setSelectedStudent(null)}>Close ✖</button>
//             </div>
//           </div>

//           <div ref={receiptRef} style={{ padding: '20px', backgroundColor: 'white', color: 'black', fontFamily: 'Arial, sans-serif' }}>
//             {/* Receipt Header */}

//             <h1 style={{ marginBottom : "10px" , textAlign : "center" , borderBottom : "2px solid grey" , paddingBottom : "8px" }}>Fees Receipt</h1>
//             <div style={{ display: 'flex', justifyContent  :"space-between", alignItems: 'center', marginBottom: '15px' }}>
//               <img
//                 src={`${logo}`}
//                 alt="Jdb_Infotech Logo"
//                 style={{ height: "100px",marginRight: "15px", width: "50%" }}
//               />

//               <div>
//                    <h2 style={{marginBottom : "10px"}}>Jdb Infotech</h2>
//                    <h4 style={{margin :"0px"}}>Contact Info : +917073734854</h4>
//                 <div style={{marginTop  :"6px"}}>305, 3rd Floor, Pink City2, Joshi Marg, Jhotwara, Jaipur, Rajasthan 302012</div>
//               </div>
//             </div>

//             <hr />

//             {/* Student Info */}
//             <div style={{ marginBottom: '10px' }}>
//               <strong>Student Name:</strong> {selectedStudent.name} <br />
//               <strong>Student ID:</strong> {selectedStudent.studentId} <br />
//               <strong>Date:</strong> {new Date().toLocaleString()}
//             </div>

//             {/* Payment History Table */}
//             <table border="1" width="100%" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
//               <thead style={{ backgroundColor: '#eee' }}>
//                 <tr>
//                   <th>Amount</th>
//                   <th>Date</th>
//                   <th>Mode</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedStudent.fees?.paymentHistory?.map((p, index) => (
//                   <tr key={index}>
//                     <td>₹{p.amount}</td>
//                     <td>{new Date(p.date).toLocaleDateString()}</td>
//                     <td>{p.mode}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Summary */}
//             <div style={{ marginTop: '15px', fontWeight: 'bold' }}>
//               Total Fees: ₹{selectedStudent.fees?.total || 0} <br />
//               Paid: ₹{selectedStudent.fees?.paid || 0} <br />
//               Due: ₹{(selectedStudent.fees?.total || 0) - (selectedStudent.fees?.paid || 0)}
//             </div>

//             {/* Thank You Message */}
//             <div style={{ marginTop: '30px',  fontSize: '16px' ,width : "45%" , lineHeight  : "23px" }}>
//               Thank you for your payment!
// We appreciate your trust in Jdb Infotech.
// For more courses, updates, and support,
// visit our website:
// <span> <a href='https://jdbinfotech.co.in/'> www.jdbinfotech.com </a></span>

// Empowering your learning journey with excellence.
//             </div>

//             {/* Stamp Style */}
//             <div style={{display : "flex" , marginTop : "10px" ,  justifyContent : "end" , alignItems : "center"}}>
//               <div
//       style={{
//         width: 120,
//         height: 120,
//         border: '5px solid #c62828',
//         borderRadius: '50%',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         color: '#c62828',
//         fontWeight: 'bold',
//         fontSize: 14,
//         fontFamily: "'Arial Black', Gadget, sans-serif",
//         transform: 'rotate(-10deg)',
//         opacity: 0.3,
//         position: 'absolute',
//         right  :"33px",
//         margin: '20px auto',
//       }}
//     >
//       <img
//         src= {`${logo}`}
//         alt="Jdb Infotech Logo"
//         style={{ width: 127, height: 100, marginBottom: 5 }}
//       />
//       <div>Jdb Infotech</div>
//       <div>Official Stamp</div>
//     </div>
//             <div style={{ marginTop: '50px', }}>
//   <div style={{ fontFamily: "'Pacifico', cursive", fontSize: '20px', color: 'blue'}}>Pankaj Verma</div>
//   <div style={{ fontSize: '12px', fontWeight: 'bold' }}>CEO of Jdb Infotech</div>
// </div>
//               </div>

//           </div>
//         </div>
//       )}

//       {/* Main Table Below */}
//       <table border="1" width="100%" cellPadding={5} style={{ marginBottom: '20px' }}>
//         <thead>
//           <tr>
//             <th>Student ID</th>
//             <th>Name</th>
//             <th>Total Fees</th>
//             <th>Paid</th>
//             <th>Due</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((stu) => {
//             const total = stu.fees?.total || 0;
//             const paid = stu.fees?.paid || 0;
//             const due = total - paid;
//             return (
//               <tr key={stu._id} onClick={() => handleRowClick(stu.studentId)} style={{ cursor: 'pointer' }}>
//                 <td>{stu.studentId}</td>
//                 <td>{stu.name}</td>
//                 <td>₹{total}</td>
//                 <td>₹{paid}</td>
//                 <td>₹{due}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default FeesHistoryTable;

import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../../assets/jdblogo.png";

const FeesHistoryTable = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const receiptRef = useRef();

  const tokennn = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    Authorization: `Bearer ${tokennn}`,
  };

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch("https://dgrnode.vercel.app/allstudents", {
        headers,
      });
      const data = await res.json();
      if (data.success) setStudents(data.students);
    };

    fetchStudents();
  }, []);

  // Click row
  const handleRowClick = async (studentId) => {
    const res = await fetch(
      `https://dgrnode.vercel.app/get-student?studentId=${studentId}`,
      { headers },
    );

    const data = await res.json();
    if (data.success) setSelectedStudent(data.student);
  };

  // PDF Download
  const generatePDF = () => {
    const input = receiptRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${selectedStudent.studentId}_fees_receipt.pdf`);
    });
  };

  // Search Filter
  const filteredStudents = students.filter((stu) =>
    `${stu.name} ${stu.studentId}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="fees-history" style={{ padding: "20px" }}>
      <h3 style={{ marginBottom: "15px" }}>All Students Fees Summary</h3>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search by Name or Student ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "20px",
          outline: "none",
          fontSize: "15px",
        }}
      />

      {/* Receipt Center Modal */}
      {selectedStudent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "900px",
              maxWidth: "100%",
              maxHeight: "95vh",
              overflowY: "auto",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "15px 20px",
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 5,
              }}
            >
              <h3 style={{ margin: 0 }}>
                Payment History: {selectedStudent.name} (
                {selectedStudent.studentId})
              </h3>

              <div>
                <button
                  onClick={generatePDF}
                  style={{
                    background: "#0d6efd",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                >
                  Download PDF
                </button>

                <button
                  onClick={() => setSelectedStudent(null)}
                  style={{
                    background: "#dc3545",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Close ✖
                </button>
              </div>
            </div>

            {/* Receipt */}
            <div
              ref={receiptRef}
              style={{
                padding: "20px",
                backgroundColor: "white",
                color: "black",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <h1
                style={{
                  marginBottom: "10px",
                  textAlign: "center",
                  borderBottom: "2px solid grey",
                  paddingBottom: "8px",
                }}
              >
                Fees Receipt
              </h1>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <img
                  src={logo}
                  alt="logo"
                  style={{ height: "100px", width: "45%" }}
                />

                <div>
                  <h2 style={{ marginBottom: "10px" }}>Jdb Infotech</h2>
                  <h4 style={{ margin: "0px" }}>
                    Contact Info : +917073734854
                  </h4>
                  <div style={{ marginTop: "6px" }}>
                    305, 3rd Floor, Pink City2, Joshi Marg, Jhotwara, Jaipur,
                    Rajasthan 302012
                  </div>
                </div>
              </div>

              <hr />

              <div style={{ marginBottom: "10px" }}>
                <strong>Student Name:</strong> {selectedStudent.name} <br />
                <strong>Student ID:</strong> {selectedStudent.studentId} <br />
                <strong>Date:</strong> {new Date().toLocaleString()}
              </div>

              <table
                width="100%"
                cellPadding="8"
                style={{
                  borderCollapse: "collapse",
                  marginTop: "15px",
                }}
              >
                <thead style={{ background: "#f1f1f1" }}>
                  <tr>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Mode</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedStudent.fees?.paymentHistory?.map((p, index) => (
                    <tr key={index}>
                      <td style={tdStyle}>₹{p.amount}</td>
                      <td style={tdStyle}>
                        {new Date(p.date).toLocaleDateString()}
                      </td>
                      <td style={tdStyle}>{p.mode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: "15px", fontWeight: "bold" }}>
                Total Fees: ₹{selectedStudent.fees?.total || 0} <br />
                Paid: ₹{selectedStudent.fees?.paid || 0} <br />
                Due: ₹
                {(selectedStudent.fees?.total || 0) -
                  (selectedStudent.fees?.paid || 0)}
              </div>

              <div
                style={{
                  marginTop: "30px",
                  fontSize: "16px",
                  width: "45%",
                  lineHeight: "23px",
                }}
              >
                Thank you for your payment! We appreciate your trust in Jdb
                Infotech. For more courses, updates, and support, visit our
                website:
                <br />
                <a href="https://jdbinfotech.co.in/">www.jdbinfotech.com</a>
              </div>

              <div
                style={{
                  display: "flex",
                  marginTop: "10px",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    marginTop: "50px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Pacifico', cursive",
                      fontSize: "20px",
                      color: "blue",
                    }}
                  >
                    Pankaj Verma
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    CEO of Jdb Infotech
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: "10px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        }}
      >
        <table
          width="100%"
          cellPadding="12"
          style={{
            borderCollapse: "collapse",
            background: "#fff",
          }}
        >
          <thead
            style={{
              background: "#0d6efd",
              color: "#fff",
              position: "sticky",
              top: 0,
              zIndex: 1000,
            }}
          >
            <tr>
              <th
                style={{
                  ...mainTh,
                  position: "sticky",
                  top: 0,
                  background: "#0d6efd",
                }}
              >
                Student ID
              </th>
              <th
                style={{
                  ...mainTh,
                  position: "sticky",
                  top: 0,
                  background: "#0d6efd",
                }}
              >
                Name
              </th>
                 <th
                style={{
                  ...mainTh,
                  position: "sticky",
                  top: 0,
                  background: "#0d6efd",
                }}
              >
                Mobile No.
              </th>
              <th
                style={{
                  ...mainTh,
                  position: "sticky",
                  top: 0,
                  background: "#0d6efd",
                }}
              >
                Course
              </th>
               
              <th
                style={{
                  ...mainTh,
                  position: "sticky",
                  top: 0,
                  background: "#0d6efd",
                }}
              >
                Total Fees
              </th>
              <th
                style={{
                  ...mainTh,
                  position: "sticky",
                  top: 0,
                  background: "#0d6efd",
                }}
              >
                Paid
              </th>
              <th
                style={{
                  ...mainTh,
                  position: "sticky",
                  top: 0,
                  background: "#0d6efd",
                }}
              >
                Due
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((stu, index) => {
              const total = stu.fees?.total || 0;
              const paid = stu.fees?.paid || 0;
              const due = total - paid;

              return (
                <tr
                  key={stu._id}
                  onClick={() => handleRowClick(stu.studentId)}
                  style={{
                    cursor: "pointer",
                    background: index % 2 === 0 ? "#f8f9fa" : "#fff",
                    transition: "0.3s",
                  }}
                >
                  <td style={mainTd}>{stu.studentId}</td>
                  <td style={mainTd}>{stu.name}</td>
                  <td style={mainTd}>{stu.mobile}</td>
                  <td style={mainTd}>{stu.course?.name}</td>
                  <td style={mainTd}>
                    {total === 0 ? (
                      <span style={{ color: "red", fontWeight: "600" }}>
                        Please update fees
                      </span>
                    ) : (
                      `₹${total}`
                    )}
                  </td>
                  <td style={mainTd}>
                    {total === 0 ? (
                      <span style={{ color: "red", fontWeight: "600" }}>
                        Please update fees
                      </span>
                    ) : (
                      `₹${paid}`
                    )}
                  </td>
                  <td
                    style={{
                      ...mainTd,
                      color: due > 0 ? "red" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{due}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles
const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px",
};

const mainTh = {
  padding: "14px",
  textAlign: "left",
};

const mainTd = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};

export default FeesHistoryTable;
