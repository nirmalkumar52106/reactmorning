import React, { useEffect, useState } from "react";
import { SidebarHeader } from "./sidebarheader";

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

    const enquiriesPerPage = 10;
    const API_URL = "https://dgrnode.vercel.app/allwebaddenq";

    useEffect(() => {
        fetchEnquiries();
    }, []);

    useEffect(() => {
        handleSearch(searchQuery);
        countUnread(filteredEnquiries);
    }, [enquiries, searchQuery, filteredEnquiries]);

    const fetchEnquiries = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setEnquiries(data);
            setFilteredEnquiries(data);
            countUnread(data);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = enquiries.filter((item) =>
            item.enqname.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredEnquiries(filtered);
        setCurrentPage(1);
        countUnread(filtered);
    };

    const handleDateFilter = () => {
        if (!fromDate || !toDate) return;

        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);

        const filtered = enquiries.filter((item) => {
            const itemDate = new Date(item.enqDate);
            return itemDate >= from && itemDate <= to;
        });

        setFilteredEnquiries(filtered);
        setCurrentPage(1);
        countUnread(filtered);
    };

    const handleResetFilters = () => {
        setFilteredEnquiries(enquiries);
        setSearchQuery("");
        setFromDate("");
        setToDate("");
        setCurrentPage(1);
        countUnread(enquiries);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this enquiry?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                const updated = enquiries.filter((item) => item._id !== id);
                setEnquiries(updated);
            } else {
                console.error("Failed to delete enquiry");
            }
        } catch (error) {
            console.error("Error deleting enquiry:", error);
        }
    };

    const handleCheckboxChange = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((i) => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
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

    const handleDeleteSelected = async () => {
        const confirmDelete = window.confirm("Delete selected enquiries?");
        if (!confirmDelete) return;

        for (const id of selectedIds) {
            try {
                await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            } catch (error) {
                console.error("Error deleting ID:", id, error);
            }
        }

        const updated = enquiries.filter((item) => !selectedIds.includes(item._id));
        setEnquiries(updated);
        setSelectedIds([]);
        setSelectAll(false);
    };

    // Mark enquiry as read
    const markAsRead = async (id) => {
        try {
            const res = await fetch(`https://dgrnode.vercel.app/markenquiryread/${id}`, {
                method: "PUT",
            });
            if (res.ok) fetchEnquiries();
        } catch (error) {
            console.error("Mark as read failed:", error);
        }
    };

    const countUnread = (list) => {
        const unread = list.filter(item => !item.isRead).length;
        setUnreadCount(unread);
    };

    const indexOfLast = currentPage * enquiriesPerPage;
    const indexOfFirst = indexOfLast - enquiriesPerPage;
    const currentEnquiries = filteredEnquiries.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredEnquiries.length / enquiriesPerPage);

    return (
        <>
            <SidebarHeader />
            <div className="enquiry-table-container">
                <h2>Enquiry List</h2>

                {/* Unread notification badge */}
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
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-input"
                />

                <div className="date-filter">
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    <button onClick={handleDateFilter}>Filter by Date</button>
                    <button onClick={handleResetFilters}>Reset Filters</button>
                </div>

                {selectedIds.length > 0 && (
                    <button onClick={handleDeleteSelected} className="delete-selected-btn">
                        Delete Selected ({selectedIds.length})
                    </button>
                )}

                <table className="enquiry-table">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Email</th>
                            <th>Course</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEnquiries.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>No enquiries found</td>
                            </tr>
                        ) : (
                            currentEnquiries.map((item) => (
                                <tr
                                    key={item._id}
                                    style={{ backgroundColor: item.isRead ? "white" : "#eef" }}
                                >
                                    <td>
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
                                                }}
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                        <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="paginationn">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}

export default WebEnquiryTable;
