import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function FindChildcare() {
  const navigate = useNavigate();
  const [childcareCenters, setChildcareCenters] = useState([]);
  const [search, setSearch] = useState("");
  const [twentyFourSeven, setTwentyFourSeven] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChildcareCenters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/childcare"
        );

        setChildcareCenters(response.data.centers);
      } catch (err) {
        console.error("Error fetching childcare centers:", err);

        setError(
          "Unable to load childcare centers. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChildcareCenters();
  }, []);

  const filteredCenters = childcareCenters.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(search.toLowerCase()) ||
      center.location.toLowerCase().includes(search.toLowerCase());

    const matches24x7 =
      !twentyFourSeven || center.timing === "24×7";

    return matchesSearch && matches24x7;
  });

  return (
    <div className="childcare-page">
      <nav className="dashboard-navbar">
        <Link to="/parent-dashboard" className="dashboard-brand">
          Little Steps
        </Link>

        <Link to="/parent-dashboard" className="back-dashboard">
          ← Dashboard
        </Link>
      </nav>

      <main className="childcare-container">
        <div className="childcare-heading">
          <p className="dashboard-label">CHILDCARE SEARCH</p>

          <h1>Find trusted childcare</h1>

          <p>
            Search and compare verified childcare centers that fit
            your family's needs.
          </p>
        </div>

        <div className="search-panel">
          <div className="search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search by center name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <label className="filter-check">
            <input
              type="checkbox"
              checked={twentyFourSeven}
              onChange={(e) =>
                setTwentyFourSeven(e.target.checked)
              }
            />

            <span>24×7 childcare</span>
          </label>
        </div>

        {loading && (
          <div className="text-center py-5">
            <h3>Loading childcare centers...</h3>
          </div>
        )}

        {error && (
          <div className="alert alert-danger mt-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="results-header">
              <h2>Available centers</h2>

              <span>
                {filteredCenters.length} centers found
              </span>
            </div>

            <div className="childcare-grid">
              {filteredCenters.map((center) => (
                <div
                  className="childcare-card"
                  key={center._id}
                >
                  <div className="childcare-image">
                    🏠
                  </div>

                  <div className="childcare-card-body">
                    <div className="center-title-row">
                      <h3>{center.name}</h3>

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

                      <span>
                        ({center.reviews} reviews)
                      </span>
                    </div>

                    <div className="center-details">
                      <span>
                        👶 {center.ageGroup}
                      </span>

                      <span>
                        🕐 {center.timing}
                      </span>

                      <span>
                        💰 ₹{center.pricePerHour}/hour
                      </span>
                    </div>

                    <button
			className="view-center-btn"
                       onClick={() => navigate(`/childcare/${center._id}`)}
		    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCenters.length === 0 && (
              <div className="no-results">
                <div>🔍</div>

                <h3>No childcare centers found</h3>

                <p>
                  Try another location or remove some filters.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default FindChildcare;