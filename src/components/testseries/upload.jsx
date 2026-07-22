import React, {
  useState,
  useEffect,
  useCallback
} from "react";

import toast, {
  Toaster
} from "react-hot-toast";

const UploadTest = () => {
  const [testTitle, setTestTitle] =
    useState("");

  const [testDate, setTestDate] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const [questions, setQuestions] =
    useState([
      {
        question: "",
        options: [
          "",
          "",
          "",
          ""
        ],
        correctAnswer: "",
      },
    ]);

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
    const savedDraft =
      localStorage.getItem(
        "testDraft"
      );

    if (savedDraft) {
      const parsed =
        JSON.parse(
          savedDraft
        );

      setTestTitle(
        parsed.testTitle ||
          ""
      );

      setTestDate(
        parsed.testDate ||
          ""
      );

      setQuestions(
        parsed.questions ||
          [
            {
              question:
                "",
              options:
                [
                  "",
                  "",
                  "",
                  "",
                ],
              correctAnswer:
                "",
            },
          ]
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "testDraft",
      JSON.stringify({
        testTitle,
        testDate,
        questions,
      })
    );
  }, [
    testTitle,
    testDate,
    questions
  ]);

  const handleQuestionChange =
    useCallback(
      (
        index,
        value
      ) => {
        setQuestions(
          (
            prev
          ) => {
            const updated =
              [
                ...prev,
              ];

            updated[
              index
            ].question =
              value;

            return updated;
          }
        );
      },
      []
    );

  const handleOptionChange =
    useCallback(
      (
        qIndex,
        oIndex,
        value
      ) => {
        setQuestions(
          (
            prev
          ) => {
            const updated =
              [
                ...prev,
              ];

            updated[
              qIndex
            ].options[
              oIndex
            ] = value;

            return updated;
          }
        );
      },
      []
    );

  const handleCorrectAnswerChange =
    useCallback(
      (
        index,
        value
      ) => {
        setQuestions(
          (
            prev
          ) => {
            const updated =
              [
                ...prev,
              ];

            updated[
              index
            ].correctAnswer =
              value;

            return updated;
          }
        );
      },
      []
    );

  const addQuestion =
    useCallback(
      () => {
        setQuestions(
          (
            prev
          ) => [
            ...prev,
            {
              question:
                "",
              options:
                [
                  "",
                  "",
                  "",
                  "",
                ],
              correctAnswer:
                "",
            },
          ]
        );
      },
      []
    );

  const removeQuestion =
    useCallback(
      (
        index
      ) => {
        setQuestions(
          (
            prev
          ) =>
            prev.filter(
              (
                _,
                i
              ) =>
                i !==
                index
            )
        );
      },
      []
    );

  const handleSubmit =
    useCallback(
      async () => {
        if (
          !testTitle ||
          !testDate ||
          questions.some(
            (
              q
            ) =>
              !q.question ||
              q.options.includes(
                ""
              ) ||
              !q.correctAnswer
          )
        ) {
          toast.error(
            "Please fill all fields"
          );

          return;
        }

        const testData =
          {
            title:
              testTitle,
            startDateTime:
              new Date(
                testDate
              ).toISOString(),
            questions,
          };

        try {
          setUploading(
            true
          );

          const res =
            await fetch(
              "https://dgrnode.vercel.app/create-test",
              {
                method:
                  "POST",
                headers,
                body: JSON.stringify(
                  testData
                ),
              }
            );

          const result =
            await res.json();

          if (
            res.ok
          ) {
            toast.success(
              "Test uploaded successfully"
            );

            localStorage.removeItem(
              "testDraft"
            );

            setTestTitle(
              ""
            );

            setTestDate(
              ""
            );

            setQuestions(
              [
                {
                  question:
                    "",
                  options:
                    [
                      "",
                      "",
                      "",
                      "",
                    ],
                  correctAnswer:
                    "",
                },
              ]
            );
          } else {
            toast.error(
              result.message ||
                "Upload failed"
            );
          }
        } catch (
          error
        ) {
          console.error(
            error
          );

          toast.error(
            "Server error"
          );
        } finally {
          setUploading(
            false
          );
        }
      },
      [
        testTitle,
        testDate,
        questions
      ]
    );

  return (
    <>
      <style>{`
        *{
          box-sizing:border-box;
          font-family:"Poppins",sans-serif;
        }

        .upload-wrapper{
          width:100%;
          max-width:900px;
          margin:auto;
          padding:20px;
        }

        .upload-card{
          background:white;
          border-radius:24px;
          box-shadow:0 10px 35px rgba(0,0,0,.08);
          padding:25px;
        }

        .page-title{
          margin:0 0 25px 0;
          text-align:center;
          font-size:28px;
          font-weight:800;
          color:#0f172a;
        }

        .main-input{
          width:100%;
          border:1px solid #e2e8f0;
          border-radius:14px;
          padding:14px;
          margin-bottom:15px;
          outline:none;
          background:#f8fafc;
        }

        .question-card{
          margin-top:20px;
          border:1px solid #edf2f7;
          border-radius:20px;
          padding:20px;
          background:#f8fafc;
        }

        .question-title{
          margin:0 0 15px 0;
          font-size:18px;
          font-weight:700;
          color:#0f172a;
        }

        .btn-row{
          display:flex;
          gap:12px;
          margin-top:20px;
          flex-wrap:wrap;
        }

        .btn{
          border:none;
          padding:14px 22px;
          border-radius:14px;
          cursor:pointer;
          color:white;
          font-weight:700;
          font-size:14px;
        }

        .add-btn{
          background:#2563eb;
        }

        .remove-btn{
          background:#ef4444;
        }

        .upload-btn{
          background:#16a34a;
        }

        @media(max-width:768px){
          .upload-wrapper{
            padding:12px;
          }

          .page-title{
            font-size:22px;
          }

          .btn{
            width:100%;
          }
        }

      `}</style>

      <Toaster />

      <div className="upload-wrapper">

        <div className="upload-card">

          <h2 className="page-title">
            Upload Weekly Test
          </h2>

          <input
            className="main-input"
            type="text"
            placeholder="Test Title"
            value={testTitle}
            onChange={(e) =>
              setTestTitle(
                e.target.value
              )
            }
          />

          <input
            className="main-input"
            type="datetime-local"
            value={testDate}
            onChange={(e) =>
              setTestDate(
                e.target.value
              )
            }
          />

          {questions.map(
            (
              q,
              i
            ) => (
              <div
                key={i}
                className="question-card"
              >

                <h3 className="question-title">
                  Question{" "}
                  {i + 1}
                </h3>

                <input
                  className="main-input"
                  placeholder="Enter question"
                  value={
                    q.question
                  }
                  onChange={(e) =>
                    handleQuestionChange(
                      i,
                      e.target
                        .value
                    )
                  }
                />

                {q.options.map(
                  (
                    opt,
                    j
                  ) => (
                    <input
                      key={j}
                      className="main-input"
                      placeholder={`Option ${j + 1}`}
                      value={
                        opt
                      }
                      onChange={(e) =>
                        handleOptionChange(
                          i,
                          j,
                          e.target
                            .value
                        )
                      }
                    />
                  )
                )}

                <input
                  className="main-input"
                  placeholder="Correct Answer"
                  value={
                    q.correctAnswer
                  }
                  onChange={(e) =>
                    handleCorrectAnswerChange(
                      i,
                      e.target
                        .value
                    )
                  }
                />

                {questions.length >
                  1 && (
                  <button
                    className="btn remove-btn"
                    onClick={() =>
                      removeQuestion(
                        i
                      )
                    }
                  >
                    Remove Question
                  </button>
                )}

              </div>
            )
          )}

          <div className="btn-row">

            <button
              className="btn add-btn"
              onClick={
                addQuestion
              }
            >
              Add Question
            </button>

            <button
              className="btn upload-btn"
              disabled={
                uploading
              }
              onClick={
                handleSubmit
              }
            >
              {uploading
                ? "Uploading..."
                : "Upload Test"}
            </button>

          </div>

        </div>

      </div>
    </>
  );
};

export default UploadTest;