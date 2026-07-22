import { useState } from "react";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import toast from "react-hot-toast";

import { SidebarHeader } from "../sidebarheader";

const AddNotes = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");



  const createSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "-");
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://dgrnode.vercel.app/api/notes/add",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title,
            category,
            shortDescription,
            content,
            metaTitle,
            metaDescription,
            metaKeywords,
            featuredImage,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Notes Added");

        setTitle("");
        setCategory("");
        setShortDescription("");
        setContent("");
        setMetaTitle("");
        setMetaDescription("");
        setMetaKeywords("");
        setFeaturedImage("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something Wrong");
    }
  };



  return (
    <div
      style={{
        display: "flex",
        background: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <SidebarHeader />



      <div
        style={{
          width : "70%",
          margin : "30px auto",
          padding: "30px",
        }}
      >
        <h1
          style={{
            marginBottom: "30px",
            fontSize: "32px",
            fontWeight: "700",
            color: "#111827",
          }}
        >
          Add Notes
        </h1>



        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: "white",
              padding: "50px",
              borderRadius: "14px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            {/* TITLE */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                Title
              </label>

              <input
                type="text"
                placeholder="Enter Notes Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  outline: "none",
                  fontSize: "15px",
                }}
              />
            </div>



            {/* SLUG */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Slug Preview
              </label>

              <div
                style={{
                  padding: "14px",
                  background: "#f3f4f6",
                  borderRadius: "8px",
                  color: "#374151",
                  fontSize: "14px",
                  wordBreak: "break-all",
                }}
              >
                /{createSlug(title)}
              </div>
            </div>



            {/* CATEGORY */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Category
              </label>

              <input
                type="text"
                placeholder="HTML"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  outline: "none",
                  fontSize: "15px",
                }}
              />
            </div>



            {/* FEATURED IMAGE */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Featured Image URL
              </label>

              <input
                type="text"
                placeholder="Paste image URL"
                value={featuredImage}
                onChange={(e) =>
                  setFeaturedImage(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  outline: "none",
                  fontSize: "15px",
                }}
              />
            </div>



            {
              featuredImage && (
                <div
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <img
                    src={featuredImage}
                    alt="preview"
                    style={{
                      width: "220px",
                      height: "130px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              )
            }



            {/* SHORT DESCRIPTION */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Short Description
              </label>

              <textarea
                rows="4"
                placeholder="Short description"
                value={shortDescription}
                onChange={(e) =>
                  setShortDescription(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  outline: "none",
                  fontSize: "15px",
                  resize: "vertical",
                }}
              />
            </div>



            {/* CONTENT */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Content
              </label>

              <div
                style={{
                  background: "white",
                }}
              >
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  style={{
                    background: "white",
                  }}
                />
              </div>
            </div>



            {/* SEO HEADING */}

            <div
              style={{
                marginTop: "30px",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  color: "#111827",
                }}
              >
                SEO Meta
              </h2>
            </div>



            {/* META TITLE */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Meta Title
              </label>

              <input
                type="text"
                placeholder="Meta Title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  outline: "none",
                  fontSize: "15px",
                }}
              />
            </div>



            {/* META DESCRIPTION */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Meta Description
              </label>

              <textarea
                rows="4"
                placeholder="Meta Description"
                value={metaDescription}
                onChange={(e) =>
                  setMetaDescription(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  outline: "none",
                  fontSize: "15px",
                  resize: "vertical",
                }}
              />
            </div>



            {/* META KEYWORDS */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Meta Keywords
              </label>

              <input
                type="text"
                placeholder="html notes, html tutorial"
                value={metaKeywords}
                onChange={(e) =>
                  setMetaKeywords(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  outline: "none",
                  fontSize: "15px",
                }}
              />
            </div>



            {/* BUTTON */}

            <button
              type="submit"
              style={{
                background: "#111827",
                color: "white",
                padding: "14px 28px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600",
                transition: "0.3s",
              }}
            >
              Add Notes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNotes;