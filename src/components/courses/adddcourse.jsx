import { useEffect, useState } from "react";
import { Allcourse } from "./courcelist";
import { SidebarHeader } from "../sidebarheader";
import { useNavigate } from "react-router-dom";


function AddCourse() {


  const tokennn = localStorage.getItem("token")


  const [show, setshow] = useState(true);
  
    const Show = () => {
      setshow(false);
    };
  
    const Hide = () => {
      setshow(true);
    };


  const [form, setForm] = useState({
    cardimage: "",
    coursecategory: "",
    courcedesc: "", 
    courcecreatedby: "",
    courceprice: "",
    courseoverview: "",
    whatyoulearn: "",
    slug: "",
    title: "",
    metatitle: "",
    metadescription: "",
    metakeyword: "",
    coursestatus: "",
    instructor: {
      name: "",
      bio: "",
      image: "",
      subject: "",
      facebook: "",
      twitter: "",
      mobile: "",
      instagram: ""
    },
    curriculum: [
      { title: "", description: "", videoUrl: "" },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("instructor.")) {
      const key = name.split(".")[1];
      setForm(prev => ({
        ...prev,
        instructor: { 
          ...prev.instructor,
          [key]: value,
        },
      })); 
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCurriculumChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...form.curriculum];
    updated[index][name] = value;
    setForm(prev => ({ ...prev, curriculum: updated }));
  };

  const addCurriculumItem = () => {
    setForm(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, { title: "", description: "", videoUrl: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://dgrnode.vercel.app/addcourse", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokennn}`
         },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong!");
    }
  };

  const goto =  useNavigate()


  useEffect(()=>{
const token = localStorage.getItem("token")
    if(!token){
      window.location.replace("/")
    }
  },[goto])

  return (
    <>
    <SidebarHeader/>
          <div className="filter-section" style={{ margin: "50px auto" }}>
            <button
              onClick={Show}
              style={{ backgroundColor: "green", fontSize: "16px" }}
            >
              {" "}
              <span>+</span> Add Course
            </button>
          </div>
    
          <Allcourse/>

      <div className="add-course-container" 
      style={{
          display: `${show === true ? "none" : "block"}`,
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          zIndex: "9999",
        }}>
      <h2 style={{textAlign:"center"}}>Add New Course</h2>
       <button
            onClick={() => {
              Hide();
            }}
            style={{
              
              position: "absolute",
              right: "447px",
              top: "30px",
              padding : "12px 30px",
              backgroundColor : "red",
              color : "white",
              borderRadius  : "8px",
              border  :"none",
              cursor : "pointer",
              fontSize : "17px",

            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
      <form className="add-course-form" onSubmit={handleSubmit}>
        <input type="text" name="cardimage" placeholder="Image URL" onChange={handleChange} />
        <input type="text" name="coursecategory" placeholder="Category" onChange={handleChange} />
        <input type="text" name="courcedesc" placeholder="Course Description" onChange={handleChange} />
        <input type="text" name="courcecreatedby" placeholder="Course Created By" onChange={handleChange}/>
        <input type="text" name="courceprice" placeholder="Course Price" onChange={handleChange}/>
        <input type="text" name="courseoverview" placeholder="Course Overview" onChange={handleChange}/>
        <input type="text" name="whatyoulearn" placeholder="What You’ll Learn" onChange={handleChange}/>
        <input type="text" name="slug" placeholder="Slug URL" onChange={handleChange}/>
        <input type="text" name="title" placeholder="Page Title" onChange={handleChange}/>
        <input type="text" name="metatitle" placeholder="Meta Title" onChange={handleChange}/>
        <input type="text" name="metadescription" placeholder="Meta Description" onChange={handleChange}/>
        <input type="text" name="metakeyword" placeholder="Meta Keyword" onChange={handleChange}/>

        <select name="coursestatus" onChange={handleChange} defaultValue="">
          <option value="" disabled>Choose Course Status</option>
          <option value="Active">Active</option>
          <option value="Disabled">Disabled</option>
        </select>

        <h3>Instructor Info</h3>
        <input type="text" name="instructor.name" placeholder="Instructor Name" onChange={handleChange} />
        <input type="text" name="instructor.bio" placeholder="Instructor Bio" onChange={handleChange} />
        <input type="text" name="instructor.image" placeholder="Instructor Image URL" onChange={handleChange} />
        <input type="text" name="instructor.subject" placeholder="Instructor Subject" onChange={handleChange} />
        <input type="text" name="instructor.facebook" placeholder="Instructor Facebook" onChange={handleChange} />
        <input type="text" name="instructor.twitter" placeholder="Instructor Twitter" onChange={handleChange} />
        <input type="text" name="instructor.mobile" placeholder="Instructor Mobile" onChange={handleChange} />
        <input type="text" name="instructor.instagram" placeholder="Instructor Instagram" onChange={handleChange} />

        <h3>Curriculum</h3>
        {form.curriculum.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              name="title"
              placeholder="Lesson Title"
              value={item.title}
              onChange={(e) => handleCurriculumChange(index, e)}
            />
            <input
              type="text"
              name="description"
              placeholder="Lesson Description"
              value={item.description}
              onChange={(e) => handleCurriculumChange(index, e)}
            />
            <input
              type="text"
              name="videoUrl"
              placeholder="Video URL"
              value={item.videoUrl}
              onChange={(e) => handleCurriculumChange(index, e)}
            />
          </div>
        ))}
        <button type="button" onClick={addCurriculumItem}>+ Add Curriculum</button>
        <br />
        <button type="submit">Submit Course</button>
      </form>
    </div>
    
    </>
  
  );
}

export { AddCourse };