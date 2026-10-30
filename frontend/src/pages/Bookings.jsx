import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Bookings() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) {
        setError("Please login to view your bookings.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");

const response = await axios.get(
  `http://localhost:5000/api/bookings/parent/${user.id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        setBookings(response.data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  // Booking counts
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  );

  const rejectedBookings = bookings.filter(
    (booking) => booking.status === "rejected"
  );

  const getStatusClass = (status) => {
    if (status === "confirmed") {
      return "text-bg-success";
    }

    if (status === "rejected") {
      return "text-bg-danger";
    }

    if (status === "completed") {
      return "text-bg-primary";
    }

    if (status === "cancelled") {
      return "text-bg-secondary";
    }

    return "text-bg-warning";
  };

  const getStatusMessage = (status) => {
    if (status === "confirmed") {
      return "Your booking has been confirmed by the provider.";
    }

    if (status === "rejected") {
      return "This booking was rejected by the provider.";
    }

    if (status === "completed") {
      return "This booking has been completed.";
    }

    if (status === "cancelled") {
      return "This booking has been cancelled.";
    }

    return "Your booking is waiting for provider confirmation.";
  };

  return (
    <div className="dashboard-page">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <Link
          to="/parent-dashboard"
          className="dashboard-brand"
        >
          Little Steps
        </Link>

        <Link
          to="/parent-dashboard"
          className="back-dashboard"
        >
          ← Dashboard
        </Link>
      </nav>

      <main className="dashboard-container">
        {/* Page Header */}
        <section className="dashboard-welcome">
          <div>
            <p className="dashboard-label">
              MY BOOKINGS
            </p>

            <h1>My Bookings 📅</h1>

            <p>
              View and track all your childcare bookings
              in one place.
            </p>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="dashboard-main-card">
            <p>Loading your bookings...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        {!loading && !error && (
          <>
            <section className="dashboard-stats-grid">
              <div className="dashboard-stat-card">
                <span className="stat-icon">📅</span>

                <p>Total Bookings</p>

                <h2>{bookings.length}</h2>
              </div>

              <div className="dashboard-stat-card">
                <span className="stat-icon">⏳</span>

                <p>Pending</p>

                <h2>{pendingBookings.length}</h2>
              </div>

              <div className="dashboard-stat-card">
                <span className="stat-icon">✅</span>

                <p>Confirmed</p>

                <h2>{confirmedBookings.length}</h2>
              </div>

              <div className="dashboard-stat-card">
                <span className="stat-icon">❌</span>

                <p>Rejected</p>

                <h2>{rejectedBookings.length}</h2>
              </div>
            </section>
          </>
        )}

        {/* No Bookings */}
        {!loading &&
          !error &&
          bookings.length === 0 && (
            <div className="dashboard-main-card text-center mt-4">
              <h3>No bookings yet</h3>

              <p>
                You haven't made any childcare bookings
                yet.
              </p>

              <Link
                to="/find-childcare"
                className="dashboard-primary-btn"
              >
                🔍 Find Childcare
              </Link>
            </div>
          )}

        {/* Booking List */}
        {!loading &&
          !error &&
          bookings.length > 0 && (
            <section className="dashboard-main-card mt-4">
              <div className="mb-4">
                <p className="dashboard-label">
                  BOOKING HISTORY
                </p>

                <h2>Your Bookings</h2>
              </div>

              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="booking-item"
                >
                  {/* Booking Header */}
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
                          "Location not available"}
                      </p>
                    </div>

                    <span
                      className={`badge ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <hr />

                  {/* Booking Information */}
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
                        🕐 <strong>Booking Type:</strong>{" "}
                        {booking.bookingType}
                      </p>

                      <p>
                        ⏱️ <strong>Hours:</strong>{" "}
                        {booking.hours}
                      </p>

                      <p>
                        💰 <strong>Total Amount:</strong>{" "}
                        ₹{booking.totalAmount}
                      </p>
                    </div>
                  </div>

                  {/* Status Information */}
                  <div className="alert alert-light mt-3 mb-0">
                    <strong>
                      {booking.status === "confirmed"
                        ? "Booking Confirmed"
                        : booking.status ===
                          "rejected"
                        ? "Booking Rejected"
                        : booking.status ===
                          "completed"
                        ? "Booking Completed"
                        : booking.status ===
                          "cancelled"
                        ? "Booking Cancelled"
                        : "Booking Pending"}
                    </strong>

                    <br />

                    <small>
                      {getStatusMessage(
                        booking.status
                      )}
                    </small>
                  </div>
                </div>
              ))}
            </section>
          )}

        {/* Quick Actions */}
        {!loading && (
          <section className="dashboard-content-grid mt-4">
            <div className="dashboard-side-card">
              <h3>Quick Actions</h3>

              <Link to="/find-childcare">
                🔍 Find Childcare
              </Link>

              <Link to="/bookings">
                📅 My Bookings
              </Link>

              <Link to="/parent-dashboard">
                🏠 Dashboard
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Bookings;