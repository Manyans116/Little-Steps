import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

function ProviderDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [bookings, setBookings] = useState([]);
  const [center, setCenter] = useState(null);

  const [loading, setLoading] = useState(true);
  const [centerLoading, setCenterLoading] = useState(true);

  const [error, setError] = useState("");
  const [centerError, setCenterError] = useState("");

  const [editingCenter, setEditingCenter] = useState(false);
  const [savingCenter, setSavingCenter] = useState(false);

  const [centerForm, setCenterForm] = useState({
    name: "",
    location: "",
    description: "",
    ageGroup: "",
    timing: "",
    pricePerHour: "",
    capacity: "",
    availableSlots: "",
  });

  // Fetch provider bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) {
        setError("Provider login information not found.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");

const response = await axios.get(
  `${API_BASE_URL}/api/bookings/provider/${user.id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        setBookings(response.data.bookings || []);
      } catch (err) {
        console.error("Error fetching provider bookings:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load provider bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  // Fetch provider center
  useEffect(() => {
    const fetchCenter = async () => {
      if (!user?.id) {
        setCenterLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/childcare/provider/${user.id}`
        );

        setCenter(response.data);

        setCenterForm({
          name: response.data.name || "",
          location: response.data.location || "",
          description: response.data.description || "",
          ageGroup: response.data.ageGroup || "",
          timing: response.data.timing || "",
          pricePerHour: response.data.pricePerHour || "",
          capacity: response.data.capacity || "",
          availableSlots:
            response.data.availableSlots ?? "",
        });
      } catch (err) {
        console.error("Error fetching provider center:", err);

        setCenterError(
          err.response?.data?.message ||
            "Unable to load childcare center."
        );
      } finally {
        setCenterLoading(false);
      }
    };

    fetchCenter();
  }, [user?.id]);

  // Handle center form changes
  const handleCenterChange = (e) => {
    const { name, value } = e.target;

    setCenterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save center details
  const handleSaveCenter = async (e) => {
    e.preventDefault();

    try {
      setSavingCenter(true);
      setCenterError("");

      const response = await axios.put(
        `${API_BASE_URL}/api/childcare/provider/${user.id}`,
        {
          name: centerForm.name,
          location: centerForm.location,
          description: centerForm.description,
          ageGroup: centerForm.ageGroup,
          timing: centerForm.timing,
          pricePerHour: Number(centerForm.pricePerHour),
          capacity: Number(centerForm.capacity),
          availableSlots: Number(centerForm.availableSlots),
        }
      );

      setCenter(response.data.center);

      setCenterForm({
        name: response.data.center.name || "",
        location: response.data.center.location || "",
        description: response.data.center.description || "",
        ageGroup: response.data.center.ageGroup || "",
        timing: response.data.center.timing || "",
        pricePerHour:
          response.data.center.pricePerHour || "",
        capacity:
          response.data.center.capacity || "",
        availableSlots:
          response.data.center.availableSlots ?? "",
      });

      setEditingCenter(false);

      alert("Childcare center updated successfully!");
    } catch (err) {
      console.error("Error updating center:", err);

      setCenterError(
        err.response?.data?.message ||
          "Unable to update childcare center."
      );
    } finally {
      setSavingCenter(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (
    bookingId,
    status
  ) => {
    try {

const token = localStorage.getItem("token");

const response = await axios.put(
 `${API_BASE_URL}/api/bookings/${bookingId}/status`,
  { status },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: response.data.booking.status,
              }
            : booking
        )
      );

      // Update slots immediately
      if (
        response.data.availableSlots !== undefined
      ) {
        setCenter((prev) =>
          prev
            ? {
                ...prev,
                availableSlots:
                  response.data.availableSlots,
              }
            : prev
        );

        setCenterForm((prev) => ({
          ...prev,
          availableSlots:
            response.data.availableSlots,
        }));
      }

      alert(
        status === "confirmed"
          ? "Booking confirmed successfully!"
          : "Booking rejected successfully!"
      );
    } catch (err) {
      console.error(
        "Error updating booking status:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to update booking status."
      );
    }
  };

  // Booking statistics
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  );

  const rejectedBookings = bookings.filter(
    (booking) => booking.status === "rejected"
  );

  const totalEarnings = confirmedBookings.reduce(
    (total, booking) =>
      total + Number(booking.totalAmount || 0),
    0
  );

  const totalCapacity = Number(
    center?.capacity || 0
  );

  const availableSlots = Number(
    center?.availableSlots || 0
  );

  const occupiedSlots =
    totalCapacity - availableSlots;

  return (
    <div className="dashboard-page">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <Link
          to="/"
          className="dashboard-brand"
        >
          Little Steps
        </Link>

        <div>
          <Link
            to="/parent-dashboard"
            className="back-dashboard me-3"
          >
            Parent Dashboard
          </Link>

          <Link
            to="/login"
            className="back-dashboard"
          >
            Logout
          </Link>
        </div>
      </nav>

      <main className="dashboard-container">
        {/* Welcome */}
        <section className="dashboard-welcome">
          <div>
            <p className="dashboard-label">
              PROVIDER DASHBOARD
            </p>

            <h1>
              Welcome, {user?.name || "Provider"} 👋
            </h1>

            <p>
              Manage your childcare center, bookings,
              availability and earnings.
            </p>
          </div>
        </section>

        {/* Errors */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {centerError && (
          <div className="alert alert-danger">
            {centerError}
          </div>
        )}

        {/* Booking Statistics */}
        <section className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <span className="stat-icon">⏳</span>
            <p>Pending Bookings</p>
            <h2>{pendingBookings.length}</h2>
          </div>

          <div className="dashboard-stat-card">
            <span className="stat-icon">✅</span>
            <p>Confirmed Bookings</p>
            <h2>{confirmedBookings.length}</h2>
          </div>

          <div className="dashboard-stat-card">
            <span className="stat-icon">📅</span>
            <p>Total Bookings</p>
            <h2>{bookings.length}</h2>
          </div>

          <div className="dashboard-stat-card">
            <span className="stat-icon">💰</span>
            <p>Confirmed Earnings</p>
            <h2>₹{totalEarnings}</h2>
          </div>
        </section>

        {/* Capacity Statistics */}
        <section className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <span className="stat-icon">🪑</span>
            <p>Total Capacity</p>
            <h2>{totalCapacity}</h2>
          </div>

          <div className="dashboard-stat-card">
            <span className="stat-icon">🟢</span>
            <p>Available Slots</p>
            <h2>{availableSlots}</h2>
          </div>

          <div className="dashboard-stat-card">
            <span className="stat-icon">👶</span>
            <p>Occupied Slots</p>
            <h2>{occupiedSlots}</h2>
          </div>

          <div className="dashboard-stat-card">
            <span className="stat-icon">❌</span>
            <p>Rejected Bookings</p>
            <h2>{rejectedBookings.length}</h2>
          </div>
        </section>

        {/* Center Details */}
        <section className="dashboard-content-grid">
          <div className="dashboard-main-card">
            <div className="d-flex justify-content-between align-items-center">
              <h2>My Childcare Center</h2>

              {!editingCenter && (
                <button
                  className="dashboard-primary-btn"
                  onClick={() =>
                    setEditingCenter(true)
                  }
                >
                  Edit Center
                </button>
              )}
            </div>

            {centerLoading ? (
              <p className="mt-4">
                Loading center details...
              </p>
            ) : !center ? (
              <p className="mt-4">
                No childcare center assigned.
              </p>
            ) : editingCenter ? (
              <form
                onSubmit={handleSaveCenter}
                className="mt-4"
              >
                <div className="mb-3">
                  <label className="form-label">
                    Center Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={centerForm.name}
                    onChange={handleCenterChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={centerForm.location}
                    onChange={handleCenterChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Description
                  </label>

                  <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    value={centerForm.description}
                    onChange={handleCenterChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Age Group
                  </label>

                  <input
                    type="text"
                    name="ageGroup"
                    className="form-control"
                    value={centerForm.ageGroup}
                    onChange={handleCenterChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Timing
                  </label>

                  <input
                    type="text"
                    name="timing"
                    className="form-control"
                    value={centerForm.timing}
                    onChange={handleCenterChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Price Per Hour
                  </label>

                  <input
                    type="number"
                    name="pricePerHour"
                    className="form-control"
                    value={centerForm.pricePerHour}
                    onChange={handleCenterChange}
                    min="0"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Total Capacity
                  </label>

                  <input
                    type="number"
                    name="capacity"
                    className="form-control"
                    value={centerForm.capacity}
                    onChange={handleCenterChange}
                    min="0"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Available Slots
                  </label>

                  <input
                    type="number"
                    name="availableSlots"
                    className="form-control"
                    value={centerForm.availableSlots}
                    onChange={handleCenterChange}
                    min="0"
                    max={centerForm.capacity}
                    required
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="dashboard-primary-btn"
                    disabled={savingCenter}
                  >
                    {savingCenter
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      setEditingCenter(false)
                    }
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-4">
                <h3>{center.name}</h3>

                <p>
                  📍 <strong>Location:</strong>{" "}
                  {center.location}
                </p>

                <p>
                  👶 <strong>Age Group:</strong>{" "}
                  {center.ageGroup}
                </p>

                <p>
                  🕐 <strong>Timing:</strong>{" "}
                  {center.timing}
                </p>

                <p>
                  💰 <strong>Price:</strong> ₹
                  {center.pricePerHour} / hour
                </p>

                <p>
                  🪑 <strong>Capacity:</strong>{" "}
                  {center.capacity}
                </p>

                <p>
                  🟢 <strong>Available Slots:</strong>{" "}
                  {center.availableSlots}
                </p>

                <p>
                  👶 <strong>Occupied Slots:</strong>{" "}
                  {occupiedSlots}
                </p>

                <div className="mt-3">
  <strong>Verification Status:</strong>

  <div className="mt-2">
    {center.verified ? (
      <span className="badge text-bg-success">
        🟢 Verified Provider
      </span>
    ) : (
      <span className="badge text-bg-warning">
        🟡 Verification Pending
      </span>
    )}
  </div>
</div>

                {center.description && (
                  <p>
                    📝 <strong>Description:</strong>{" "}
                    {center.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Incoming Bookings */}
        <section className="dashboard-main-card mt-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <p className="dashboard-label">
                BOOKING MANAGEMENT
              </p>

              <h2>Incoming Bookings</h2>
            </div>
          </div>

          {loading ? (
            <p>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="text-center py-4">
              <h4>No bookings yet</h4>
              <p>
                New parent bookings will appear here.
              </p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking._id}
                className="booking-item"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h4>
                      {booking.childcareCenter?.name ||
                        "Childcare Center"}
                    </h4>

                    <p>
                      📍{" "}
                      {booking.childcareCenter
                        ?.location ||
                        "Location unavailable"}
                    </p>
                  </div>

                  <span
                    className={`badge ${
                      booking.status === "confirmed"
                        ? "text-bg-success"
                        : booking.status ===
                          "rejected"
                        ? "text-bg-danger"
                        : "text-bg-warning"
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                <hr />

                <div className="row">
                  <div className="col-md-6">
                    <p>
                      👶 <strong>Child:</strong>{" "}
                      {booking.childName}
                    </p>

                    <p>
                      🎂 <strong>Age:</strong>{" "}
                      {booking.childAge} years
                    </p>

                    <p>
                      📅 <strong>Date:</strong>{" "}
                      {new Date(
                        booking.bookingDate
                      ).toLocaleDateString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <p>
                      🕐 <strong>Type:</strong>{" "}
                      {booking.bookingType}
                    </p>

                    <p>
                      ⏱️ <strong>Hours:</strong>{" "}
                      {booking.hours}
                    </p>

                    <p>
                      💰 <strong>Amount:</strong> ₹
                      {booking.totalAmount}
                    </p>
                  </div>
                </div>

                {booking.parent && (
                  <div className="mt-2">
                    <p>
                      👤 <strong>Parent:</strong>{" "}
                      {booking.parent.name}
                    </p>

                    <p>
                      📧 <strong>Email:</strong>{" "}
                      {booking.parent.email}
                    </p>

                    {booking.parent.phone && (
                      <p>
                        📞 <strong>Phone:</strong>{" "}
                        {booking.parent.phone}
                      </p>
                    )}
                  </div>
                )}

                {booking.status === "pending" && (
                  <div className="d-flex gap-2 mt-3">
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        updateBookingStatus(
                          booking._id,
                          "confirmed"
                        )
                      }
                    >
                      ✅ Accept Booking
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        updateBookingStatus(
                          booking._id,
                          "rejected"
                        )
                      }
                    >
                      ❌ Reject Booking
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default ProviderDashboard;