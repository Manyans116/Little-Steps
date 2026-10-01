import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100 py-5">

          <div className="col-md-7 col-lg-6">

            <div className="auth-card">

              <div className="text-center mb-4">

                <div className="auth-logo">
                  👣
                </div>

                <h2 className="fw-bold mt-2">
                  Create Your Account
                </h2>

                <p className="text-muted">
                  Join Little Steps and find trusted childcare
                </p>

              </div>


              <form>

                <div className="mb-3">

                  <label className="form-label">
                    Full Name
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter your full name"
                  />

                </div>


                <div className="row">

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="you@example.com"
                    />

                  </div>


                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      placeholder="+91 XXXXX XXXXX"
                    />

                  </div>

                </div>


                <div className="mb-3">

                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Create a password"
                  />

                </div>


                <div className="mb-4">

                  <label className="form-label">
                    Account Type
                  </label>

                  <select className="form-select form-select-lg">

                    <option value="parent">
                      Parent
                    </option>

                    <option value="provider">
                      Childcare Provider
                    </option>

                  </select>

                </div>


                <div className="form-check mb-4">

                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="terms"
                  />

                  <label
                    className="form-check-label"
                    htmlFor="terms"
                  >
                    I agree to the Little Steps terms and
                    safety guidelines.
                  </label>

                </div>


                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                >
                  Create Account
                </button>

              </form>


              <div className="text-center mt-4">

                <span className="text-muted">
                  Already have an account?{" "}
                </span>

                <Link to="/login">
                  Login
                </Link>

              </div>


              <div className="text-center mt-3">

                <Link
                  to="/"
                  className="small text-muted"
                >
                  ← Back to Home
                </Link>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;