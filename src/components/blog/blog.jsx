import React, { useState } from "react";
import { Header } from "../header";
import { Allblog } from "./allblog";
import toast, { Toaster } from "react-hot-toast";
import { SidebarHeader } from "../sidebarheader";

function Blog() {
  const [show, setshow] = useState(true);

  const AddblogShow = () => {
    setshow(false);
  };

  const AddblogHide = () => {
    setshow(true);
  };

  //add blog

  const [blogtitle, setblogtitle] = useState("");
  const [blogdesc, setblogdesc] = useState("");
  const [blogimage, setblogimage] = useState("");
  const [metatitle, setmetatitle] = useState("");
  const [metakey, setmetakey] = useState("");
  const [metadesc, setmetadesc] = useState("");
  const [slugurl, setslugurl] = useState("");
  const [blogdate, setblogdate] = useState("");

  const titlevalue = (e) => {
    setblogtitle(e.target.value);
  };

  const descvalue = (e) => {
    setblogdesc(e.target.value);
  };

  const imagevalue = (e) => {
    setblogimage(e.target.value);
  };

  const metatitlevalue = (e) => {
    setmetatitle(e.target.value);
  };

  const metadescvalue = (e) => {
    setmetadesc(e.target.value);
  };

  const metakeyvalue = (e) => {
    setmetakey(e.target.value);
  };

  const slugvalue = (e) => {
    setslugurl(e.target.value);
  };

  const blogdatevalue = (e) => {
    setblogdate(e.target.value);
  };

  const formdata = {
    blogtitle: blogtitle,
    blogdesc: blogdesc,
    blogimage: blogimage,
    metatitle: metatitle,
    metadesc: metadesc,
    metakey: metakey,
    slugurl: slugurl,
    blogdate: blogdate,
  };

  const Addblog = async (e) => {
    e.preventDefault()
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    const apiurl = await fetch("https://dgrnode.vercel.app/addblog", {
      method: "POST",
      body: JSON.stringify(formdata),
      headers,
    }).then(()=>{
      toast.success("New Blog Added..")
      setTimeout(() => {
        window.location.reload()
      }, 1500);
    }).catch(()=>{
      toast.error("Something went wrong...!")
    })
  };

  return (
    <>

      
      <SidebarHeader/>

      <div className="filter-section" style={{ margin: "50px auto" }}>
        <button
          onClick={AddblogShow}
          style={{ backgroundColor: "green", fontSize: "16px" }}
        >
          {" "}
          <span>+</span> Add Blog
        </button>
      </div>

      <Allblog />

      <section
        id="blog"
        style={{
          display: `${show === true ? "none" : "block"}`,
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          zIndex: "9999",
        }}
      >
            <Toaster/>
        <h2 style={{ textAlign: "center", marginTop: "30px" }}>Add Blog</h2>
        <div className="blog-wrapper">
          <button
            onClick={() => {
              AddblogHide();
            }}
            style={{
              width: "50px",
              position: "absolute",
              right: "447px",
              top: "111px",
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <form>
            <label htmlFor="blogtitle">Blog Title</label>
            <input
              onChange={titlevalue}
              type="text"
              id="blogtitle"
              name="blogtitle"
              required
            />

            <label htmlFor="blogdes">Blog Description</label>
            <textarea
              onChange={descvalue}
              id="blogdes"
              name="blogdes"
              rows="4"
              required
            ></textarea>

            <label htmlFor="blogimage">Blog Image Url</label>
            <input
              onChange={imagevalue}
              type="text"
              id="blogimage"
              name="blogimage"
              required
            />

            <label htmlFor="metatitle">Meta Title</label>
            <input
              onChange={metatitlevalue}
              type="text"
              id="metatitle"
              name="metatitle"
              required
            />

            <label htmlFor="metadesc">Meta Description</label>
            <textarea
              onChange={metadescvalue}
              id="metadesc"
              name="metadesc"
              rows="3"
              required
            ></textarea>

            <label htmlFor="metakey">Meta Keywords</label>
            <input
              onChange={metakeyvalue}
              type="text"
              id="metakey"
              name="metakey"
              required
            />

            <label htmlFor="slugurl">Slug URL</label>
            <input
              onChange={slugvalue}
              type="text"
              id="slugurl"
              name="slugurl"
              required
            />

            <label htmlFor="blogdate">Blog Date</label>
            <input
              onChange={blogdatevalue}
              type="date"
              id="blogdate"
              name="blogdate"
              required
            />

            <button onClick={Addblog} type="submit">Add Blog</button>
          </form>
        </div>
      </section>
    </>
  );
}

export { Blog };
