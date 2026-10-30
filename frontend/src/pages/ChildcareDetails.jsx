
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

function ChildcareDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCenter = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/childcare/${id}`
        );

        setCenter(response.data);
      } catch (err) {
        console.error("Error fetching childcare center:", err);
        setError("Unable to load childcare center details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCenter();
  }, [id]);

  if (loading) {
    return (
      <div className="childcare-page">
        <nav className="dashboard-navbar">
          <Link to="/find-childcare" className="dashboard-brand">
            Little Steps
          </Link>
        </nav>

        <main className="childcare-container">
          <div className="text-center py-5">
            <h3>Loading center details...</h3>
          </div>
        </main>
      </div>
    );
  }

  if (error || !center) {
    return (
      <div className="childcare-page">
        <nav className="dashboard-navbar">
          <Link to="/find-childcare" className="dashboard-brand">
            Little Steps
          </Link>
        </nav>

        <main className="childcare-container">
          <div className="alert alert-danger mt-4">
            {error || "Childcare center not found."}
          </div>

          <Link to="/find-childcare">
            ← Back to Childcare Search
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="childcare-page">
      <nav className="dashboard-navbar">
        <Link to="/parent-dashboard" className="dashboard-brand">
          Little Steps
        </Link>

        <Link to="/find-childcare" className="back-dashboard">
          ← Back to Search
        </Link>
      </nav>

      <main className="childcare-container">
        <div className="childcare-detail-card">
          <div className="childcare-detail-image">
            🏠
          </div>

          <div className="childcare-detail-content">
            <div className="center-title-row">
              <h1>{center.name}</h1>

              {center.verified && (
                <span className="verified-badge">
                  ✓ Verified
                </span>
              )}
            </div>

            <p className="center-location">
              📍 {center.location}
            </p>

            <div className="center-rating">
              ⭐ {center.rating}
              <span>({center.reviews} reviews)</span>
            </div>

            <p className="center-description">
              {center.description}
            </p>

            <div className="detail-info-grid">
              <div>
                <strong>👶 Age Group</strong>
                <span>{center.ageGroup}</span>
              </div>

              <div>
                <strong>🕐 Timings</strong>
                <span>{center.timing}</span>
              </div>

              <div>
                <strong>💰 Price</strong>
                <span>₹{center.pricePerHour}/hour</span>
              </div>

              <div>
                <strong>👥 Capacity</strong>
                <span>{center.capacity} children</span>
              </div>

              <div>
                <strong>✅ Available Slots</strong>
                <span>{center.availableSlots}</span>
              </div>
            </div>

            <button
              className="view-center-btn"
              onClick={() => navigate(`/booking/${center._id}`)}
            >
              Book This Center
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ChildcareDetails;
