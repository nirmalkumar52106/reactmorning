import React, {
  useEffect,
  useState,
  useMemo,
  useCallback
} from "react";

function StaffTable({ onView, onEdit }) {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const tokennn = localStorage.getItem("token");

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokennn}`,
    }),
    [tokennn]
  );

  const loadStaff = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://dgrnode.vercel.app/api/staff",
        { headers }
      );

      const data = await res.json();

      setStaff(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const deleteStaff = useCallback(
    async (id) => {
      if (!window.confirm("Delete this staff?")) return;

      try {
        await fetch(
          `https://dgrnode.vercel.app/api/staff/${id}`,
          {
            method: "DELETE",
            headers,
          }
        );

        loadStaff();
      } catch (error) {
        console.log(error);
      }
    },
    [headers, loadStaff]
  );

  const filteredStaff = useMemo(() => {
    return staff.filter((item) =>
      item.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [staff, searchTerm]);

  return (
    <>
      <style>{`
        *{
          box-sizing:border-box;
          font-family: "Poppins", sans-serif;
        }

        .staff-main{
          width:100%;
          padding:25px;
          background:#f8fafc;
          border-radius:25px;
        }

        .top-section{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:20px;
          margin-bottom:25px;
          flex-wrap:wrap;
        }

        .page-title{
          margin:0;
          font-size:32px;
          font-weight:800;
          background:linear-gradient(90deg,#2563eb,#7c3aed);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }

        .search-wrapper{
          position:relative;
          min-width:320px;
          max-width:420px;
          flex:1;
        }

        .search-input{
          width:100%;
          border:none;
          outline:none;
          padding:16px 20px 16px 55px;
          border-radius:18px;
          font-size:15px;
          background:rgba(255,255,255,.9);
          box-shadow:0 8px 30px rgba(0,0,0,.08);
          transition:.3s;
        }

        .search-input:focus{
          box-shadow:0 10px 35px rgba(37,99,235,.15);
        }

        .search-icon{
          position:absolute;
          left:20px;
          top:50%;
          transform:translateY(-50%);
          font-size:18px;
        }

        .table-box{
          background:white;
          border-radius:22px;
          overflow:hidden;
          box-shadow:0 10px 35px rgba(0,0,0,.08);
        }

        .table-scroll{
          overflow-x:auto;
        }

        .staff-table{
          width:100%;
          border-collapse:collapse;
          min-width:1000px;
        }

        .staff-table thead{
          background:linear-gradient(90deg,#111827,#1e293b);
        }

        .staff-table th{
          color:white;
          padding:20px;
          text-align:left;
          font-size:14px;
          font-weight:600;
        }

        .staff-table td{
          padding:18px 20px;
          border-bottom:1px solid #eef2f7;
          font-size:14px;
          color:#334155;
        }

        .staff-table tbody tr:hover{
          background:#f8fafc;
        }

        .staff-name{
          font-weight:700;
          color:#1e293b;
        }

        .status-badge{
          display:inline-block;
          padding:8px 14px;
          border-radius:50px;
          font-size:12px;
          font-weight:700;
        }

        .status-active{
          background:#dcfce7;
          color:#15803d;
        }

        .status-inactive{
          background:#fee2e2;
          color:#dc2626;
        }

        .action-box{
          display:flex;
          gap:8px;
          flex-wrap:wrap;
        }

        .btn{
          border:none;
          cursor:pointer;
          padding:10px 14px;
          border-radius:10px;
          font-size:12px;
          font-weight:700;
          color:white;
          transition:.3s;
        }

        .view-btn{
          background:linear-gradient(90deg,#8b5cf6,#7c3aed);
        }

        .edit-btn{
          background:linear-gradient(90deg,#2563eb,#1d4ed8);
        }

        .delete-btn{
          background:linear-gradient(90deg,#ef4444,#dc2626);
        }

        .btn:hover{
          transform:translateY(-2px);
        }

        .loading-state,
        .empty-state{
          padding:50px;
          text-align:center;
          font-weight:600;
          color:#64748b;
        }

        @media(max-width:768px){
          .staff-main{
            padding:15px;
          }

          .page-title{
            font-size:24px;
          }

          .search-wrapper{
            min-width:100%;
          }
        }
      `}</style>

      <div className="staff-main">

        <div className="top-section">


          <div className="search-wrapper">

          

            <input
              type="text"
              className="search-input"
              placeholder="Search staff by name..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

        </div>

        <div className="table-box">

          {loading ? (
            <div className="loading-state">
              Loading staff data...
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="empty-state">
              No staff found
            </div>
          ) : (

            <div className="table-scroll">

              <table className="staff-table">

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Password</th>
                    <th>Status</th>
                    <th>Grade</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredStaff.map((s) => (
                    <tr key={s._id}>

                      <td className="staff-name">
                        {s.name}
                      </td>

                      <td>{s.mobile}</td>

                      <td>{s.password}</td>

                      <td>
                        <span
                          className={`status-badge ${
                            s.isActive
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >
                          {s.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>{s.grade}</td>

                      <td>
                        <div className="action-box">

                          <button
                            className="btn view-btn"
                            onClick={() => onView(s)}
                          >
                            Attendence & Sallary
                          </button>

                          <button
                            className="btn edit-btn"
                            onClick={() => onEdit(s)}
                          >
                            Edit Staff
                          </button>

                          <button
                            className="btn delete-btn"
                            onClick={() =>
                              deleteStaff(s._id)
                            }
                          >
                            Remove Staff
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </>
  );
}

export default StaffTable;