// import React, { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { Link } from "react-router-dom";

// function Allblog() {


//   const token = localStorage.getItem("token")
//     if(!token){
//       setTimeout(() => {
//           window.location.replace("/")
//       }, 500);
//     }

//   const [blogdata, setblogdata] = useState([]);

//   async function GetBlog() {
//     const apiurl = await fetch("https://dgrnode.vercel.app/allblog");
//     const data = await apiurl.json();
//     setblogdata(data);
//   }

//   useEffect(() => {
//     GetBlog();
//   }, []);

//   const  handleDelete=async(id)=> {
//     if (window.confirm("Are you sure you want to delete this Blog?")) {
//       try {
//         await fetch(`https://dgrnode.vercel.app/allblog/${id}`, {
//           method: "DELETE",
//           headers: {
//     "Content-Type": "application/json",
//     "Authorization": `Bearer ${token}`  // ✅ important
//   }
//         });
//         toast.success("Blog deleted");
//         window.location.reload()
//       } catch (error) {
//         toast.error("Try again...", error);
//       }
//     }
//   }

//   return (
//     <>
//     <Toaster/>
//       <h1 style={{ textAlign: "center" }}>My Blogs</h1>

//       <table
//         border="3px"
//         cellPadding="8px"
//         cellSpacing="6px"
//         width="82%"
//         style={{ margin: "50px auto" }}
//       >
//         <tr>
//             <th>Sr. No.</th>
//           <th>Blogtitle</th>
//           <th>Blogimage</th>
//           <th>Blogdate</th>
//           <th>CreatedBy</th>
//           <th>Delete</th>
//           <th>Update</th>
//         </tr>
//         {blogdata.map((items,index) => {
//           return (
//             <>
//               <tr>
//                 <td>{index+1}</td>
//                 <td><Link target="_blank" to={`https://jdbinfotech.co.in/blog/${items.slugurl}`}> {items.blogtitle} </Link></td>
//                 <td>
//                     <img src={`${items.blogimage}`} style={{height:"30px"}}/>
//                 </td>
//                 <td>{items.blogdate}</td>
//                 <td>{items.createdby ? items.createdby : "Owner✅"}</td>
//                 <td>
//                   <button 
//                   onClick={()=>{handleDelete(items._id)}}
//                   style={{
//                     backgroundColor: "red",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "6px",
//                     padding: "10px 15px",
//                     cursor: "pointer",
//                     fontWeight: "bold",
//                   }}
//                   >Delete</button>
//                 </td>
//                 <td>
//                   <button className="save">
//                     <i className="fas fa-eye"></i>
//                   </button>
//                 </td>
//               </tr>
//             </>
//           );
//         })}
//       </table>
//     </>
//   );
// }

// export { Allblog };

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

function Allblog() {

  const token = localStorage.getItem("token");
  if (!token) {
    setTimeout(() => {
      window.location.replace("/");
    }, 500);
  }

  const [blogdata, setblogdata] = useState([]);

  // 🔍 SEARCH
  const [search, setSearch] = useState("");

  // 📄 PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;

  async function GetBlog() {
    const apiurl = await fetch("https://dgrnode.vercel.app/allblog");
    const data = await apiurl.json();
    setblogdata(data);
  }

  useEffect(() => {
    GetBlog();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Blog?")) {
      try {
        await fetch(`https://dgrnode.vercel.app/allblog/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        toast.success("Blog deleted");
        window.location.reload();
      } catch (error) {
        toast.error("Try again...");
      }
    }
  };

  // 🔍 FILTER
  const filteredBlogs = blogdata.filter((item) =>
    item.blogtitle.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 PAGINATION LOGIC
  const indexOfLast = currentPage * blogsPerPage;
  const indexOfFirst = indexOfLast - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  return (
    <>
      <Toaster />

      <div style={{ padding: "20px" }}>

        <h1 style={{
          textAlign: "center",
          
        }}>
          📚 My Blogs
        </h1>

        {/* 🔍 SEARCH BOX */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search blog by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: "40%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none"
            }}
          />
        </div>

        {/* 📊 TABLE */}
        <div style={tableContainer}>
          <table style={tableStyle} cellPadding={10} cellSpacing={10}>
            <thead>
              <tr style={theadStyle}>
                <th>#</th>
                <th>Blog</th>
                <th>Image</th>
                <th>Date</th>
                <th>Author</th>
                <th>Delete</th>
                <th>Edit</th>
              </tr>
            </thead>

            <tbody>
              {currentBlogs.map((items, index) => (
                <tr key={items._id} style={rowStyle}>

                  {/* ✅ RUNNING INDEX */}
                  <td>
                    {(currentPage - 1) * blogsPerPage + index + 1}
                  </td>

                  <td>
                    <Link
                      target="_blank"
                      to={`https://jdbinfotech.co.in/blog/${items.slugurl}`}
                      style={{ textDecoration: "none", color: "#007bff" }}
                    >
                      {items.blogtitle}
                    </Link>
                  </td>

                  <td>
                    <img
                      src={items.blogimage}
                      style={{
                        height: "45px",
                        borderRadius: "6px"
                      }}
                    />
                  </td>

                  <td>{items.blogdate}</td>

                  <td>
                    <span style={badge}>
                      {items.createdby || "Owner"}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => handleDelete(items._id)}
                      style={deleteBtn}
                    >
                      Delete
                    </button>
                  </td>

                  <td>
                    <Link to={`/edit-blog/${items._id}`}>
                      Edit
                    </Link>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔥 SMART PAGINATION */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>

          {/* PREV */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            style={pageBtn}
          >
            Prev
          </button>

          {(() => {
            const pages = [];
            let start = Math.max(1, currentPage - 1);
            let end = Math.min(totalPages, start + 2);

            if (end - start < 2) {
              start = Math.max(1, end - 2);
            }

            if (start > 1) {
              pages.push(
                <button key={1} onClick={() => setCurrentPage(1)} style={pageBtn}>
                  1
                </button>
              );
              if (start > 2) pages.push(<span key="dots1"> ... </span>);
            }

            for (let i = start; i <= end; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  style={{
                    ...pageBtn,
                    background: currentPage === i ? "#007bff" : "#eee",
                    color: currentPage === i ? "#fff" : "#000"
                  }}
                >
                  {i}
                </button>
              );
            }

            if (end < totalPages) {
              if (end < totalPages - 1) {
                pages.push(<span key="dots2"> ... </span>);
              }
              pages.push(
                <button key={totalPages} onClick={() => setCurrentPage(totalPages)} style={pageBtn}>
                  {totalPages}
                </button>
              );
            }

            return pages;
          })()}

          {/* NEXT */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            style={pageBtn}
          >
            Next
          </button>

        </div>
      </div>
    </>
  );
}

/* 🎨 STYLES */

const tableContainer = {
  width: "95%",
  margin: "auto",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  overflow: "hidden"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

const theadStyle = {
  background: "#111",
  color: "#fff"
};

const rowStyle = {
  textAlign: "center",
  borderBottom: "1px solid #eee"
};

const badge = {
  background: "#28a745",
  color: "#fff",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "12px"
};

const deleteBtn = {
  background: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};

const editBtn = {
  background: "#007bff",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};

const pageBtn = {
  margin: "5px",
  padding: "8px 14px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold"
};

export { Allblog };
