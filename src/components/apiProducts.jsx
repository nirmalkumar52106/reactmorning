import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ExportExcel } from "./enquiryReport";
import { Link } from "react-router-dom";

function ApiFetching() {
  const [allproducts, setAllProducts] = useState([]);
  const [filterProduct, setFilterProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6; // Show 5 records per page

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://dgrnode.vercel.app/allenquiry");
        const data = await response.json();
        setAllProducts(data);
        setFilterProduct(data);
      } catch (error) {
        toast.error("Failed to fetch data.");
      }
    }
    fetchData();
  }, []);

  // Delete Function
  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this Enquiry?")) {
      try {
        await fetch(`https://dgrnode.vercel.app/allenquiry/${id}`, {
          method: "DELETE",
        });
        toast.success("Enquiry deleted");

        // Remove deleted item from state
        const updatedData = allproducts.filter((item) => item._id !== id);
        setAllProducts(updatedData);
        setFilterProduct(updatedData);

      } catch (error) {
        toast.error("Try again...");
      }
    }
  }

  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filterProduct.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filterProduct.length / recordsPerPage);

  // Change Page
  const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));


  const filterByCourse = (e) => {
    const value = e.target.value;
    if (value) {
      setFilterProduct(allproducts.filter((item) => item.cource === value));
    } else {
      setFilterProduct(allproducts);
    }
  };

  // Function to Filter by Status
  const filterByStatus = (e) => {
    const value = e.target.value;
    if (value) {
      setFilterProduct(allproducts.filter((item) => item.statuss === value));
    } else {
      setFilterProduct(allproducts);
    }
  };

  //filter by name
  

  const Searchbyname=(e)=>{

    const getnamee = e.target.value;

    const filteredStudents = allproducts.filter((student) =>
      student.namee.toLowerCase().includes(getnamee)
    );

    if(getnamee){
      setFilterProduct(filteredStudents)
    }else{
      setFilterProduct(allproducts)
    }
  }


  // Function to Reset Filters
  const resetFilters = () => {
    toast.success("All Recent Filters Reset ✅");
    setFilterProduct(allproducts);
  };
 
  const registeredCount = allproducts.filter((item) => item.statuss === "Registered").length;
  const pendingCount = allproducts.filter((item) => item.statuss === "Pending").length;
  const totalEnquiries = allproducts.length;
  
  // Calculate Percentages
  const registeredPercentage = totalEnquiries ? ((registeredCount / totalEnquiries) * 100).toFixed(2) : 0;
  const pendingPercentage = totalEnquiries ? ((pendingCount / totalEnquiries) * 100).toFixed(2) : 0;

    // Reminder for Pending Status Students
    const pendingStudents = allproducts.filter(item => item.statuss === "Pending");
    useEffect(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const lastReminder = localStorage.getItem("lastReminder");
  
      if (!lastReminder || new Date(lastReminder).getDate() !== now.getDate()) {
        if (currentHour >= 10) {
          const pendingStudents = allproducts.filter(item => item.statuss === "Pending");
          if (pendingStudents.length > 0) {
            toast(`Reminder: Call ${pendingStudents.length} pending students today! ☎️`);
            localStorage.setItem("lastReminder", now);
          }
        }
      }
    }, [allproducts]);

    



  return (
    <>
      <Toaster />
      <h1>All Enquiries</h1>
      <h2>Total Enquiries: {allproducts.length}</h2>

      <div className="analysis-section">
        <h3>📊 Enquiry Analysis</h3>
        <p>Total Enquiries: <b>{totalEnquiries}</b></p>
        <p>✅ Registered: <b>{registeredCount}</b> ({registeredPercentage}%)</p>
        <p>⏳ Pending: <b>{pendingCount}</b> ({pendingPercentage}%)</p>
      </div>

      {pendingStudents.length > 0 && (
        <div className="reminder-section">
          <h3>☎️ Call Reminder for Pending Students</h3>
          <ul>
            {pendingStudents.map((student, index) => (
              <li key={index}>{student.namee} - {student.mobile}</li>
            ))}
          </ul>
        </div>
      )}


      <div className="filter-section">
        <select onChange={filterByCourse}>
        <option selected disabled>
            Filter by cource
          </option>
          <option>Web Development</option>
          <option>Web Design</option>
          <option>Mern stack</option>
          <option>Digital marketing</option>
          <option>App Development</option>
        </select>

        <select onChange={filterByStatus}>
          <option value="">Filter by Status</option>
          <option>Pending</option>
          <option>NotInterested</option>
          <option>Registered</option>
        </select>

        <input
        type="text"
        placeholder="Search by Name..."
        onChange={Searchbyname}
        className="search-input"
      />

        

        <button onClick={resetFilters}>Reset Filters</button>
      </div>

      {/* Table Section */}
      <table border="3px" cellPadding="8px" cellSpacing="6px" width="82%" style={{ margin: "50px auto" }}>
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Course</th>
            <th>Delete</th>
            <th>More Detail</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.length > 0 ? (
            currentRecords.map((item, index) => (
              <tr key={item._id}>
                <td style={{ fontWeight: "bold" }}>{index + 1 + (currentPage - 1) * recordsPerPage}</td>
                <td>{item.namee}</td>
                <td>{item.mobile}</td>
                <td>{item.cource}</td>
                <td style={{ textAlign: "center" }}>
                  <button
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "10px 15px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <Link to={`/enqdetail?id=${item._id}`}>
                    <button className="save">
                      <i className="fas fa-eye"></i>
                    </button>
                  </Link>
                </td>
                <td>
                  {item.statuss === "Registered" ? `${item.statuss} ✅` : `${item.statuss} 😔`}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", fontWeight: "bold" }}>
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Buttons */}
      {filterProduct.length > 5 && (
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>
            Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}

      <ExportExcel tableData={allproducts} fileName="StudentData" />
    </>
  );
}

export { ApiFetching };
