import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { SidebarHeader } from "../sidebarheader";

const AllNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");



  /* =========================================
      GET ALL NOTES
  ========================================= */

  const getNotes = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://dgrnode.vercel.app/api/notes"
      );

      const data = await response.json();

      if (data.success) {
        setNotes(data.data || []);
      }
    } catch (error) {
      toast.error("Failed To Load Notes");
    } finally {
      setLoading(false);
    }
  };



  /* =========================================
      DELETE NOTE
  ========================================= */

  const deleteNote = async (id) => {
    const confirmDelete = window.confirm(
      "Are You Sure Want To Delete?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://dgrnode.vercel.app/api/notes/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Note Deleted");

        getNotes();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Delete Failed");
    }
  };



  /* =========================================
      SEARCH FILTER
  ========================================= */

  const filteredNotes = notes.filter((item) => {
    const title = item?.title || "";
    const category = item?.category || "";
    const slug = item?.slug || "";

    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase()) ||
      slug.toLowerCase().includes(search.toLowerCase())
    );
  });



  useEffect(() => {
    getNotes();
  }, []);



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
      
          width : "80%",
          margin : "30px auto",
          padding: "30px",
        }}
      >
        {/* ====================================
              TOP SECTION
        ==================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#111827",
                marginBottom: "5px",
              }}
            >
              All Notes
            </h1>

            <p
              style={{
                color: "#6b7280",
                fontSize: "15px",
              }}
            >
              Manage all your notes easily
            </p>
          </div>



          <Link
            to="/add-notes"
            style={{
              background: "#111827",
              color: "white",
              padding: "13px 22px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            + Add Notes
          </Link>
        </div>



        {/* ====================================
              SEARCH
        ==================================== */}

        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Search by title, category or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
              outline: "none",
              fontSize: "15px",
              background: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          />
        </div>



        {/* ====================================
              TABLE
        ==================================== */}

        <div
          style={{
            overflowX: "auto",
            background: "white",
            borderRadius: "14px",
            padding: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          {
            loading ? (
              <div
                style={{
                  padding: "60px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Loading Notes...
              </div>
            ) : filteredNotes.length === 0 ? (
              <div
                style={{
                  padding: "60px",
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: "18px",
                }}
              >
                No Notes Found
              </div>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1000px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#111827",
                    }}
                  >
                    <th
                      style={tableHeadingStyle}
                    >
                      #
                    </th>

                    <th
                      style={tableHeadingStyle}
                    >
                      Image
                    </th>

                    <th
                      style={tableHeadingStyle}
                    >
                      Title
                    </th>

                    <th
                      style={tableHeadingStyle}
                    >
                      Category
                    </th>

                    <th
                      style={tableHeadingStyle}
                    >
                      Slug
                    </th>

                    <th
                      style={tableHeadingStyle}
                    >
                      Date
                    </th>

                    <th
                      style={tableHeadingStyle}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {
                    filteredNotes.map((item, index) => (
                      <tr
                        key={item._id}
                        style={{
                          borderBottom:
                            "1px solid #e5e7eb",
                        }}
                      >
                        <td
                          style={tableDataStyle}
                        >
                          {index + 1}
                        </td>



                        <td
                          style={tableDataStyle}
                        >
                          <img
                            src={
                              item.featuredImage
                            }
                            alt={item.title}
                            style={{
                              width: "80px",
                              height: "55px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border:
                                "1px solid #ddd",
                            }}
                          />
                        </td>



                        <td
                          style={{
                            ...tableDataStyle,
                            minWidth: "280px",
                            fontWeight: "600",
                            color: "#111827",
                          }}
                        >
                          {item.title}
                        </td>



                        <td
                          style={tableDataStyle}
                        >
                          <span
                            style={{
                              background:
                                "#dbeafe",
                              color: "#1d4ed8",
                              padding:
                                "6px 12px",
                              borderRadius:
                                "30px",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          >
                            {item.category}
                          </span>
                        </td>



                        <td
                          style={tableDataStyle}
                        >
                          <span
                            style={{
                              background:
                                "#f3f4f6",
                              padding:
                                "7px 12px",
                              borderRadius:
                                "8px",
                              fontSize: "13px",
                              color: "#374151",
                            }}
                          >
                            /{item.slug}
                          </span>
                        </td>



                        <td
                          style={tableDataStyle}
                        >
                          {
                            new Date(
                              item.createdAt
                            ).toLocaleDateString()
                          }
                        </td>



                        <td
                          style={tableDataStyle}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              flexWrap: "wrap",
                            }}
                          >
                            {/* EDIT BUTTON */}

                            <Link
                              to={`/edit/${item._id}`}
                              style={{
                                background:
                                  "#2563eb",
                                color: "white",
                                padding:
                                  "9px 14px",
                                borderRadius:
                                  "8px",
                                fontSize:
                                  "14px",
                                textDecoration:
                                  "none",
                                fontWeight:
                                  "600",
                              }}
                            >
                              Edit
                            </Link>



                            {/* DELETE BUTTON */}

                            <button
                              onClick={() =>
                                deleteNote(
                                  item._id
                                )
                              }
                              style={{
                                background:
                                  "#dc2626",
                                color: "white",
                                padding:
                                  "9px 14px",
                                borderRadius:
                                  "8px",
                                fontSize:
                                  "14px",
                                border: "none",
                                cursor:
                                  "pointer",
                                fontWeight:
                                  "600",
                              }}
                            >
                              Delete
                            </button>



                            {/* VIEW BUTTON */}

                            <a
                              href={`https://jdbinfotech.co.in/free-notes/${item.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                background:
                                  "#059669",
                                color: "white",
                                padding:
                                  "9px 14px",
                                borderRadius:
                                  "8px",
                                fontSize:
                                  "14px",
                                textDecoration:
                                  "none",
                                fontWeight:
                                  "600",
                              }}
                            >
                              View
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
  );
};



/* =========================================
    STYLES
========================================= */

const tableHeadingStyle = {
  color: "white",
  padding: "16px",
  textAlign: "left",
  fontSize: "15px",
  fontWeight: "600",
};

const tableDataStyle = {
  padding: "16px",
  fontSize: "14px",
  color: "#374151",
};



export default AllNotes;