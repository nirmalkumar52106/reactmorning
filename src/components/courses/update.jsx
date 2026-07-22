import { useEffect, useState } from "react";
import { SidebarHeader } from "../sidebarheader";
import { useParams } from "react-router-dom";

function UpdateCourse() {
  const { id } = useParams();
  const tokeenn = localStorage.getItem("token");

  const [originalData, setOriginalData] = useState({});
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await fetch(`https://dgrnode.vercel.app/allcourse/${id}`);
      const data = await res.json();
      setForm(data);
      setOriginalData(data);
      setLoading(false);
    };
    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("instructor.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        instructor: { ...prev.instructor, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCurriculumChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...form.curriculum];
    updated[index][name] = value;
    setForm((prev) => ({ ...prev, curriculum: updated }));
  };

  const addCurriculumItem = () => {
    setForm((prev) => ({
      ...prev,
      curriculum: [
        ...(prev.curriculum || []),
        { title: "", description: "", videoUrl: "" },
      ],
    }));
  };

  const getUpdatedFields = () => {
    const updates = {};
    for (let key in form) {
      if (Array.isArray(form[key])) {
        if (JSON.stringify(form[key]) !== JSON.stringify(originalData[key]))
          updates[key] = form[key];
      } else if (typeof form[key] === "object") {
        const nested = {};
        for (let subKey in form[key]) {
          if (form[key][subKey] !== originalData[key]?.[subKey])
            nested[subKey] = form[key][subKey];
        }
        if (Object.keys(nested).length > 0) updates[key] = nested;
      } else if (form[key] !== originalData[key]) updates[key] = form[key];
    }
    return updates;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updates = getUpdatedFields();
    if (Object.keys(updates).length === 0) {
      alert("No changes made!");
      return;
    }
    await fetch(`https://dgrnode.vercel.app/allcourse/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokeenn}`,
      },
      body: JSON.stringify(updates),
    });
    alert("course updated..!");
  };

  if (loading)
    return <h3 style={{ textAlign: "center", marginTop: "100px" }}>Loading...</h3>;

  return (
    <>
      <SidebarHeader />

      <div className="uc-wrapper">
        <div className="uc-container">
          <h2 className="uc-title">🚀 Update Course</h2>

          <form onSubmit={handleSubmit} className="uc-form">

            {/* BASIC */}
            <div className="uc-card">
              <h3>Basic Info</h3>
              <div className="uc-grid">

                <div className="field">
                  <label>Course Image URL</label>
                  <input name="cardimage" value={form.cardimage || ""} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Course Category</label>
                  <input name="coursecategory" value={form.coursecategory || ""} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Course Description</label>
                  <input name="courcedesc" value={form.courcedesc || ""} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Created By</label>
                  <input name="courcecreatedby" value={form.courcecreatedby || ""} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Course Price</label>
                  <input name="courceprice" value={form.courceprice || ""} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Course Overview</label>
                  <input name="courseoverview" value={form.courseoverview || ""} onChange={handleChange} />
                </div>

              </div>
            </div>

            {/* SEO */}
            <div className="uc-card">
              <h3>SEO Settings</h3>
              <div className="uc-grid">

                <div className="field">
                  <label>Slug</label>
                  <input name="slug" value={form.slug || ""} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Page Title</label>
                  <input name="title" value={form.title || ""} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Meta Title</label>
                  <input name="metatitle" value={form.metatitle || ""} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Meta Description</label>
                  <input name="metadescription" value={form.metadescription || ""} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Meta Keywords</label>
                  <input name="metakeyword" value={form.metakeyword || ""} onChange={handleChange} />
                </div>

              </div>
            </div>

            {/* INSTRUCTOR */}
            <div className="uc-card">
              <h3>Instructor Info</h3>
              <div className="uc-grid">

                <div className="field">
                  <label>Name</label>
                  <input name="instructor.name" value={form.instructor?.name || ""} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Bio</label>
                  <input name="instructor.bio" value={form.instructor?.bio || ""} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Image URL</label>
                  <input name="instructor.image" value={form.instructor?.image || ""} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Subject</label>
                  <input name="instructor.subject" value={form.instructor?.subject || ""} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Mobile</label>
                  <input name="instructor.mobile" value={form.instructor?.mobile || ""} onChange={handleChange} />
                </div>

              </div>
            </div>

            {/* CURRICULUM */}
            <div className="uc-card">
              <h3>Curriculum </h3>
              <h2>Total Lesson: {form.curriculum?.length}</h2>

              {form.curriculum?.map((item, index) => {

  const getLessonTitle = (i) => {
    if (i === 0) return "1st Lesson";
    if (i === 1) return "2nd Lesson";
    if (i === 2) return "3rd Lesson";
    return `${i + 1}th Lesson`;
  };

  return (
    <div key={index} className="uc-curriculum">

      {/* 🔥 Lesson Heading */}
      <div className="lesson-heading">
        {getLessonTitle(index)}
      </div>

      <div className="field">
        <label>Lesson Title</label>
        <input
          name="title"
          value={item.title}
          onChange={(e) => handleCurriculumChange(index, e)}
        />
      </div>

      <div className="field">
        <label>Description</label>
        <input
          name="description"
          value={item.description}
          onChange={(e) => handleCurriculumChange(index, e)}
        />
      </div>

      <div className="field">
        <label>Video URL</label>
        <input
          name="videoUrl"
          value={item.videoUrl}
          onChange={(e) => handleCurriculumChange(index, e)}
        />
      </div>

    </div>
  );
})}

              <button type="button" className="uc-add" onClick={addCurriculumItem}>
                + Add Curriculum
              </button>
            </div>

            <button type="submit" className="uc-submit">
              Update Course
            </button>

          </form>
        </div>
      </div>

      <style>{`
      .lesson-heading{
  grid-column: 1 / -1;
  font-weight: bold;
  font-size: 15px;
  color: #1e293b;
  background: #e0f2fe;
  padding: 8px 14px;
  border-radius: 8px;
  margin-bottom: 6px;
}
        .uc-wrapper{padding:30px;background:#f1f5f9;}
        .uc-container{max-width:1200px;margin:auto;}
        .uc-title{text-align:center;margin-bottom:25px;}

        .uc-form{display:flex;flex-direction:column;gap:20px;}

        .uc-card{
          background:white;
          padding:20px;
          border-radius:14px;
          box-shadow:0 10px 25px rgba(0,0,0,.06);
        }

        .uc-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:14px;
        }

        .field{
          display:flex;
          flex-direction:column;
          gap:5px;
        }

        label{
          font-size:13px;
          font-weight:600;
          color:#334155;
        }

        input{
          padding:10px;
          border-radius:8px;
          border:1px solid #ddd;
          transition:.2s;
        }

        input:focus{
          border-color:#2563eb;
          box-shadow:0 0 0 2px rgba(37,99,235,.2);
          outline:none;
        }

        .uc-curriculum{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:12px;
          margin-bottom:10px;
        }

        .uc-add{
          background:#16a34a;
          color:white;
          border:none;
          padding:10px;
          border-radius:8px;
          cursor:pointer;
        }

        .uc-submit{
          position:sticky;
          bottom:10px;
          background:#2563eb;
          color:white;
          padding:14px;
          border:none;
          border-radius:10px;
          font-weight:bold;
          cursor:pointer;
        }

        @media(max-width:900px){
          .uc-grid{grid-template-columns:1fr 1fr;}
          .uc-curriculum{grid-template-columns:1fr;}
        }

        @media(max-width:600px){
          .uc-grid{grid-template-columns:1fr;}
        }
      `}</style>
    </>
  );
}

export { UpdateCourse };