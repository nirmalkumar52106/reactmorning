import React, {
  useEffect,
  useState,
  useCallback
} from "react";

function AddEditStaff({
  staff,
  onDone
}) {
  const [form, setForm] =
    useState({
      name: "",
      mobile: "",
      grade: "A",
      performance:
        "Excellent",
      baseSalary: "",
      isActive: true,
      password: "",
    });

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (staff) {
      setForm({
        ...staff,
        password: "",
      });
    }
  }, [staff]);

  const tokennn =
    localStorage.getItem(
      "token"
    );

  const headers = {
    "Content-Type":
      "application/json",
    Authorization: `Bearer ${tokennn}`,
  };

  const updateField =
    useCallback(
      (field, value) => {
        setForm((prev) => ({
          ...prev,
          [field]: value,
        }));
      },
      []
    );

  const submit =
    useCallback(
      async () => {
        if (
          !staff &&
          !form.password.trim()
        ) {
          alert(
            "Password required!"
          );
          return;
        }

        try {
          setSaving(true);

          const url = staff
            ? `https://dgrnode.vercel.app/api/staff/${staff._id}`
            : "https://dgrnode.vercel.app/api/staff/add";

          const payload =
            {
              ...form,
            };

          // Add mode me grade send mat karo
          if (!staff) {
            delete payload.grade;
          }

          // Edit mode me blank password send mat karo
          if (
            staff &&
            !form.password.trim()
          ) {
            delete payload.password;
          }

          await fetch(
            url,
            {
              method:
                staff
                  ? "PUT"
                  : "POST",
              headers,
              body: JSON.stringify(
                payload
              ),
            }
          );

          onDone();

        } catch (error) {
          console.log(
            error
          );
        } finally {
          setSaving(false);
        }
      },
      [
        form,
        staff,
        onDone
      ]
    );

  return (
    <>
      <style>{`
        *{
          box-sizing:border-box;
          font-family:"Poppins", sans-serif;
        }

        .staff-form-wrapper{
          width:100%;
          max-width:700px;
          margin:25px auto;
          background:white;
          border-radius:24px;
          box-shadow:0 12px 35px rgba(0,0,0,.08);
          overflow:hidden;
        }

        .form-header{
          background:linear-gradient(90deg,#2563eb,#7c3aed);
          color:white;
          padding:25px;
        }

        .form-title{
          margin:0;
          font-size:26px;
          font-weight:800;
        }

        .form-body{
          padding:25px;
        }

        .form-grid{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:18px;
        }

        .full-width{
          grid-column:1/-1;
        }

        .field-box{
          display:flex;
          flex-direction:column;
          gap:8px;
        }

        .field-label{
          font-size:14px;
          font-weight:600;
          color:#334155;
        }

        .field-input{
          width:100%;
          border:1px solid #dbe2ea;
          outline:none;
          border-radius:14px;
          padding:14px;
          font-size:14px;
          background:#f8fafc;
        }

        .field-input:focus{
          border-color:#2563eb;
          background:white;
          box-shadow:0 0 0 3px rgba(37,99,235,.08);
        }

        .save-btn{
          width:100%;
          margin-top:25px;
          border:none;
          background:linear-gradient(90deg,#2563eb,#7c3aed);
          color:white;
          padding:15px;
          border-radius:14px;
          font-size:15px;
          font-weight:700;
          cursor:pointer;
        }

        .save-btn:disabled{
          opacity:.7;
          cursor:not-allowed;
        }

        @media(max-width:768px){
          .form-grid{
            grid-template-columns:1fr;
          }
        }

      `}</style>

      <div className="staff-form-wrapper">

        <div className="form-header">
          <h3 className="form-title">
            {staff
              ? "Edit Staff"
              : "Add Staff"}
          </h3>
        </div>

        <div className="form-body">

          <div className="form-grid">

            <div className="field-box">
              <label className="field-label">
                Full Name
              </label>

              <input
                className="field-input"
                placeholder="Enter name"
                value={
                  form.name
                }
                onChange={(
                  e
                ) =>
                  updateField(
                    "name",
                    e.target
                      .value
                  )
                }
              />
            </div>

            <div className="field-box">
              <label className="field-label">
                Mobile Number
              </label>

              <input
                className="field-input"
                placeholder="Enter mobile"
                value={
                  form.mobile
                }
                onChange={(
                  e
                ) =>
                  updateField(
                    "mobile",
                    e.target
                      .value
                  )
                }
              />
            </div>

            {/* Password add + edit dono me */}
            <div className="field-box full-width">
              <label className="field-label">
                Password
              </label>

              <input
                type="password"
                className="field-input"
                placeholder={
                  staff
                    ? "New Password (optional)"
                    : "Enter password"
                }
                value={
                  form.password
                }
                onChange={(
                  e
                ) =>
                  updateField(
                    "password",
                    e.target
                      .value
                  )
                }
              />
            </div>

            {/* Grade sirf edit me */}
            {staff && (
              <div className="field-box">
                <label className="field-label">
                  Grade
                </label>

                <select
                  className="field-input"
                  value={
                    form.grade
                  }
                  onChange={(
                    e
                  ) =>
                    updateField(
                      "grade",
                      e.target
                        .value
                    )
                  }
                >
                  <option value="A">
                    Grade A
                  </option>

                  <option value="B">
                    Grade B
                  </option>

                  <option value="C">
                    Grade C
                  </option>
                </select>
              </div>
            )}

            <div className="field-box">
              <label className="field-label">
                Performance
              </label>

              <select
                className="field-input"
                value={
                  form.performance
                }
                onChange={(
                  e
                ) =>
                  updateField(
                    "performance",
                    e.target
                      .value
                  )
                }
              >
                <option value="Excellent">
                  Excellent
                </option>
                <option value="Good">
                  Good
                </option>
                <option value="Average">
                  Average
                </option>
                <option value="Poor">
                  Poor
                </option>
              </select>
            </div>

            <div className="field-box">
              <label className="field-label">
                Base Salary
              </label>

              <input
                type="number"
                className="field-input"
                placeholder="Enter salary"
                value={
                  form.baseSalary
                }
                onChange={(
                  e
                ) =>
                  updateField(
                    "baseSalary",
                    e.target
                      .value
                  )
                }
              />
            </div>

            <div className="field-box">
              <label className="field-label">
                Status
              </label>

              <select
                className="field-input"
                value={
                  form.isActive
                }
                onChange={(
                  e
                ) =>
                  updateField(
                    "isActive",
                    e.target
                      .value ===
                      "true"
                  )
                }
              >
                <option value="true">
                  Active
                </option>
                <option value="false">
                  Inactive
                </option>
              </select>
            </div>

          </div>

          <button
            className="save-btn"
            disabled={
              saving
            }
            onClick={
              submit
            }
          >
            {saving
              ? "Saving..."
              : "Save Staff"}
          </button>

        </div>

      </div>
    </>
  );
}

export default AddEditStaff;