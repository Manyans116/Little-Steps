
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

function ParentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/bookings/parent/${user.id}`
        );

        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error(
          "Error fetching parent bookings:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  );

  const recentBookings = bookings.slice(0, 3);

  return (
    <div className="dashboard-page">
      <nav className="dashboard-navbar">
        <Link to="/" className="dashboard-brand">
          Little Steps
        </Link>

        <div>
          <Link
            to="/find-childcare"
            className="back-dashboard me-3"
          >
            Find Childcare
          </Link>

          <Link
            to="/bookings"
            className="back-dashboard"
          >
            My Bookings
          </Link>
        </div>
      </nav>

      <main className="dashboard-container">
        <section className="dashboard-welcome">
          <div>
            <p className="dashboard-label">
              PARENT DASHBOARD
            </p>

            <h1>
              Welcome, {user?.name || "Parent"} 👋
            </h1>

            <p>
              Manage your childcare bookings and find
              trusted childcare centers for your child.
            </p>
          </div>
        </section>

        <section className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <span className="stat-icon">📅</span>
            <p>Total Bookings</p>
            <h2>{bookings.length}</h2>
          </div>

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
        </section>

        <section className="dashboard-content-grid mt-4">
          <div className="dashboard-main-card">
            <p className="dashboard-label">
              QUICK ACTIONS
            </p>

            <h2>What would you like to do?</h2>

            <div className="d-flex flex-wrap gap-3 mt-4">
              <Link
                to="/find-childcare"
                className="dashboard-primary-btn"
              >
                🔍 Find Childcare
              </Link>

              <Link
                to="/bookings"
                className="dashboard-primary-btn"
              >
                📅 View My Bookings
              </Link>
            </div>
          </div>

          <div className="dashboard-side-card">
            <h3>Little Steps</h3>

            <p>
              Find trusted childcare centers with
              flexible timings, transparent pricing and
              verified information.
            </p>

            <Link to="/find-childcare">
              Explore Childcare Centers →
            </Link>
          </div>
        </section>

        <section className="dashboard-main-card mt-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <p className="dashboard-label">
                RECENT ACTIVITY
              </p>

              <h2>Recent Bookings</h2>
            </div>

            <Link to="/bookings">
              View All →
            </Link>
          </div>

          {loading ? (
            <p>Loading your bookings...</p>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-4">
              <h4>No bookings yet</h4>

              <p>
                Find a childcare center and make your
                first booking.
              </p>

              <Link
                to="/find-childcare"
                className="dashboard-primary-btn"
              >
                🔍 Find Childcare
              </Link>
            </div>
          ) : (
            recentBookings.map((booking) => (
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
                      {booking.childcareCenter?.location ||
                        "Location unavailable"}
                    </p>
                  </div>

                  <span
                    className={`badge ${
                      booking.status === "confirmed"
                        ? "text-bg-success"
                        : booking.status === "rejected"
                        ? "text-bg-danger"
                        : "text-bg-warning"
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                <p className="mt-3 mb-1">
                  👶 <strong>Child:</strong>{" "}
                  {booking.childName}
                </p>

                <p className="mb-1">
                  📅 <strong>Date:</strong>{" "}
                  {new Date(
                    booking.bookingDate
                  ).toLocaleDateString("en-IN")}
                </p>

                <p className="mb-0">
                  💰 <strong>Amount:</strong> ₹
                  {booking.totalAmount}
                </p>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default ParentDashboard;
