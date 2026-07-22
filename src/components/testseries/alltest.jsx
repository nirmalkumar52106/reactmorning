import React, {
  useEffect,
  useState,
  useMemo,
  useCallback
} from "react";

import EditTestForm from "./edittest";
import AdminTestSubmissions from "./allsubmittest";

const TestList = () => {
  const [tests, setTests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [studentSearch, setStudentSearch] =
    useState("");

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

  const fetchTests =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const res =
            await fetch(
              "https://dgrnode.vercel.app/tests"
            );

          const data =
            await res.json();

          setTests(
            data.tests || []
          );
        } catch (error) {
          console.error(
            error
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  const deleteTest =
    useCallback(
      async (id) => {
        if (
          !window.confirm(
            "Delete this test?"
          )
        ) {
          return;
        }

        try {
          await fetch(
            `https://dgrnode.vercel.app/tests/${id}`,
            {
              method:
                "DELETE",
              headers,
            }
          );

          fetchTests();
        } catch (error) {
          console.error(
            error
          );
        }
      },
      [
        fetchTests
      ]
    );

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const filteredTests =
    useMemo(() => {
      return tests.filter(
        (item) =>
          item.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [
      tests,
      search
    ]);

  return (
    <>
      <style>{`
        *{
          box-sizing:border-box;
          font-family:"Poppins",sans-serif;
        }

        .test-wrapper{
          width:100%;
          padding:20px;
        }

        .heading-row{
          display:flex;
          justify-content:space-between;
          align-items:center;
          flex-wrap:wrap;
          gap:15px;
          margin-bottom:20px;
        }

        .page-title{
          margin:0;
          font-size:28px;
          font-weight:800;
          color:#0f172a;
        }

        .search-input{
          width:320px;
          max-width:100%;
          border:none;
          outline:none;
          padding:14px 18px;
          border-radius:14px;
          box-shadow:0 8px 25px rgba(0,0,0,.08);
          font-size:14px;
        }

        .test-grid{
          display:grid;
          gap:18px;
        }

        .test-card{
          background:white;
          border-radius:22px;
          box-shadow:0 8px 30px rgba(0,0,0,.07);
          padding:22px;
          border:1px solid #eef2f7;
        }

        .card-top{
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          gap:20px;
          flex-wrap:wrap;
          margin-bottom:20px;
        }

        .test-title{
          margin:0 0 8px 0;
          font-size:22px;
          font-weight:800;
          color:#0f172a;
        }

        .test-info{
          color:#64748b;
          font-size:14px;
          font-weight:500;
          line-height:1.7;
        }

        .question-box{
          background:#eff6ff;
          color:#2563eb;
          padding:10px 16px;
          border-radius:14px;
          font-size:14px;
          font-weight:700;
          white-space:nowrap;
        }

        .student-search{
          width:280px;
          max-width:100%;
          border:none;
          outline:none;
          background:#f8fafc;
          border:1px solid #e2e8f0;
          border-radius:12px;
          padding:12px 15px;
          margin-bottom:18px;
        }

        .action-row{
          display:flex;
          align-items:center;
          gap:12px;
          flex-wrap:wrap;
        }

        .action-btn{
          min-width:130px;
          height:44px;
          display:flex;
          align-items:center;
          justify-content:center;
          border:none;
          border-radius:12px;
          cursor:pointer;
          font-size:14px;
          font-weight:700;
          transition:.3s;
        }

        .delete-btn{
          background:#ef4444;
          color:white;
        }

        .delete-btn:hover{
          transform:translateY(-2px);
        }

        .loading-box,
        .empty-box{
          text-align:center;
          padding:50px;
          color:#64748b;
          font-weight:600;
        }

        @media(max-width:768px){

          .test-wrapper{
            padding:12px;
          }

          .page-title{
            font-size:22px;
          }

          .action-row{
            flex-direction:column;
            align-items:stretch;
          }

          .action-btn{
            width:100%;
          }

          .student-search{
            width:100%;
          }

        }

      `}</style>

      <div className="test-wrapper">

        <div className="heading-row">

          <h2 className="page-title">
            Weekly Tests
          </h2>

          <input
            className="search-input"
            placeholder="Search test by title..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        {loading ? (
          <div className="loading-box">
            Loading tests...
          </div>
        ) : filteredTests.length ===
          0 ? (
          <div className="empty-box">
            No tests found
          </div>
        ) : (
          <div className="test-grid">

            {filteredTests.map(
              (test) => (
                <div
                  key={
                    test._id
                  }
                  className="test-card"
                >

                  <div className="card-top">

                    <div>

                      <h3 className="test-title">
                        {
                          test.title
                        }
                      </h3>

                      <div className="test-info">
                        Start:{" "}
                        {new Date(
                          test.startDateTime
                        ).toLocaleString()}
                      </div>

                    </div>

                    <div className="question-box">
                      {
                        test
                          .questions
                          .length
                      } Questions
                    </div>

                  </div>

                  <input
                    className="student-search"
                    placeholder="Search student in submissions..."
                    value={
                      studentSearch
                    }
                    onChange={(
                      e
                    ) =>
                      setStudentSearch(
                        e.target
                          .value
                      )
                    }
                  />

                  <div className="action-row">

                    <EditTestForm
                      testId={
                        test._id
                      }
                    />

                    <button
                      className="action-btn delete-btn"
                      onClick={() =>
                        deleteTest(
                          test._id
                        )
                      }
                    >
                      Delete Test
                    </button>

                    <AdminTestSubmissions
                      testId={
                        test._id
                      }
                      searchStudent={
                        studentSearch
                      }
                    />

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>
    </>
  );
};

export { TestList };