import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    childName: "",
    childAge: "",
    bookingType: "hourly",
    bookingDate: "",
    hours: 1,
  });

  useEffect(() => {
    const fetchCenter = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/childcare/${id}`
        );

        setCenter(response.data);
      } catch (err) {
        console.error("Error fetching childcare center:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load childcare center."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCenter();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert("Please login before making a booking.");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const hours =
        formData.bookingType === "hourly"
          ? Number(formData.hours)
          : 1;

      const totalAmount =
        Number(center.pricePerHour) * hours;

      const token = localStorage.getItem("token");

if (!token) {
  alert("Your login session has expired. Please log in again.");
  navigate("/login");
  return;
}

await axios.post(
  "http://localhost:5000/api/bookings",
  {
    parent: user.id,
    childcareCenter: center._id,
    childName: formData.childName,
    childAge: Number(formData.childAge),
    bookingType: formData.bookingType,
    bookingDate: formData.bookingDate,
    hours,
    totalAmount,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      alert("Booking created successfully!");

      navigate("/bookings");
    } catch (err) {
      console.error("Error creating booking:", err);

      setError(
        err.response?.data?.message ||
          "Unable to create booking."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container text-center py-5">
          <h3>Loading childcare center...</h3>
        </div>
      </div>
    );
  }

  if (error && !center) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="alert alert-danger">
            {error}
          </div>

          <Link
            to="/find-childcare"
            className="dashboard-primary-btn"
          >
            ← Back to Find Childcare
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}
      <nav className="dashboard-navbar">
        <Link
          to="/parent-dashboard"
          className="dashboard-brand"
        >
          Little Steps
        </Link>

        <Link
          to="/find-childcare"
          className="back-dashboard"
        >
          ← Find Childcare
        </Link>
      </nav>

      {/* MAIN */}
      <main className="dashboard-container">

        <section className="dashboard-welcome">
          <div>
            <p className="dashboard-label">
              MAKE A BOOKING
            </p>

            <h1>
              Book Childcare 📅
            </h1>

            <p>
              Fill in the details below to make your
              childcare booking.
            </p>
          </div>
        </section>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <div className="dashboard-content-grid">

          {/* BOOKING FORM */}
          <div className="dashboard-main-card">

            <h2>
              Booking Details
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">
                  Child Name
                </label>

                <input
                  type="text"
                  name="childName"
                  className="form-control"
                  value={formData.childName}
                  onChange={handleChange}
                  placeholder="Enter child's name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Child Age
                </label>

                <input
                  type="number"
                  name="childAge"
                  className="form-control"
                  value={formData.childAge}
                  onChange={handleChange}
                  min="1"
                  max="18"
                  placeholder="Enter child's age"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Booking Type
                </label>

                <select
                  name="bookingType"
                  className="form-select"
                  value={formData.bookingType}
                  onChange={handleChange}
                  required
                >
                  <option value="hourly">
                    Hourly
                  </option>

                  <option value="daily">
                    Daily
                  </option>

                  <option value="monthly">
                    Monthly
                  </option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Booking Date
                </label>

                <input
                  type="date"
                  name="bookingDate"
                  className="form-control"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {formData.bookingType === "hourly" && (
                <div className="mb-3">
                  <label className="form-label">
                    Number of Hours
                  </label>

                  <input
                    type="number"
                    name="hours"
                    className="form-control"
                    value={formData.hours}
                    onChange={handleChange}
                    min="1"
                    max="24"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="dashboard-primary-btn"
                disabled={submitting}
              >
                {submitting
                  ? "Creating Booking..."
                  : "Confirm Booking"}
              </button>

            </form>
          </div>

          {/* CENTER SUMMARY */}
          <div className="dashboard-side-card">

            <h3>
              Childcare Center
            </h3>

            <h4 className="mt-3">
              {center?.name}
            </h4>

            <p>
              📍 {center?.location}
            </p>

            <p>
              🕐 {center?.timing}
            </p>

            <p>
              👶 {center?.ageGroup}
            </p>

            <p>
              💰 ₹{center?.pricePerHour} / hour
            </p>

            <p>
              🪑 Available Slots:{" "}
              {center?.availableSlots}
            </p>

            <hr />

            <Link to="/find-childcare">
              ← Choose another center
            </Link>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Booking;