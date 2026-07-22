import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SidebarHeader } from "../sidebarheader";

const API_URL = "https://dgrnode.vercel.app";

const initialForm = {
  name: "",
  package: "",
  designation: "",
  company: "",
  description: "",
  location: "",
  batch: "",
  skills: "",
  achievement: "",
  displayOrder: 0,
  isActive: true,
};

function PlacementAdmin() {
  const [placements, setPlacements] = useState([]);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [formData, setFormData] = useState(initialForm);

  const [selectedImage, setSelectedImage] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  const [editingPlacement, setEditingPlacement] = useState(null);

  const [selectedPlacement, setSelectedPlacement] = useState(null);

  const [deletePlacementData, setDeletePlacementData] = useState(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [sortBy, setSortBy] = useState("latest");

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(8);

  const [loading, setLoading] = useState(false);

  const [formLoading, setFormLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [statusLoadingId, setStatusLoadingId] = useState("");

  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });




  const token =
    localStorage.getItem("admintoken") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token");

  const showNotification = (type, message) => {
    setNotification({
      type,
      message,
    });

    window.setTimeout(() => {
      setNotification({
        type: "",
        message: "",
      });
    }, 3500);
  };

  const getAuthHeaders = () => {
    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchPlacements = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/allplacements`, {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to fetch placements");
      }

      setPlacements(Array.isArray(result) ? result : result.placements || []);
    } catch (error) {
      console.error("Placement fetch error:", error);

      showNotification(
        "error",
        error.message || "Placements load nahi ho paaye",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPlacements();
  }, [fetchPlacements]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortBy, itemsPerPage]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const filteredPlacements = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    let data = placements.filter((student) => {
      const matchesSearch =
        !normalizedSearch ||
        student.name?.toLowerCase().includes(normalizedSearch) ||
        student.company?.toLowerCase().includes(normalizedSearch) ||
        student.designation?.toLowerCase().includes(normalizedSearch) ||
        student.location?.toLowerCase().includes(normalizedSearch) ||
        student.batch?.toLowerCase().includes(normalizedSearch) ||
        student.skills?.some((skill) =>
          String(skill).toLowerCase().includes(normalizedSearch),
        );

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && student.isActive) ||
        (statusFilter === "inactive" && !student.isActive);

      return matchesSearch && matchesStatus;
    });

    data = [...data].sort((a, b) => {
      if (sortBy === "name-asc") {
        return String(a.name).localeCompare(String(b.name));
      }

      if (sortBy === "name-desc") {
        return String(b.name).localeCompare(String(a.name));
      }

      if (sortBy === "order") {
        return Number(a.displayOrder || 0) - Number(b.displayOrder || 0);
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return data;
  }, [placements, search, statusFilter, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPlacements.length / itemsPerPage),
  );

  const paginatedPlacements = useMemo(() => {
    const startingIndex = (currentPage - 1) * itemsPerPage;

    return filteredPlacements.slice(
      startingIndex,
      startingIndex + itemsPerPage,
    );
  }, [filteredPlacements, currentPage, itemsPerPage]);

  const activePlacements = placements.filter(
    (student) => student.isActive,
  ).length;

  const inactivePlacements = placements.length - activePlacements;

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedImageTypes.includes(file.type)) {
      showNotification(
        "error",
        "Only JPG, JPEG, PNG aur WEBP image allowed hai",
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification("error", "Image size 5MB se kam honi chahiye");

      event.target.value = "";
      return;
    }

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(file);

    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormData(initialForm);
    setSelectedImage(null);
    setImagePreview("");
    setEditingPlacement(null);

    const fileInput = document.getElementById("placement-image-input");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const openAddPlacementModal = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    if (formLoading) return;

    resetForm();
    setIsFormModalOpen(false);
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "package",
      "designation",
      "company",
      "description",
      "location",
      "batch",
      "achievement",
    ];

    const emptyField = requiredFields.find(
      (field) => !String(formData[field] || "").trim(),
    );

    if (emptyField) {
      showNotification("error", "Please fill all required fields");

      return false;
    }

    if (!editingPlacement && !selectedImage) {
      showNotification("error", "Student image select karein");

      return false;
    }

    return true;
  };

  const createPlacementFormData = () => {
    const data = new FormData();

    data.append("name", formData.name.trim());

    data.append("package", formData.package.trim());

    data.append("designation", formData.designation.trim());

    data.append("company", formData.company.trim());

    data.append("description", formData.description.trim());

    data.append("location", formData.location.trim());

    data.append("batch", formData.batch.trim());

    data.append("skills", formData.skills.trim());

    data.append("achievement", formData.achievement.trim());

    data.append("displayOrder", String(formData.displayOrder || 0));

    data.append("isActive", String(formData.isActive));

    if (selectedImage) {
      data.append("image", selectedImage);
    }

    return data;
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const isEditing = Boolean(editingPlacement);

  const placementId =
    editingPlacement?._id ||
    editingPlacement?.id;

  if (isEditing && !placementId) {
    showNotification(
      "error",
      "Placement ID missing hai."
    );
    return;
  }

  const token =
    localStorage.getItem("admintoken") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token");

  if (!token) {
    showNotification(
      "error",
      "Login session expire ho gayi hai. Please login again."
    );
    return;
  }

  const endpoint = isEditing
    ? `${API_URL}/updateplacement/${placementId}`
    : `${API_URL}/addplacement`;

  try {
    setFormLoading(true);

    const response = await fetch(endpoint, {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: createPlacementFormData(),
    });

    const contentType =
      response.headers.get("content-type") || "";

    let result = {};

    if (contentType.includes("application/json")) {
      result = await response.json();
    } else {
      const responseText = await response.text();

      result = {
        message:
          responseText ||
          `Server response invalid hai. Status: ${response.status}`,
      };
    }

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("admintoken");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("token");
      }

      throw new Error(
        result.message ||
          `Request failed with status ${response.status}`
      );
    }

    showNotification(
      "success",
      result.message ||
        (isEditing
          ? "Placement updated successfully"
          : "Placement added successfully")
    );

    setIsFormModalOpen(false);
    resetForm();

    // Refresh ko main save request se separate rakha hai
    try {
      await fetchPlacements();
    } catch (refreshError) {
      console.error(
        "Placements refresh error:",
        refreshError
      );
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } catch (error) {
    console.error(
      "Placement submit error:",
      error
    );

    /*
      Image/database update ho sakta hai,
      lekin backend response connection fail
      hone se browser Failed to fetch dikha sakta hai.
    */
    if (
      isEditing &&
      (
        error.message === "Failed to fetch" ||
        error instanceof TypeError
      )
    ) {
      try {
        const verifyResponse = await fetch(
          `${API_URL}/allplacements`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (verifyResponse.ok) {
          const verifyResult =
            await verifyResponse.json();

          const latestPlacements =
            Array.isArray(verifyResult)
              ? verifyResult
              : verifyResult.placements ||
                verifyResult.data ||
                [];

          setPlacements(latestPlacements);

          const updatedPlacement =
            latestPlacements.find(
              (placement) =>
                placement._id === placementId
            );

          if (updatedPlacement) {
            showNotification(
              "success",
              "Placement updated successfully"
            );

            setIsFormModalOpen(false);
            resetForm();

            return;
          }
        }
      } catch (verifyError) {
        console.error(
          "Placement verification error:",
          verifyError
        );
      }
    }

    showNotification(
      "error",
      error.message ||
        "Placement not saved"
    );
  } finally {
    setFormLoading(false);
  }
};


// const handleSubmit = async (event) => {
//   event.preventDefault();

//   try {
//     setFormLoading(true);

//     const placementFormData = new FormData();

//     placementFormData.append("name", formData.name);
//     placementFormData.append("package", formData.package);
//     placementFormData.append(
//       "designation",
//       formData.designation
//     );
//     placementFormData.append(
//       "company",
//       formData.company
//     );
//     placementFormData.append(
//       "description",
//       formData.description
//     );
//     placementFormData.append(
//       "location",
//       formData.location
//     );
//     placementFormData.append(
//       "batch",
//       formData.batch
//     );
//     placementFormData.append(
//       "skills",
//       formData.skills
//     );
//     placementFormData.append(
//       "achievement",
//       formData.achievement
//     );
//     placementFormData.append(
//       "displayOrder",
//       formData.displayOrder
//     );
//     placementFormData.append(
//       "isActive",
//       formData.isActive
//     );

//     if (selectedImage) {
//       placementFormData.append(
//         "image",
//         selectedImage
//       );
//     }

//     const isEditing = Boolean(editingPlacement);

//     const placementId =
//       editingPlacement?._id ||
//       editingPlacement?.id;

//     const apiUrl = isEditing
//       ? `https://dgrnode.vercel.app/updateplacement/${placementId}`
//       : "https://dgrnode.vercel.app/addplacement";

//     const response = await fetch(apiUrl, {
//       method: isEditing ? "PATCH" : "POST",

//       headers: {
//         Authorization: `Bearer ${localStorage.getItem(
//           "token"
//         )}`,
//       },

//       body: placementFormData,
//     });

//     const contentType =
//       response.headers.get("content-type");

//     let result;

//     if (
//       contentType &&
//       contentType.includes("application/json")
//     ) {
//       result = await response.json();
//     } else {
//       const responseText = await response.text();

//       console.error(
//         "Backend returned non-JSON response:",
//         responseText
//       );

//       throw new Error(
//         `Server returned an invalid response. Status: ${response.status}`
//       );
//     }

//     if (!response.ok) {
//       throw new Error(
//         result?.message ||
//           `Request failed with status ${response.status}`
//       );
//     }

//     showNotification(
//       "success",
//       result?.message ||
//         (isEditing
//           ? "Placement updated successfully."
//           : "Placement added successfully.")
//     );

//     resetForm();
//     setIsFormModalOpen(false);

//     await fetchPlacements();
//   } catch (error) {
//     console.error(
//       "Placement submit error:",
//       error
//     );

//     showNotification(
//       "error",
//       error.message ||
//         "Unable to save placement."
//     );
//   } finally {
//     setFormLoading(false);
//   }
// };


  const handleEdit = (event, student) => {
  event?.stopPropagation();

  setEditingPlacement(student);

  setFormData({
    name: student.name || "",
    package: student.package || "",
    designation: student.designation || "",
    company: student.company || "",
    description: student.description || "",
    location: student.location || "",
    batch: student.batch || "",
    skills: Array.isArray(student.skills)
      ? student.skills.join(", ")
      : student.skills || "",
    achievement: student.achievement || "",
    displayOrder: student.displayOrder || 0,
    isActive: student.isActive !== false,
  });

  setSelectedImage(null);
  setImagePreview(student.image || "");
  setSelectedPlacement(null);

  setIsFormModalOpen(true);
};

  const openStudentDetails = async (student) => {
    setSelectedPlacement(student);

    try {
      const response = await fetch(`${API_URL}/placement/${student._id}`, {
        headers: {
          ...getAuthHeaders(),
        },
      });

      const result = await response.json();

      if (response.ok) {
        setSelectedPlacement(result.placement || student);
      }
    } catch (error) {
      console.error("Single placement fetch error:", error);
    }
  };

  const handleDelete = async () => {
    if (!deletePlacementData?._id) {
      return;
    }

    try {
      setDeleteLoading(true);

      const response = await fetch(
        `${API_URL}/deleteplacement/${deletePlacementData._id}`,
        {
          method: "DELETE",
          headers: {
            ...getAuthHeaders(),
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Placement delete nahi hua");
      }

      showNotification(
        "success",
        result.message || "Placement deleted successfully",
      );

      if (selectedPlacement?._id === deletePlacementData._id) {
        setSelectedPlacement(null);
      }

      if (editingPlacement?._id === deletePlacementData._id) {
        resetForm();
      }

      setDeletePlacementData(null);

      await fetchPlacements();
    } catch (error) {
      showNotification("error", error.message || "Placement delete nahi hua");
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleStatus = async (event, student) => {
    event.stopPropagation();

    try {
      setStatusLoadingId(student._id);

      const response = await fetch(
        `${API_URL}/placementstatus/${student._id}`,
        {
          method: "PATCH",
          headers: {
            ...getAuthHeaders(),
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Status update nahi hua");
      }

      setPlacements((previous) =>
        previous.map((item) =>
          item._id === student._id
            ? result.placement || {
                ...item,
                isActive: !item.isActive,
              }
            : item,
        ),
      );

      showNotification(
        "success",
        result.message || "Status updated successfully",
      );
    } catch (error) {
      showNotification("error", error.message || "Status update nahi hua");
    } finally {
      setStatusLoadingId("");
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((previous) => Math.max(1, previous - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((previous) => Math.min(totalPages, previous + 1));
  };

  return (
    <>
      <SidebarHeader />
      <div className="placement-admin-page">
        {notification.message && (
          <div className={`placement-notification ${notification.type}`}>
            <span>{notification.type === "success" ? "✓" : "!"}</span>

            <p>{notification.message}</p>

            <button
              type="button"
              onClick={() =>
                setNotification({
                  type: "",
                  message: "",
                })
              }
            >
              ×
            </button>
          </div>
        )}

        <div className="placement-admin-header">
          <div>
            <span className="header-label">JDB Infotech Admin</span>

            <h1>Placement Management</h1>

            <p>Placement students add, update, manage.</p>
          </div>

          <div className="placement-header-actions">
            <button
              type="button"
              className="add-placement-button"
              onClick={openAddPlacementModal}
            >
              <span>+</span>
              Add New Placement
            </button>

            <button
              type="button"
              className="refresh-button"
              onClick={fetchPlacements}
              disabled={loading}
            >
              <span className={loading ? "rotate-icon" : ""}>↻</span>
              Refresh
            </button>
          </div>
        </div>

        <div className="placement-stats-grid">
          <div className="placement-stat-card">
            <div className="stat-icon total">🎓</div>

            <div>
              <span>Total Placements</span>

              <strong>{placements.length}</strong>
            </div>
          </div>

          <div className="placement-stat-card">
            <div className="stat-icon active">✓</div>

            <div>
              <span>Active Placements</span>

              <strong>{activePlacements}</strong>
            </div>
          </div>

          <div className="placement-stat-card">
            <div className="stat-icon inactive">○</div>

            <div>
              <span>Hidden Placements</span>

              <strong>{inactivePlacements}</strong>
            </div>
          </div>

          <div className="placement-stat-card">
            <div className="stat-icon company">🏢</div>

            <div>
              <span>Companies</span>

              <strong>
                {
                  new Set(
                    placements
                      .map((student) => student.company)
                      .filter(Boolean),
                  ).size
                }
              </strong>
            </div>
          </div>
        </div>

        <div className="placement-admin-layout">
          {isFormModalOpen && (
            <div
              className="placement-modal-overlay placement-form-overlay"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget && !formLoading) {
                  closeFormModal();
                }
              }}
            >
              <div
                className="placement-form-modal"
                onMouseDown={(event) => event.stopPropagation()}
              >
                <div className="placement-form-modal-header">
                  <div>
                    <span className="section-badge">
                      {editingPlacement ? "Edit Placement" : "New Placement"}
                    </span>

                    <h2>
                      {editingPlacement
                        ? "Update Placement Student"
                        : "Add Placement Student"}
                    </h2>

                   <p>
  Enter all the required details to create or update a student placement record.
</p>
                  </div>

                  <button
                    type="button"
                    className="placement-form-close"
                    onClick={closeFormModal}
                    disabled={formLoading}
                    aria-label="Close placement form"
                  >
                    ×
                  </button>
                </div>

                <form className="placement-form" onSubmit={handleSubmit}>
                  <div className="placement-form-grid">
                    <div className="placement-field">
                      <label>
                        Student Name <span>*</span>
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter student name"
                        required
                      />
                    </div>

                    <div className="placement-field">
                      <label>
                        Package <span>*</span>
                      </label>

                      <input
                        type="text"
                        name="package"
                        value={formData.package}
                        onChange={handleInputChange}
                        placeholder="Example: ₹6.5 LPA"
                        required
                      />
                    </div>

                    <div className="placement-field">
                      <label>
                        Designation <span>*</span>
                      </label>

                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        placeholder="React Developer"
                        required
                      />
                    </div>

                    <div className="placement-field">
                      <label>
                        Company <span>*</span>
                      </label>

                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Company name"
                        required
                      />
                    </div>

                    <div className="placement-field">
                      <label>
                        Location <span>*</span>
                      </label>

                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Jaipur, Rajasthan"
                        required
                      />
                    </div>

                    <div className="placement-field">
                      <label>
                        Batch <span>*</span>
                      </label>

                      <input
                        type="text"
                        name="batch"
                        value={formData.batch}
                        onChange={handleInputChange}
                        placeholder="MERN Stack 2026"
                        required
                      />
                    </div>

                    <div className="placement-field">
                      <label>Skills</label>

                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        placeholder="React JS, Node JS, MongoDB"
                      />

                      <small>Skills comma se separate karein.</small>
                    </div>

                    <div className="placement-field">
                      <label>
                        Achievement <span>*</span>
                      </label>

                      <input
                        type="text"
                        name="achievement"
                        value={formData.achievement}
                        onChange={handleInputChange}
                        placeholder="Best Performing Student"
                        required
                      />
                    </div>

                    <div className="placement-field">
                      <label>Display Order</label>

                      <input
                        type="number"
                        min="0"
                        name="displayOrder"
                        value={formData.displayOrder}
                        onChange={handleInputChange}
                        placeholder="0"
                      />

                      <small>Lower number pehle show hoga.</small>
                    </div>

                    <div className="placement-field">
                      <label>
                        Student Image
                        {!editingPlacement && <span> *</span>}
                      </label>

                      <label
                        htmlFor="placement-image-input"
                        className="placement-file-input"
                      >
                        <span className="upload-icon">↑</span>

                        <div>
                          <strong>
                            {selectedImage
                              ? selectedImage.name
                              : editingPlacement
                                ? "Change student image"
                                : "Choose student image"}
                          </strong>

                          <small>JPG, PNG, WEBP up to 5MB</small>
                        </div>
                      </label>

                      <input
                        id="placement-image-input"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleImageChange}
                        hidden
                      />
                    </div>

                    <div className="placement-field full-width">
                      <label>
                        Description <span>*</span>
                      </label>

                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="5"
                        placeholder="Student  success journey and placement details..."
                        required
                      />
                    </div>
                  </div>

                  <div className="placement-form-bottom">
                    <label className="placement-switch-row">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                      />

                      <span className="placement-switch">
                        <span />
                      </span>

                      <div>
                        <strong>Show on website</strong>

                        <small>
                          Inactive student public website par show nahi hoga.
                        </small>
                      </div>
                    </label>

                    {imagePreview && (
                      <div className="placement-image-preview">
                        <img src={imagePreview} alt="Placement preview" />

                        <div>
                          <strong>Image Preview</strong>

                          <small>
                            {selectedImage
                              ? "New selected image"
                              : "Current saved image"}
                          </small>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="placement-form-actions">
                    <button
                      type="button"
                      className="reset-button"
                      onClick={closeFormModal}
                      disabled={formLoading}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="save-button"
                      disabled={formLoading}
                    >
                      {formLoading && <span className="button-loader" />}

                      {formLoading
                        ? "Saving..."
                        : editingPlacement
                          ? "Update Placement"
                          : "Add Placement"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* <section className="placement-form-card">
          <div className="placement-card-heading">
            <div>
              <span className="section-badge">
                {editingPlacement
                  ? "Edit Mode"
                  : "New Placement"}
              </span>

              <h2>
                {editingPlacement
                  ? "Update Student"
                  : "Add Placement Student"}
              </h2>

              <p>
                Student and placement complete
                information.
              </p>
            </div>

            {editingPlacement && (
              <button
                type="button"
                className="cancel-edit-button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            className="placement-form"
            onSubmit={handleSubmit}
          >
            <div className="placement-form-grid">
              <div className="placement-field">
                <label>
                  Student Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter student name"
                  required
                />
              </div>

              <div className="placement-field">
                <label>
                  Package
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="package"
                  value={formData.package}
                  onChange={handleInputChange}
                  placeholder="Example: ₹6.5 LPA"
                  required
                />
              </div>

              <div className="placement-field">
                <label>
                  Designation
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="designation"
                  value={
                    formData.designation
                  }
                  onChange={handleInputChange}
                  placeholder="React Developer"
                  required
                />
              </div>

              <div className="placement-field">
                <label>
                  Company
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company name"
                  required
                />
              </div>

              <div className="placement-field">
                <label>
                  Location
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Jaipur, Rajasthan"
                  required
                />
              </div>

              <div className="placement-field">
                <label>
                  Batch
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="batch"
                  value={formData.batch}
                  onChange={handleInputChange}
                  placeholder="MERN Stack 2026"
                  required
                />
              </div>

              <div className="placement-field">
                <label>
                  Skills
                </label>

                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="React JS, Node JS, MongoDB"
                />

                <small>
                  Skills ko comma se separate
                  karein.
                </small>
              </div>

              <div className="placement-field">
                <label>
                  Achievement
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="achievement"
                  value={
                    formData.achievement
                  }
                  onChange={handleInputChange}
                  placeholder="Best Performing Student"
                  required
                />
              </div>

              <div className="placement-field">
                <label>
                  Display Order
                </label>

                <input
                  type="number"
                  min="0"
                  name="displayOrder"
                  value={
                    formData.displayOrder
                  }
                  onChange={handleInputChange}
                  placeholder="0"
                />

                <small>
                  Lower number pehle show hoga.
                </small>
              </div>

              <div className="placement-field">
                <label>
                  Student Image
                  {!editingPlacement && (
                    <span>*</span>
                  )}
                </label>

                <label
                  htmlFor="placement-image-input"
                  className="placement-file-input"
                >
                  <span className="upload-icon">
                    ↑
                  </span>

                  <div>
                    <strong>
                      {selectedImage
                        ? selectedImage.name
                        : "Choose student image"}
                    </strong>

                    <small>
                      JPG, PNG, WEBP up to 5MB
                    </small>
                  </div>
                </label>

                <input
                  id="placement-image-input"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  hidden
                />
              </div>

              <div className="placement-field full-width">
                <label>
                  Description
                  <span>*</span>
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="Student success journey and placement details..."
                  required
                />
              </div>
            </div>

            <div className="placement-form-bottom">
              <label className="placement-switch-row">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={
                    formData.isActive
                  }
                  onChange={handleInputChange}
                />

                <span className="placement-switch">
                  <span />
                </span>

                <div>
                  <strong>
                    Show on website
                  </strong>

                  <small>
                    Inactive student public website
                    par show nahi hoga.
                  </small>
                </div>
              </label>

              {imagePreview && (
                <div className="placement-image-preview">
                  <img
                    src={imagePreview}
                    alt="Placement preview"
                  />

                  <div>
                    <strong>
                      Image Preview
                    </strong>

                    <small>
                      {selectedImage
                        ? "New selected image"
                        : "Current saved image"}
                    </small>
                  </div>
                </div>
              )}
            </div>

            <div className="placement-form-actions">
              <button
                type="button"
                className="reset-button"
                onClick={resetForm}
                disabled={formLoading}
              >
                Reset
              </button>

              <button
                type="submit"
                className="save-button"
                disabled={formLoading}
              >
                {formLoading && (
                  <span className="button-loader" />
                )}

                {formLoading
                  ? "Saving..."
                  : editingPlacement
                  ? "Update Placement"
                  : "Add Placement"}
              </button>
            </div>
          </form>
        </section> */}
        </div>

        <section className="placement-table-card">
          <div className="placement-table-header">
            <div>
              <span className="section-badge">Placement Records</span>

              <h2>All Placement Students</h2>

        
            </div>

            <div className="result-count">
              {filteredPlacements.length} results
            </div>
          </div>

          <div className="placement-table-toolbar">
            <div className="placement-search-box">
              <span>⌕</span>

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, company, designation, batch..."
              />

              {search && (
                <button type="button" onClick={() => setSearch("")}>
                  ×
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All Status</option>

              <option value="active">Active</option>

              <option value="inactive">Inactive</option>
            </select>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="latest">Latest First</option>

              <option value="oldest">Oldest First</option>

              <option value="name-asc">Name A-Z</option>

              <option value="name-desc">Name Z-A</option>

              <option value="order">Display Order</option>
            </select>

            <select
              value={itemsPerPage}
              onChange={(event) => setItemsPerPage(Number(event.target.value))}
            >
              <option value="5">5 per page</option>

              <option value="8">8 per page</option>

              <option value="15">15 per page</option>

              <option value="25">25 per page</option>
            </select>
          </div>

          <div className="placement-table-wrapper">
            {loading ? (
              <div className="placement-table-loader">
                <div className="large-loader" />

                <p>Placements loading...</p>
              </div>
            ) : paginatedPlacements.length === 0 ? (
              <div className="placement-empty-state">
                <div>🎓</div>

                <h3>No placement found</h3>

                <p>Search ya filter change karke dobara try karein.</p>
              </div>
            ) : (
              <table className="placement-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Placement</th>
                    <th>Company</th>
                    <th>Batch</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedPlacements.map((student) => (
                    <tr
                      key={student._id}
                      onClick={() => openStudentDetails(student)}
                    >
                      <td data-label="Student">
                        <div className="student-table-profile">
                          <img
                            src={
                              student.image || "https://via.placeholder.com/80"
                            }
                            alt={student.name}
                          />

                          <div>
                            <strong>{student.name}</strong>

                            <span>{student.designation}</span>
                          </div>
                        </div>
                      </td>

                      <td data-label="Placement">
                        <div className="package-table-value">
                          {student.package}
                        </div>

                        <small>📍 {student.location}</small>
                      </td>

                      <td data-label="Company">
                        <strong className="company-table-value">
                          {student.company}
                        </strong>
                      </td>

                      <td data-label="Batch">
                        <span className="batch-chip">{student.batch}</span>
                      </td>

                      <td data-label="Order">
                        <span className="order-chip">
                          {student.displayOrder || 0}
                        </span>
                      </td>

                      <td data-label="Status">
                        <button
                          type="button"
                          className={`status-toggle-button ${
                            student.isActive ? "active" : "inactive"
                          }`}
                          onClick={(event) => toggleStatus(event, student)}
                          disabled={statusLoadingId === student._id}
                        >
                          {statusLoadingId === student._id ? (
                            <span className="small-loader" />
                          ) : (
                            <>
                              <span className="status-dot" />

                              {student.isActive ? "Active" : "Inactive"}
                            </>
                          )}
                        </button>
                      </td>

                      <td data-label="Actions">
                        <div className="placement-row-actions">
                          <button
                            type="button"
                            className="view-action"
                            title="View details"
                            onClick={(event) => {
                              event.stopPropagation();

                              openStudentDetails(student);
                            }}
                          >
                            ◉
                          </button>

                          <button
                            type="button"
                            className="edit-action"
                            title="Edit placement"
                            onClick={(event) => handleEdit(event, student)}
                          >
                            ✎
                          </button>

                          <button
                            type="button"
                            className="delete-action"
                            title="Delete placement"
                            onClick={(event) => {
                              event.stopPropagation();

                              setDeletePlacementData(student);
                            }}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && filteredPlacements.length > 0 && (
            <div className="placement-pagination">
              <div>
                Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong>{" "}
                to{" "}
                <strong>
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredPlacements.length,
                  )}
                </strong>{" "}
                of <strong>{filteredPlacements.length}</strong>
              </div>

              <div className="pagination-actions">
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        {selectedPlacement && (
          <div
            className="placement-modal-overlay"
            onClick={() => setSelectedPlacement(null)}
          >
            <div
              className="placement-detail-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close-button"
                onClick={() => setSelectedPlacement(null)}
              >
                ×
              </button>

              <div className="detail-modal-banner">
                <img
                  src={selectedPlacement.image}
                  alt={selectedPlacement.name}
                />

                <div>
                  <span
                    className={`modal-status ${
                      selectedPlacement.isActive ? "active" : "inactive"
                    }`}
                  >
                    {selectedPlacement.isActive ? "Active" : "Inactive"}
                  </span>

                  <h2>{selectedPlacement.name}</h2>

                  <p>{selectedPlacement.designation}</p>
                </div>

                <strong className="modal-package">
                  {selectedPlacement.package}
                </strong>
              </div>

              <div className="detail-modal-content">
                <div className="detail-info-grid">
                  <div>
                    <span>Company</span>
                    <strong>{selectedPlacement.company}</strong>
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>{selectedPlacement.location}</strong>
                  </div>

                  <div>
                    <span>Batch</span>
                    <strong>{selectedPlacement.batch}</strong>
                  </div>

                  <div>
                    <span>Display Order</span>
                    <strong>{selectedPlacement.displayOrder || 0}</strong>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Description</h3>

                  <p>{selectedPlacement.description}</p>
                </div>

                <div className="detail-section">
                  <h3>Skills</h3>

                  <div className="detail-skills">
                    {selectedPlacement.skills?.length > 0 ? (
                      selectedPlacement.skills.map((skill, index) => (
                        <span key={`${skill}-${index}`}>{skill}</span>
                      ))
                    ) : (
                      <p>No skills added</p>
                    )}
                  </div>
                </div>

                <div className="achievement-detail-box">
                  <span>🏆</span>

                  <div>
                    <small>Achievement</small>

                    <strong>{selectedPlacement.achievement}</strong>
                  </div>
                </div>

                <div className="detail-modal-actions">
                  <button
                    type="button"
                    className="modal-delete-button"
                    onClick={() => {
                      setDeletePlacementData(selectedPlacement);

                      setSelectedPlacement(null);
                    }}
                  >
                    Delete
                  </button>

                  <button
                    type="button"
                    className="modal-edit-button"
                    onClick={(event) => handleEdit(event, selectedPlacement)}
                  >
                    Edit Placement
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {deletePlacementData && (
          <div
            className="placement-modal-overlay"
            onClick={() => {
              if (!deleteLoading) {
                setDeletePlacementData(null);
              }
            }}
          >
            <div
              className="delete-confirm-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="delete-warning-icon">!</div>

              <h2>Delete Placement?</h2>

           <p>
  Are you sure you want to permanently delete the placement record of{" "}
  <strong>{deletePlacementData.name}</strong>?
</p>

<small>
  This action will permanently delete the  record along with the associated Cloudinary image. This action cannot be undone.
</small>

              <div className="delete-modal-actions">
                <button
                  type="button"
                  className="delete-cancel-button"
                  disabled={deleteLoading}
                  onClick={() => setDeletePlacementData(null)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="confirm-delete-button"
                  disabled={deleteLoading}
                  onClick={handleDelete}
                >
                  {deleteLoading && <span className="small-loader" />}

                  {deleteLoading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>
        {`

        .placement-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.add-placement-button {
  min-height: 46px;
  padding: 0 18px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: #ffffff;
  background: linear-gradient(
    135deg,
    #22c55e,
    #15803d
  );
  box-shadow: 0 12px 25px
    rgba(34, 197, 94, 0.25);
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
  transition: 0.25s ease;
}

.add-placement-button span {
  font-size: 22px;
  line-height: 1;
}

.add-placement-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px
    rgba(34, 197, 94, 0.32);
}

.placement-form-overlay {
  z-index: 2500;
  padding: 24px;
}

.placement-form-modal {
  width: min(920px, 100%);
  max-height: calc(100vh - 48px);
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 30px 90px
    rgba(15, 23, 42, 0.35);
  overflow-y: auto;
  animation: placementFormModalOpen
    0.25s ease;
}

@keyframes placementFormModalOpen {
  from {
    opacity: 0;
    transform: translateY(20px)
      scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0)
      scale(1);
  }
}

.placement-form-modal-header {
  padding: 24px 28px 20px;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  background: #ffffff;
}

.placement-form-modal-header h2 {
  margin: 10px 0 6px;
  color: #101828;
  font-size: 25px;
}

.placement-form-modal-header p {
  margin: 0;
  color: #667085;
  line-height: 1.6;
}

.placement-form-close {
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: #475467;
  background: #f2f4f7;
  cursor: pointer;
  font-size: 27px;
  line-height: 1;
  transition: 0.2s ease;
}

.placement-form-close:hover {
  color: #ffffff;
  background: #dc2626;
  transform: rotate(90deg);
}

.placement-form-close:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.placement-form-modal .placement-form {
  margin-top: 0;
  padding: 25px 28px 28px;
}
            * {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.placement-admin-page {
  min-height: 100vh;

  /* Sidebar ki width */
  margin-left: 260px;

  /* Sidebar ke baad remaining width */
  width: calc(100% - 260px);

  padding: 28px;

  background:
    radial-gradient(
      circle at top left,
      rgba(79, 70, 229, 0.12),
      transparent 35%
    ),
    #f5f7fb;

  color: #172033;

  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  transition:
    margin-left 0.3s ease,
    width 0.3s ease;
}

.placement-admin-header {
  max-width: 1450px;
  margin: 0 auto 24px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      rgba(15, 23, 42, 0.98),
      rgba(67, 56, 202, 0.94)
    );
  box-shadow: 0 24px 60px
    rgba(30, 41, 59, 0.18);
  overflow: hidden;
  position: relative;
}

.placement-admin-header::after {
  content: "";
  width: 250px;
  height: 250px;
  position: absolute;
  right: -80px;
  top: -120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.placement-admin-header > * {
  position: relative;
  z-index: 1;
}

.header-label,
.section-badge {
  display: inline-flex;
  width: fit-content;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.header-label {
  color: #ddd6fe;
  background: rgba(255, 255, 255, 0.1);
}

.placement-admin-header h1 {
  margin: 12px 0 8px;
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1.1;
}

.placement-admin-header p {
  margin: 0;
  max-width: 690px;
  color: #dbeafe;
  line-height: 1.7;
}

.refresh-button {
  min-width: 130px;
  padding: 13px 18px;
  border: 1px solid
    rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 9px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
  cursor: pointer;
  font-weight: 700;
  transition: 0.25s ease;
}

.refresh-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.refresh-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.rotate-icon {
  display: inline-block;
  animation: placementRotate 0.8s linear infinite;
}

@keyframes placementRotate {
  to {
    transform: rotate(360deg);
  }
}

.placement-stats-grid {
  max-width: 1450px;
  margin: 0 auto 24px;
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.placement-stat-card {
  padding: 21px;
  border: 1px solid #e7eaf2;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: #ffffff;
  box-shadow: 0 12px 30px
    rgba(15, 23, 42, 0.06);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  font-size: 21px;
  font-weight: 900;
}

.stat-icon.total {
  color: #4338ca;
  background: #eef2ff;
}

.stat-icon.active {
  color: #15803d;
  background: #dcfce7;
}

.stat-icon.inactive {
  color: #c2410c;
  background: #ffedd5;
}

.stat-icon.company {
  color: #0369a1;
  background: #e0f2fe;
}

.placement-stat-card span {
  display: block;
  margin-bottom: 5px;
  color: #667085;
  font-size: 13px;
  font-weight: 600;
}

.placement-stat-card strong {
  color: #111827;
  font-size: 28px;
}

.placement-admin-layout,
.placement-table-card {
  max-width: 1450px;
  margin-right: auto;
  margin-left: auto;
}

.placement-form-card,
.placement-table-card {
  border: 1px solid #e6e9f0;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 18px 50px
    rgba(15, 23, 42, 0.07);
}

.placement-form-card {
  padding: 28px;
}

.placement-card-heading,
.placement-table-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.section-badge {
  color: #4338ca;
  background: #eef2ff;
}

.placement-card-heading h2,
.placement-table-header h2 {
  margin: 11px 0 7px;
  color: #101828;
  font-size: 25px;
}

.placement-card-heading p,
.placement-table-header p {
  margin: 0;
  color: #667085;
  line-height: 1.6;
}

.cancel-edit-button {
  padding: 10px 15px;
  border: 1px solid #fdba74;
  border-radius: 10px;
  color: #c2410c;
  background: #fff7ed;
  cursor: pointer;
  font-weight: 700;
}

.placement-form {
  margin-top: 26px;
}

.placement-form-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 19px;
}

.placement-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.placement-field.full-width {
  grid-column: 1 / -1;
}

.placement-field label {
  color: #344054;
  font-size: 13px;
  font-weight: 750;
}

.placement-field label span {
  color: #dc2626;
}

.placement-field input,
.placement-field textarea,
.placement-table-toolbar select {
  width: 100%;
  border: 1px solid #d8dde8;
  border-radius: 11px;
  outline: none;
  color: #172033;
  background: #ffffff;
  font: inherit;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.placement-field input,
.placement-table-toolbar select {
  height: 47px;
  padding: 0 14px;
}

.placement-field textarea {
  min-height: 125px;
  padding: 13px 14px;
  resize: vertical;
}

.placement-field input:focus,
.placement-field textarea:focus,
.placement-table-toolbar select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px
    rgba(99, 102, 241, 0.12);
}

.placement-field small {
  color: #98a2b3;
  font-size: 11px;
}

.placement-file-input {
  min-height: 72px;
  padding: 12px 14px;
  border: 1px dashed #a5b4fc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #344054;
  background: #f8faff;
  cursor: pointer;
}

.placement-file-input:hover {
  border-color: #6366f1;
  background: #f4f3ff;
}

.upload-icon {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  color: #ffffff !important;
  background: #4f46e5;
  font-size: 20px;
}

.placement-file-input strong,
.placement-file-input small {
  display: block;
}

.placement-file-input strong {
  max-width: 330px;
  overflow: hidden;
  color: #344054;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.placement-form-bottom {
  margin-top: 20px;
  padding: 18px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  background: #f8fafc;
}

.placement-switch-row {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.placement-switch-row > input {
  display: none;
}

.placement-switch {
  width: 49px;
  height: 27px;
  padding: 3px;
  border-radius: 999px;
  flex: 0 0 auto;
  background: #cbd5e1;
  transition: 0.25s ease;
}

.placement-switch > span {
  width: 21px;
  height: 21px;
  border-radius: 50%;
  display: block;
  background: #ffffff;
  box-shadow: 0 2px 6px
    rgba(15, 23, 42, 0.2);
  transition: 0.25s ease;
}

.placement-switch-row
  > input:checked
  + .placement-switch {
  background: #22c55e;
}

.placement-switch-row
  > input:checked
  + .placement-switch
  > span {
  transform: translateX(22px);
}

.placement-switch-row strong,
.placement-switch-row small {
  display: block;
}

.placement-switch-row strong {
  color: #344054;
  font-size: 13px;
}

.placement-switch-row small {
  margin-top: 3px;
  color: #98a2b3;
  font-size: 11px;
}

.placement-image-preview {
  display: flex;
  align-items: center;
  gap: 11px;
}

.placement-image-preview img {
  width: 58px;
  height: 58px;
  border: 3px solid #ffffff;
  border-radius: 14px;
  object-fit: cover;
  box-shadow: 0 6px 15px
    rgba(15, 23, 42, 0.14);
}

.placement-image-preview strong,
.placement-image-preview small {
  display: block;
}

.placement-image-preview strong {
  color: #344054;
  font-size: 13px;
}

.placement-image-preview small {
  margin-top: 4px;
  color: #98a2b3;
  font-size: 11px;
}

.placement-form-actions {
  margin-top: 22px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.placement-form-actions button,
.detail-modal-actions button,
.delete-modal-actions button {
  min-height: 45px;
  padding: 0 21px;
  border-radius: 11px;
  cursor: pointer;
  font-weight: 750;
  transition: 0.22s ease;
}

.reset-button {
  border: 1px solid #d0d5dd;
  color: #475467;
  background: #ffffff;
}

.save-button {
  min-width: 175px;
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      #4f46e5,
      #7c3aed
    );
  box-shadow: 0 12px 25px
    rgba(79, 70, 229, 0.25);
}

.save-button:hover,
.modal-edit-button:hover {
  transform: translateY(-2px);
}

.placement-form-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.button-loader,
.small-loader,
.large-loader {
  display: inline-block;
  border-radius: 50%;
  animation: placementSpin 0.75s linear
    infinite;
}

.button-loader {
  width: 17px;
  height: 17px;
  border: 2px solid
    rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
}

.small-loader {
  width: 15px;
  height: 15px;
  border: 2px solid
    rgba(100, 116, 139, 0.25);
  border-top-color: currentColor;
}

.large-loader {
  width: 38px;
  height: 38px;
  border: 3px solid #e0e7ff;
  border-top-color: #4f46e5;
}

@keyframes placementSpin {
  to {
    transform: rotate(360deg);
  }
}

.placement-table-card {
  margin-top: 24px;
  padding: 27px;
}

.result-count {
  padding: 9px 13px;
  border-radius: 999px;
  color: #4338ca;
  background: #eef2ff;
  font-size: 12px;
  font-weight: 750;
}

.placement-table-toolbar {
  margin: 22px 0;
  display: grid;
  grid-template-columns:
    minmax(280px, 1fr)
    repeat(3, minmax(140px, 170px));
  gap: 12px;
  align-items : center
}

.placement-search-box {
  height: 47px;
  padding: 0 14px;
  border: 1px solid #d8dde8;
  border-radius: 11px;
  display: flex;
  align-items: center;
  gap: 9px;
  background: #ffffff;
}

.placement-search-box:focus-within {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px
    rgba(99, 102, 241, 0.12);
}

.placement-search-box input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
}

.placement-search-box button {
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 50%;
  color: #64748b;
  background: #eef2f7;
  cursor: pointer;
}

.placement-table-wrapper {
  overflow-x: auto;
  border: 1px solid #e7eaf0;
  border-radius: 16px;
}

.placement-table {
  width: 100%;
  min-width: 1050px;
  border-collapse: collapse;
}

.placement-table th {
  padding: 15px;
  color: #667085;
  background: #f8fafc;
  text-align: left;
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.placement-table td {
  padding: 14px 15px;
  border-top: 1px solid #edf0f5;
  color: #344054;
  vertical-align: middle;
  font-size: 13px;
}

.placement-table tbody tr {
  cursor: pointer;
  transition: background 0.2s ease;
}

.placement-table tbody tr:hover {
  background: #f8faff;
}

.student-table-profile {
  display: flex;
  align-items: center;
  gap: 11px;
}

.student-table-profile img {
  width: 47px;
  height: 47px;
  border-radius: 13px;
  object-fit: cover;
  background: #eef2f7;
}

.student-table-profile strong,
.student-table-profile span {
  display: block;
}

.student-table-profile strong {
  max-width: 170px;
  overflow: hidden;
  color: #101828;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.student-table-profile span {
  margin-top: 4px;
  color: #667085;
  font-size: 11px;
}

.package-table-value {
  margin-bottom: 4px;
  color: #15803d;
  font-weight: 800;
}

.placement-table td small {
  color: #667085;
}

.company-table-value {
  color: #344054;
}

.batch-chip,
.order-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 750;
}

.batch-chip {
  color: #1d4ed8;
  background: #eff6ff;
}

.order-chip {
  min-width: 31px;
  color: #6d28d9;
  background: #f5f3ff;
}

.status-toggle-button {
  min-width: 89px;
  padding: 7px 10px;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
}

.status-toggle-button.active {
  color: #15803d;
  background: #dcfce7;
}

.status-toggle-button.inactive {
  color: #c2410c;
  background: #ffedd5;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.placement-row-actions {
  display: flex;
  align-items: center;
  gap: 7px;
}

.placement-row-actions button {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 9px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: 0.2s ease;
}

.placement-row-actions button:hover {
  transform: translateY(-2px);
}

.view-action {
  color: #0369a1;
  background: #e0f2fe;
}

.edit-action {
  color: #4338ca;
  background: #eef2ff;
}

.delete-action {
  color: #dc2626;
  background: #fee2e2;
}

.placement-pagination {
  padding-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  color: #667085;
  font-size: 12px;
}

.pagination-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination-actions button {
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #d0d5dd;
  border-radius: 9px;
  color: #344054;
  background: #ffffff;
  cursor: pointer;
  font-weight: 700;
}

.pagination-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.placement-table-loader,
.placement-empty-state {
  min-height: 300px;
  display: grid;
  place-content: center;
  justify-items: center;
  text-align: center;
}

.placement-table-loader p,
.placement-empty-state p {
  color: #667085;
}

.placement-empty-state > div {
  font-size: 45px;
}

.placement-empty-state h3 {
  margin: 12px 0 5px;
}

.placement-notification {
  width: min(390px, calc(100% - 30px));
  padding: 14px;
  position: fixed;
  right: 20px;
  top: 20px;
  z-index: 3000;
  border-radius: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  box-shadow: 0 18px 40px
    rgba(15, 23, 42, 0.25);
  animation: notificationEnter 0.25s ease;
}

.placement-notification.success {
  background: #15803d;
}

.placement-notification.error {
  background: #dc2626;
}

.placement-notification > span {
  width: 27px;
  height: 27px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  background: rgba(255, 255, 255, 0.18);
  font-weight: 900;
}

.placement-notification p {
  margin: 0;
  flex: 1;
  font-size: 13px;
  line-height: 1.5;
}

.placement-notification button {
  border: 0;
  color: #ffffff;
  background: transparent;
  cursor: pointer;
  font-size: 22px;
}

@keyframes notificationEnter {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.placement-modal-overlay {
  padding: 20px;
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.68);
  backdrop-filter: blur(6px);
  overflow-y: auto;
}

.placement-detail-modal {
  width: min(720px, 100%);
  max-height: calc(100vh - 40px);
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 30px 80px
    rgba(0, 0, 0, 0.28);
  overflow-y: auto;
  position: relative;
  animation: modalEnter 0.25s ease;
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.97)
      translateY(12px);
  }

  to {
    opacity: 1;
    transform: scale(1)
      translateY(0);
  }
}

.modal-close-button {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 2;
  color: #ffffff;
  background: rgba(15, 23, 42, 0.35);
  cursor: pointer;
  font-size: 22px;
}

.detail-modal-banner {
  min-height: 190px;
  padding: 35px;
  border-radius: 24px 24px 0 0;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 18px;
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      #111827,
      #4f46e5
    );
}

.detail-modal-banner img {
  width: 100px;
  height: 100px;
  border: 5px solid
    rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  object-fit: cover;
}

.detail-modal-banner h2 {
  margin: 10px 0 5px;
  font-size: 27px;
}

.detail-modal-banner p {
  margin: 0;
  color: #c7d2fe;
}

.modal-status {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
}

.modal-status.active {
  color: #166534;
  background: #dcfce7;
}

.modal-status.inactive {
  color: #9a3412;
  background: #ffedd5;
}

.modal-package {
  padding: 9px 13px;
  border-radius: 999px;
  white-space: nowrap;
  color: #ffffff;
  background: #22c55e;
}

.detail-modal-content {
  padding: 28px;
}

.detail-info-grid {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.detail-info-grid > div {
  padding: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 13px;
  background: #f8fafc;
}

.detail-info-grid span,
.detail-info-grid strong {
  display: block;
}

.detail-info-grid span {
  margin-bottom: 6px;
  color: #667085;
  font-size: 10px;
  text-transform: uppercase;
}

.detail-info-grid strong {
  color: #101828;
  font-size: 13px;
  word-break: break-word;
}

.detail-section {
  margin-top: 22px;
}

.detail-section h3 {
  margin: 0 0 9px;
  color: #101828;
  font-size: 15px;
}

.detail-section p {
  margin: 0;
  color: #667085;
  line-height: 1.75;
}

.detail-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-skills span {
  padding: 7px 11px;
  border-radius: 999px;
  color: #4338ca;
  background: #eef2ff;
  font-size: 11px;
  font-weight: 750;
}

.achievement-detail-box {
  margin-top: 22px;
  padding: 15px;
  border: 1px solid #fed7aa;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 11px;
  background: #fff7ed;
}

.achievement-detail-box > span {
  font-size: 25px;
}

.achievement-detail-box small,
.achievement-detail-box strong {
  display: block;
}

.achievement-detail-box small {
  margin-bottom: 3px;
  color: #9a3412;
}

.achievement-detail-box strong {
  color: #c2410c;
}

.detail-modal-actions {
  margin-top: 25px;
  display: flex;
  justify-content: flex-end;
  gap: 11px;
}

.modal-delete-button {
  border: 1px solid #fecaca;
  color: #dc2626;
  background: #fff1f2;
}

.modal-edit-button {
  border: 0;
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      #4f46e5,
      #7c3aed
    );
}

.delete-confirm-modal {
  width: min(430px, 100%);
  padding: 30px;
  border-radius: 22px;
  background: #ffffff;
  text-align: center;
  box-shadow: 0 30px 80px
    rgba(0, 0, 0, 0.25);
}

.delete-warning-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 17px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #dc2626;
  background: #fee2e2;
  font-size: 30px;
  font-weight: 900;
}

.delete-confirm-modal h2 {
  margin: 0 0 10px;
  color: #101828;
}

.delete-confirm-modal p {
  margin: 0;
  color: #667085;
  line-height: 1.6;
}

.delete-confirm-modal small {
  display: block;
  margin-top: 10px;
  color: #98a2b3;
}

.delete-modal-actions {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 11px;
}

.delete-cancel-button {
  border: 1px solid #d0d5dd;
  color: #344054;
  background: #ffffff;
}

.confirm-delete-button {
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #ffffff;
  background: #dc2626;
}

@media (max-width: 1100px) {
  .placement-stats-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .placement-table-toolbar {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }

  .placement-search-box {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .placement-admin-page {
    padding: 14px;
  }

  .placement-admin-header {
    padding: 23px 20px;
    border-radius: 18px;
    flex-direction: column;
    align-items: flex-start;
  }

  .refresh-button {
    width: 100%;
  }

  .placement-stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 11px;
  }

  .placement-stat-card {
    padding: 15px;
    border-radius: 14px;
  }

  .stat-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
  }

  .placement-stat-card strong {
    font-size: 21px;
  }

  .placement-form-card,
  .placement-table-card {
    padding: 18px;
    border-radius: 18px;
  }

  .placement-card-heading,
  .placement-table-header {
    flex-direction: column;
  }

  .cancel-edit-button {
    width: 100%;
  }

  .placement-form-grid {
    grid-template-columns: 1fr;
  }

  .placement-field.full-width {
    grid-column: auto;
  }

  .placement-form-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .placement-image-preview {
    width: 100%;
    padding-top: 14px;
    border-top: 1px solid #e5e7eb;
  }

  .placement-form-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .placement-form-actions button {
    width: 100%;
  }

  .placement-table-toolbar {
    grid-template-columns: 1fr;
  }

  .placement-search-box {
    grid-column: auto;
  }

  .placement-pagination {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination-actions {
    justify-content: space-between;
  }

  .placement-table-wrapper {
    overflow: visible;
    border: 0;
  }

  .placement-table {
    min-width: 0;
  }

  .placement-table thead {
    display: none;
  }

  .placement-table,
  .placement-table tbody,
  .placement-table tr,
  .placement-table td {
    width: 100%;
    display: block;
  }

  .placement-table tbody {
    display: grid;
    gap: 14px;
  }

  .placement-table tbody tr {
    padding: 15px;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 9px 25px
      rgba(15, 23, 42, 0.05);
  }

  .placement-table td {
    min-height: 42px;
    padding: 10px 0;
    border: 0;
    border-bottom: 1px dashed #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 13px;
    text-align: right;
  }

  .placement-table td:last-child {
    border-bottom: 0;
  }

  .placement-table td::before {
    content: attr(data-label);
    color: #667085;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
  }

  .placement-table td:first-child {
    justify-content: flex-end;
  }

  .placement-table td:first-child::before {
    display: none;
  }

  .student-table-profile {
    width: 100%;
    text-align: left;
  }

  .student-table-profile div {
    flex: 1;
  }

  .placement-row-actions {
    justify-content: flex-end;
  }

  .detail-modal-banner {
    padding: 30px 20px;
    grid-template-columns: 80px 1fr;
  }

  .detail-modal-banner img {
    width: 80px;
    height: 80px;
    border-radius: 18px;
  }

  .modal-package {
    grid-column: 1 / -1;
    width: fit-content;
  }

  .detail-info-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .placement-stats-grid {
    grid-template-columns: 1fr;
  }

  .placement-form-actions,
  .delete-modal-actions,
  .detail-modal-actions {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .placement-form-actions button,
  .delete-modal-actions button,
  .detail-modal-actions button {
    width: 100%;
  }

  .pagination-actions {
    flex-wrap: wrap;
  }

  .pagination-actions span {
    width: 100%;
    order: -1;
    text-align: center;
  }

  .detail-info-grid {
    grid-template-columns: 1fr;
  }

  .detail-modal-content {
    padding: 20px;
  }
}
            `}
      </style>
    </>
  );
}

export default PlacementAdmin;
