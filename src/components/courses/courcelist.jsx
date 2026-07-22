import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

function Allcourse() {

  const tokeenn = localStorage.getItem("token")
  if(!tokeenn){
    setTimeout(() => {
      window.location.replace("/")
    }, 500);
  }

  const [blogdata, setblogdata] = useState([]);
  const [search, setSearch] = useState("");
  const [previewImg, setPreviewImg] = useState(null);

  async function GetBlog() {
    const apiurl = await fetch("https://dgrnode.vercel.app/allcourse");
    const data = await apiurl.json();

    const sortedData = data.reverse();
    setblogdata(sortedData);
  }

  useEffect(() => {
    GetBlog();
  }, []);

  const handleDelete = async(id)=> {
    if (window.confirm("Are you sure you want to delete this Course?")) {
      try {
        await fetch(`https://dgrnode.vercel.app/allcourse/${id}`, {
          method: "DELETE",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokeenn}`
          },
        });
        toast.success("Course deleted");
        window.location.reload()
      } catch (error) {
        toast.error("Try again...");
      }
    }
  }

  const filteredData = blogdata.filter((item) =>
    item.courcedesc?.toLowerCase().includes(search.toLowerCase()) ||
    item.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Toaster />

      <style>{`

      body{
        background:#f1f5f9;
        font-family:Poppins;
      }

      .containerr{
        width:82%;
        margin:auto;
      }

      .heading{
        text-align:center;
        margin-top:20px;
        font-size:28px;
        font-weight:700;
        color:#0f172a;
      }

      .top-bar{
        margin-top:25px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        flex-wrap:wrap;
        gap:10px;
      }

      .search-box{
        padding:12px 15px;
        border-radius:12px;
        border:1px solid #ddd;
        width:280px;
        outline:none;
        box-shadow:0 5px 10px rgba(0,0,0,.05);
      }

      .table-card{
        margin-top:25px;
        background:white;
        border-radius:18px;
        box-shadow:0 15px 40px rgba(0,0,0,.08);
        overflow:hidden;
      }

      .table-header{
        padding:18px 25px;
        background:linear-gradient(135deg,#1e293b,#0f172a);
        color:white;
        display:flex;
        justify-content:space-between;
        align-items:center;
      }

      .table-header h3{
        margin:0;
      }

      .count{
        background:rgba(255,255,255,.15);
        padding:6px 14px;
        border-radius:20px;
        font-size:13px;
      }

      .table-wrapper{
        overflow-x:auto;
      }

      table{
        width:100%;
        border-collapse:collapse;
      }

      thead{
        background:#0f172a;
        color:white;
      }

      th, td{
        padding:16px;
        text-align:center;
      }

      tbody tr{
        transition:.25s;
      }

      tbody tr:hover{
        background:#f1f5f9;
        transform:scale(1.002);
      }

      .course-link{
        color:#2563eb;
        font-weight:600;
        text-decoration:none;
      }

      .course-link:hover{
        text-decoration:underline;
      }

      .course-img{
        width:70px;
        height:50px;
        border-radius:8px;
        cursor:pointer;
        transition:.3s;
      }

      .course-img:hover{
        transform:scale(1.1);
      }

      .badge{
        background:#e0f2fe;
        color:#0369a1;
        padding:6px 12px;
        border-radius:20px;
        font-size:12px;
        font-weight:500;
      }

      .btn{
        border:none;
        padding:8px 14px;
        border-radius:8px;
        cursor:pointer;
        font-weight:600;
      }

      .delete{
        background:linear-gradient(135deg,#ef4444,#dc2626);
        color:white;
      }

      .edit{
        background:linear-gradient(135deg,#2563eb,#1d4ed8);
        color:white;
      }

      .btn:hover{
        transform:translateY(-2px);
        box-shadow:0 6px 14px rgba(0,0,0,.15);
      }

      /* IMAGE MODAL */
      .img-modal{
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.7);
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:9999;
      }

      .img-box{
        position:relative;
      }

      .img-box img{
        max-width:90vw;
        max-height:80vh;
        border-radius:12px;
      }

      .close{
        position:absolute;
        top:-15px;
        right:-15px;
        background:red;
        color:white;
        border:none;
        border-radius:50%;
        width:35px;
        height:35px;
        cursor:pointer;
      }

      @media(max-width:768px){
        th,td{
          padding:12px;
          font-size:12px;
        }

        .search-box{
          width:100%;
        }
      }

      `}</style>

      {/* IMAGE PREVIEW */}
      {previewImg && (
        <div className="img-modal">
          <div className="img-box">
            <img src={previewImg} />
            <button className="close" onClick={()=>setPreviewImg(null)}>X</button>
          </div>
        </div>
      )}

      <div className="containerr">
        <h1 className="heading">Jdb Infotech All Courses</h1>

        <div className="top-bar">
          <input
            type="text"
            placeholder="Search course or slug..."
            className="search-box"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />
        </div>

        <div className="table-card">
          <div className="table-header">
            <h3>📚 Course Management</h3>
            <span className="count">{filteredData.length} Courses</span>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course</th>
                  <th>Image</th>
                  <th>Curriculum</th>
                  <th>Created By</th>
                  <th>Delete</th>
                  <th>View & Edit</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((items,index)=>(
                  <tr key={items._id}>
                    <td>{index+1}</td>

                    <td>
                      <a 
                        href={`https://jdbinfotech.co.in/${items.slug}`}
                        target="_blank"
                        className="course-link"
                      >
                        {items.courcedesc}
                      </a>
                    </td>

                    <td>
                      <img 
                        src={items.cardimage}
                        className="course-img"
                        onClick={()=>setPreviewImg(items.cardimage)}
                      />
                    </td>

                    <td>
                      <span className="badge">
                        {items.curriculum?.length} Topics
                      </span>
                    </td>

                    <td>
                      {items.courcecreatedby || "Admin ✅"}
                    </td>

                    <td>
                      <button 
                        className="btn delete"
                        onClick={()=>handleDelete(items._id)}
                      >
                        Delete
                      </button>
                    </td>

                    <td>
                      <Link to={`/update/${items._id}`}>
                        <button className="btn edit">View</button>
                      </Link>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
}

export { Allcourse };