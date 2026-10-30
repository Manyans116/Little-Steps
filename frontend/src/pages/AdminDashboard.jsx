
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/admin`;

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [centerForm, setCenterForm] = useState({
    providerId: "",
    name: "",
    location: "",
    description: "",
    ageGroup: "1–5 years",
    timing: "24×7",
    pricePerHour: "",
    capacity: 10,
  });

  const [creatingCenter, setCreatingCenter] = useState(false);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: API,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchDashboard = async () => {
    try {
      setError("");

      const [statsResponse, providersResponse] = await Promise.all([
        api.get("/stats"),
        api.get("/providers"),
      ]);

      setStats(statsResponse.data.stats || statsResponse.data);
      setProviders(providersResponse.data.providers || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load admin dashboard. Please log in again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const changeVerification = async (providerId, nextStatus) => {
    const action = nextStatus
      ? "approve"
      : "revoke verification for";

    if (
      !window.confirm(
        `Are you sure you want to ${action} this provider?`
      )
    ) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await api.patch(
        `/providers/${providerId}/verification`,
        { isVerified: nextStatus }
      );

      setMessage(response.data.message || "Verification updated.");
      await fetchDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update verification."
      );
    }
  };

  const createCenter = async (event) => {
    event.preventDefault();

    try {
      setCreatingCenter(true);
      setError("");
      setMessage("");

      const response = await axios.post(
        `${API_BASE_URL}/api/childcare`,
        {
          ...centerForm,
          pricePerHour: Number(centerForm.pricePerHour),
          capacity: Number(centerForm.capacity),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Childcare center created successfully."
      );

      setCenterForm({
        providerId: "",
        name: "",
        location: "",
        description: "",
        ageGroup: "1–5 years",
        timing: "24×7",
        pricePerHour: "",
        capacity: 10,
      });

      await fetchDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create childcare center."
      );
    } finally {
      setCreatingCenter(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-muted">
            Manage Little Steps platform and provider verification.
          </p>
        </div>

        <Link to="/" className="btn btn-outline-secondary">
          Back to Home
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {error.toLowerCase().includes("token") && (
        <button
          className="btn btn-primary mb-3"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Log in again
        </button>
      )}

      <h3 className="mb-3">Platform Statistics</h3>

      <div className="row g-3 mb-5">
        {[
          ["Total Users", stats?.totalUsers],
          ["Parents", stats?.totalParents],
          ["Providers", stats?.totalProviders],
          ["Childcare Centers", stats?.totalCenters],
          ["Total Bookings", stats?.totalBookings],
          ["Unverified Providers", stats?.pendingVerification],
          ["Pending Bookings", stats?.pendingBookings],
          ["Confirmed Bookings", stats?.confirmedBookings],
          ["Rejected Bookings", stats?.rejectedBookings],
        ].map(([label, value]) => (
          <div className="col-12 col-sm-6 col-lg-4" key={label}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <p className="text-muted mb-2">{label}</p>
                <h2 className="mb-0">{value ?? 0}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Childcare Center */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body p-4">
          <h3 className="mb-3">Create Childcare Center</h3>
          <p className="text-muted">
            Assign a childcare center to a registered provider.
          </p>

          <form onSubmit={createCenter}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Select Provider</label>
                <select
                  className="form-select"
                  value={centerForm.providerId}
                  onChange={(e) =>
                    setCenterForm({
                      ...centerForm,
                      providerId: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Choose a provider</option>
                  {providers.map((provider) => (
                    <option key={provider._id} value={provider._id}>
                      {provider.name || provider.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Center Name</label>
                <input
                  className="form-control"
                  value={centerForm.name}
                  onChange={(e) =>
                    setCenterForm({
                      ...centerForm,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Location</label>
                <input
                  className="form-control"
                  value={centerForm.location}
                  onChange={(e) =>
                    setCenterForm({
                      ...centerForm,
                      location: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Age Group</label>
                <select
                  className="form-select"
                  value={centerForm.ageGroup}
                  onChange={(e) =>
                    setCenterForm({
                      ...centerForm,
                      ageGroup: e.target.value,
                    })
                  }
                  required
                >
                  <option value="0–1 years">0–1 years</option>
                  <option value="1–5 years">1–5 years</option>
                  <option value="5–12 years">5–12 years</option>
                  <option value="0–12 years">0–12 years</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Operating Hours</label>
                <select
                  className="form-select"
                  value={centerForm.timing}
                  onChange={(e) =>
                    setCenterForm({
                      ...centerForm,
                      timing: e.target.value,
                    })
                  }
                  required
                >
                  <option value="24×7">24×7</option>
                  <option value="7 AM–10 PM">7 AM–10 PM</option>
                  <option value="9 AM–6 PM">9 AM–6 PM</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Price per Hour (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={centerForm.pricePerHour}
                  onChange={(e) =>
                    setCenterForm({
                      ...centerForm,
                      pricePerHour: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Capacity</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={centerForm.capacity}
                  onChange={(e) =>
                    setCenterForm({
                      ...centerForm,
                      capacity: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={centerForm.description}
                  onChange={(e) =>
                    setCenterForm({
                      ...centerForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creatingCenter}
                >
                  {creatingCenter
                    ? "Creating..."
                    : "Create Childcare Center"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <h3 className="mb-3">Provider Verification</h3>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Verification</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {providers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No providers found.
                </td>
              </tr>
            ) : (
              providers.map((provider) => (
                <tr key={provider._id}>
                  <td>{provider.name}</td>
                  <td>{provider.email}</td>
                  <td>{provider.phone}</td>
                  <td>
                    <span
                      className={`badge ${
                        provider.isVerified
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {provider.isVerified
                        ? "Verified"
                        : "Not verified"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${
                        provider.isVerified
                          ? "btn-outline-danger"
                          : "btn-success"
                      }`}
                      onClick={() =>
                        changeVerification(
                          provider._id,
                          !provider.isVerified
                        )
                      }
                    >
                      {provider.isVerified ? "Revoke" : "Approve"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
