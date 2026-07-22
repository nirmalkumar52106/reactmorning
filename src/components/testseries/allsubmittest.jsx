import React, {
  useEffect,
  useState,
  useMemo
} from "react";

const AdminTestSubmissions = ({
  testId,
  searchStudent = ""
}) => {
  const [submissions, setSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [open, setOpen] =
    useState(true);

  const tokennn =
    localStorage.getItem(
      "token"
    );

  const headers = {
    "Content-Type":
      "application/json",
    "Access-Control-Allow-Headers":
      "Content-Type",
    Authorization: `Bearer ${tokennn}`,
  };

  useEffect(() => {
    const loadSubmissions =
      async () => {
        try {
          setLoading(
            true
          );

          const res =
            await fetch(
              `https://dgrnode.vercel.app/test/${testId}`,
              {
                headers,
              }
            );

          const data =
            await res.json();

          setSubmissions(
            data || []
          );
        } catch (err) {
          console.error(
            err
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    loadSubmissions();
  }, [testId]);

  const filteredSubmissions =
    useMemo(() => {
      return submissions.filter(
        (item) =>
          item.studentId
            ?.toLowerCase()
            .includes(
              searchStudent.toLowerCase()
            )
      );
    }, [
      submissions,
      searchStudent
    ]);

  return (
    <>
      <style>{`
        *{
          box-sizing:border-box;
          font-family:"Poppins",sans-serif;
        }

        .toggle-btn{
          min-width:140px;
          height:44px;
          border:none;
          border-radius:12px;
          cursor:pointer;
          color:white;
          font-weight:700;
          font-size:14px;
        }

        .open-btn{
          background:#16a34a;
        }

        .close-btn{
          background:#ef4444;
        }

        .result-panel{
          width:100%;
          margin-top:18px;
          background:#ffffff;
          border-radius:20px;
          box-shadow:0 10px 30px rgba(0,0,0,.08);
          padding:20px;
          overflow:auto;
        }

        .result-title{
          margin:0 0 18px 0;
          font-size:22px;
          font-weight:800;
          color:#0f172a;
        }

        .table-wrap{
          overflow:auto;
        }

        .result-table{
          width:100%;
          min-width:650px;
          border-collapse:collapse;
        }

        .result-table thead{
          background:#0f172a;
          color:white;
        }

        .result-table th{
          padding:16px;
          text-align:left;
          font-size:14px;
        }

        .result-table td{
          padding:16px;
          border-bottom:1px solid #edf2f7;
          font-size:14px;
          color:#334155;
        }

        .top-rank{
          background:#f0fdf4;
        }

        .rank-badge{
          display:inline-block;
          padding:6px 12px;
          border-radius:30px;
          background:#dcfce7;
          color:#166534;
          font-size:12px;
          font-weight:700;
        }

        .empty-box,
        .loading-box{
          text-align:center;
          padding:30px;
          color:#64748b;
          font-weight:600;
        }

        @media(max-width:768px){

          .result-panel{
            padding:12px;
          }

          .result-title{
            font-size:18px;
          }

        }

      `}</style>

      <button
        className={`toggle-btn ${
          open
            ? "open-btn"
            : "close-btn"
        }`}
        onClick={() =>
          setOpen(
            !open
          )
        }
      >
        {open
          ? "Student Result"
          : "Close Result"}
      </button>

      {!open && (
        <div className="result-panel">

          <h2 className="result-title">
            Student Test Results
          </h2>

          {loading ? (
            <div className="loading-box">
              Loading submissions...
            </div>
          ) : filteredSubmissions.length ===
            0 ? (
            <div className="empty-box">
              No submissions found
            </div>
          ) : (
            <div className="table-wrap">

              <table className="result-table">

                <thead>
                  <tr>
                    <th>
                      Student ID
                    </th>

                    <th>
                      Score
                    </th>

                    <th>
                      Rank
                    </th>

                    <th>
                      Submitted At
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredSubmissions.map(
                    (
                      sub,
                      index
                    ) => (
                      <tr
                        key={
                          index
                        }
                        className={
                          index <
                          3
                            ? "top-rank"
                            : ""
                        }
                      >

                        <td>
                          {
                            sub.studentId
                          }
                        </td>

                        <td>
                          {
                            sub.score
                          }
                        </td>

                        <td>
                          {index <
                          3 ? (
                            <span className="rank-badge">
                              Top{" "}
                              {index +
                                1}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td>
                          {new Date(
                            sub.submittedAt
                          ).toLocaleString()}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>
      )}
    </>
  );
};

export default AdminTestSubmissions;