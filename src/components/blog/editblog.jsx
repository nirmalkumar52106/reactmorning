import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { SidebarHeader } from "../sidebarheader";

function EditBlog() {

  const { id } = useParams();
  const navigate = useNavigate();
  

  const [form, setForm] = useState({
    blogtitle: "",
    blogdesc: "",
    blogimage: "",
    metatitle: "",
    metadesc: "",
    metakey: ""
  });

  // ✅ LOADER STATES
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ GET SINGLE BLOG
  useEffect(() => {
    fetch(`https://dgrnode.vercel.app/allblogs/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm(data?.result);
        setLoading(false); // ✅ stop loader
      });
  }, [id]);

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ UPDATE BLOG
  const handleUpdate = async () => {
    setUpdating(true); // ✅ start loader
    try {
      await fetch(`https://dgrnode.vercel.app/allblog/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      toast.success("Blog Updated ✅");
      setTimeout(() => navigate("/blog"), 1000);

    } catch (err) {
      toast.error("Update Failed");
    } finally {
      setUpdating(false); // ✅ stop loader
    }
  };

  // ✅ LOADING SCREEN
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h3>Loading Blog...</h3>
      </div>
    );
  }

  return (
    <>
      <Toaster />

      <SidebarHeader />

      <div className="ediblogpage" style={container}>
        <Link to="/blog">Back toh Blogs</Link>
        <h2>Edit Blog</h2>

        <label>Blogtitle:</label>
        <input name="blogtitle" value={form.blogtitle} onChange={handleChange} placeholder="Title" />

        <label>Blogimage:</label>
        <input name="blogimage" value={form.blogimage} onChange={handleChange} placeholder="Image URL" />

        <label>Blog Content:</label>
        <textarea name="blogdesc" value={form.blogdesc} onChange={handleChange} placeholder="Description" />

        <label>Meta title:</label>
        <input name="metatitle" value={form.metatitle} onChange={handleChange} placeholder="Meta Title" />

        <label>Meta description:</label>
        <input name="metadesc" value={form.metadesc} onChange={handleChange} placeholder="Meta Desc" />

        <label>Meta keywords:</label>
        <input name="metakey" value={form.metakey} onChange={handleChange} placeholder="Meta Keywords" />

        <button
          style={{
            background: "blue",
            color: "white",
            fontWeight: "bold"
          }}
          className="btn"
          onClick={handleUpdate}
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Blog"}
        </button>

      </div>
    </>
  );
}

const container = {
  width: "60%",
  margin: "50px auto",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "20px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  borderRadius: "10px"
};

export default EditBlog;