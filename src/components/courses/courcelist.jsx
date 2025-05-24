import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function Allcourse() {

  const userprivatekey = localStorage.getItem("userprivatekey")
    if(!userprivatekey){
      setTimeout(() => {
          window.location.replace("/")
      }, 500);
    }

  const [blogdata, setblogdata] = useState([]);

  async function GetBlog() {
    const apiurl = await fetch("https://dgrnode.vercel.app/allcourse");
    const data = await apiurl.json();
    setblogdata(data);
  }

  useEffect(() => {
    GetBlog();
  }, []);

  const  handleDelete=async(id)=> {
    if (window.confirm("Are you sure you want to delete this Course?")) {
      try {
        await fetch(`https://dgrnode.vercel.app/allcourse/${id}`, {
          method: "DELETE",
        });
        toast.success("Course deleted");
        window.location.reload()
      } catch (error) {
        toast.error("Try again...", error);
      }
    }
  }

  return (
    <>
    <Toaster/>
      <h1 style={{ textAlign: "center" }}>Web Devlopment Courses</h1>

      <table
        border="3px"
        cellPadding="8px"
        cellSpacing="6px"
        width="82%"
        style={{ margin: "50px auto" }}
      >
        <tr>
            <th>Sr. No.</th>
          <th>Coursename || CourseCategory</th>
          <th>courseimage</th>
          <th>courseprice</th>
          <th>courseCreatedBy</th>
          <th>Delete</th>
          <th>Update</th>
        </tr>
        {blogdata.map((items,index) => {
          return (
            <>
              <tr>
                <td>{index+1}</td>
                <td>{items.coursecategory}</td>
                <td>
                    <img src={`${items.cardimage}`} style={{height:"30px"}}/>
                </td>
                <td>{items.courceprice}</td>
                <td>{items.courcecreatedby ? items.courcecreatedby : "Admin✅"}</td>
                <td>
                  <button 
                  onClick={()=>{handleDelete(items._id)}}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px 15px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  >Delete</button>
                </td>
                <td>
                  <button className="save">
                    <i className="fas fa-eye"></i>
                  </button>
                </td>
              </tr>
            </>
          );
        })}
      </table>
    </>
  );
}

export { Allcourse };
