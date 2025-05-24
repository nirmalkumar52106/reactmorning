import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function Allblog() {


  const userprivatekey = localStorage.getItem("userprivatekey")
    if(!userprivatekey){
      setTimeout(() => {
          window.location.replace("/")
      }, 500);
    }

  const [blogdata, setblogdata] = useState([]);

  async function GetBlog() {
    const apiurl = await fetch("https://dgrnode.vercel.app/allblog");
    const data = await apiurl.json();
    setblogdata(data);
  }

  useEffect(() => {
    GetBlog();
  }, []);

  const  handleDelete=async(id)=> {
    if (window.confirm("Are you sure you want to delete this Blog?")) {
      try {
        await fetch(`https://dgrnode.vercel.app/allblog/${id}`, {
          method: "DELETE",
        });
        toast.success("Blog deleted");
        window.location.reload()
      } catch (error) {
        toast.error("Try again...", error);
      }
    }
  }

  return (
    <>
    <Toaster/>
      <h1 style={{ textAlign: "center" }}>My Blogs</h1>

      <table
        border="3px"
        cellPadding="8px"
        cellSpacing="6px"
        width="82%"
        style={{ margin: "50px auto" }}
      >
        <tr>
            <th>Sr. No.</th>
          <th>Blogtitle</th>
          <th>Blogimage</th>
          <th>Blogdate</th>
          <th>CreatedBy</th>
          <th>Delete</th>
          <th>Update</th>
        </tr>
        {blogdata.map((items,index) => {
          return (
            <>
              <tr>
                <td>{index+1}</td>
                <td>{items.blogtitle}</td>
                <td>
                    <img src={`${items.blogimage}`} style={{height:"30px"}}/>
                </td>
                <td>{items.blogdate}</td>
                <td>{items.createdby ? items.createdby : "Owner✅"}</td>
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

export { Allblog };
