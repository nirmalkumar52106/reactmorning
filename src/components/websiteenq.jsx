import React, { useEffect, useState, useMemo } from "react";
import { SidebarHeader } from "./sidebarheader";
import { toast, Toaster } from "react-hot-toast";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

function WebEnquiryTable() {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("enqDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const enquiriesPerPage = 10;
  const API_URL = "https://dgrnode.vercel.app/allwebaddenq";

  useEffect(() => {
    fetchEnquiries(); 
  }, []);

   const tokennn = localStorage.getItem("token");

  const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type",
      "Authorization": `Bearer ${tokennn}`
    };

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL , {
        headers,
      });
      const data = await response.json();
      setEnquiries(data);
      setFilteredEnquiries(data);
      countUnread(data);
    } catch (error) {
      toast.error("Error fetching enquiries");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...enquiries];

    if (searchQuery) {
      results = results.filter((item) =>
        item.enqname.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      results = results.filter((item) => {
        const date = new Date(item.enqDate);
        return date >= from && date <= to;
      });
    }

    // Sorting
    results.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (sortKey === "enqDate") {
        return sortOrder === "asc"
          ? new Date(valA) - new Date(valB)
          : new Date(valB) - new Date(valA);
      }
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    setFilteredEnquiries(results);
    setCurrentPage(1);
    countUnread(results);
  };

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [enquiries, searchQuery, fromDate, toDate, sortKey, sortOrder]);

  const countUnread = (list) => {
    const unread = list.filter((item) => !item.isRead).length;
    setUnreadCount(unread);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" ,headers });
      if (res.ok) {
        toast.success("Deleted successfully");
        setEnquiries(enquiries.filter((item) => item._id !== id));
      } else {
        toast.error("Failed to delete enquiry");
      }
    } catch (err) {
      toast.error("Error deleting enquiry");
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm("Delete selected enquiries?")) return;
    for (const id of selectedIds) {
      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      } catch (err) {
        toast.error(`Failed to delete ID: ${id}`);
      }
    }
    toast.success("Selected enquiries deleted");
    setEnquiries(enquiries.filter((item) => !selectedIds.includes(item._id)));
    setSelectedIds([]);
    setSelectAll(false);
  };

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`https://dgrnode.vercel.app/markenquiryread/${id}`, {
        method: "PUT",
        headers,
      });
      if (res.ok) {
        toast.success("Marked as read");
        fetchEnquiries();
      }
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleExportCSV = () => {
    const csv = Papa.unparse(filteredEnquiries);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "enquiries.csv";
    link.click();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Mobile", "Email", "Course", "Date"];
    const tableRows = [];

    filteredEnquiries.forEach((enq) => {
      const enqData = [
        enq.enqname,
        enq.enqmobile,
        enq.enqemail,
        enq.enqCourse,
        new Date(enq.enqDate).toLocaleDateString(),
      ];
      tableRows.push(enqData);
    });

    doc.text("Enquiry List", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("enquiries.pdf");
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      const allVisibleIds = currentEnquiries.map((item) => item._id);
      setSelectedIds(allVisibleIds);
    }
    setSelectAll(!selectAll);
  };

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const indexOfLast = currentPage * enquiriesPerPage;
  const indexOfFirst = indexOfLast - enquiriesPerPage;
  const currentEnquiries = useMemo(
    () => filteredEnquiries.slice(indexOfFirst, indexOfLast),
    [filteredEnquiries, indexOfFirst, indexOfLast]
  );

  const totalPages = Math.ceil(filteredEnquiries.length / enquiriesPerPage);

  // WhatsApp reply handler
  const handleWhatsAppReply = (mobile) => {
    const phone = mobile.replace(/[^0-9]/g, ""); // sanitize phone
    const url = `https://wa.me/${phone}`;
    window.open(url, "_blank");
  };


  const goto = useNavigate()
  
  useEffect(()=>{
const token = localStorage.getItem("token")
    if(!token){
      window.location.replace("/")
    }
  },[goto])

  return (
    <>
      <SidebarHeader />
      <div className="enquiry-table-container">
        <h2>Enquiry List</h2>
        <Toaster />

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div style={{ marginBottom: 10 }}>
              <span
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  userSelect: "none",
                }}
              >
                🔔 {unreadCount} unread
              </span>
            </div>

            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />

            <div className="date-filter" style={{ marginTop: "10px", marginBottom: "10px" }}>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <button onClick={applyFilters} style={{ marginLeft: "5px" }}>
                Filter by Date
              </button>
              <button
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setSearchQuery("");
                }}
                style={{ marginLeft: "5px" }}
              >
                Reset
              </button>
              <button onClick={handleExportCSV} style={{ marginLeft: "5px" }}>
                Export CSV
              </button>
              <button onClick={handleExportPDF} style={{ marginLeft: "5px" }}>
                Export PDF
              </button>
            </div>

            {selectedIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="delete-selected-btn"
                style={{ marginBottom: "10px" }}
              >
                Delete Selected ({selectedIds.length})
              </button>
            )}

            <table className="enquiry-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th
                    onClick={() => toggleSort("enqname")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Name {sortKey === "enqname" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th
                    onClick={() => toggleSort("enqDate")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Date {sortKey === "enqDate" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No enquiries found
                    </td>
                  </tr>
                ) : (
                  currentEnquiries.map((item) => (
                    <tr
                      key={item._id}
                      style={{
                        backgroundColor: item.isRead ? "white" : "#eef",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item._id)}
                          onChange={() => handleCheckboxChange(item._id)}
                        />
                      </td>
                      <td>{item.enqname}</td>
                      <td>{item.enqmobile}</td>
                      <td>{item.enqemail}</td>
                      <td>{item.enqCourse}</td>
                      <td>{new Date(item.enqDate).toLocaleDateString()}</td>
                      <td>
                        {!item.isRead && (
                          <button
                            onClick={() => markAsRead(item._id)}
                            style={{
                              marginRight: 6,
                              backgroundColor: "green",
                              color: "white",
                              border: "none",
                              padding: "4px 6px",
                              cursor: "pointer",
                              borderRadius: "3px",
                            }}
                          >
                            Mark as Read
                          </button>
                        )}
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(item._id)}
                          style={{
                            marginRight: 6,
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            padding: "4px 6px",
                            cursor: "pointer",
                            borderRadius: "3px",
                          }}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleWhatsAppReply(item.enqmobile)}
                          style={{
                            backgroundColor: "#25d366",
                            color: "white",
                            border: "none",
                            padding: "4px 6px",
                            cursor: "pointer",
                            borderRadius: "3px",
                          }}
                        >
                          WhatsApp
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div
              className="pagination"
              style={{
                marginTop: "15px",
                display: "flex",
                justifyContent: "center",
                gap: "5px",
                userSelect: "none",
              }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                style={{ padding: "5px 10px", cursor: "pointer" }}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      fontWeight: currentPage === pageNum ? "bold" : "normal",
                      padding: "5px 10px",
                      cursor: "pointer",
                      backgroundColor: currentPage === pageNum ? "#007bff" : "white",
                      color: currentPage === pageNum ? "white" : "black",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{ padding: "5px 10px", cursor: "pointer" }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      <style >{`
       
        .search-input {
          padding: 6px 10px;
          width: 250px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-right: 10px;
        }
        .delete-selected-btn {
          background-color: #d9534f;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
        }
        .delete-selected-btn:hover {
          background-color: #c9302c;
        }
        .delete-btn:hover {
          opacity: 0.8;
        }
        .date-filter input[type="date"] {
          margin-right: 5px;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        .date-filter button {
          padding: 5px 10px;
          border-radius: 4px;
          border: 1px solid #007bff;
          background-color: white;
          color: #007bff;
          cursor: pointer;
          font-weight: 600;
        }
        .date-filter button:hover {
          background-color: #007bff;
          color: white;
        }
      `}</style>
    </>
  );
}

export default WebEnquiryTable;
