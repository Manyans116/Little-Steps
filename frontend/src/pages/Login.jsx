import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">

          <div className="col-md-6 col-lg-5">

            <div className="auth-card">

              <div className="text-center mb-4">
                <div className="auth-logo">👣</div>

                <h2 className="fw-bold mt-2">
                  Welcome Back
                </h2>

                <p className="text-muted">
                  Sign in to your Little Steps account
                </p>
              </div>

              <form>

                <div className="mb-3">
                  <label className="form-label">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="d-flex justify-content-between mb-4">

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="remember"
                    />

                    <label
                      className="form-check-label"
                      htmlFor="remember"
                    >
                      Remember me
                    </label>
                  </div>

                  <a href="#" className="small">
                    Forgot password?
                  </a>

                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                >
                  Login
                </button>

              </form>

              <div className="text-center mt-4">

                <span className="text-muted">
                  Don't have an account?{" "}
                </span>

                <Link to="/register">
                  Create Account
                </Link>

              </div>

              <div className="text-center mt-3">
                <Link to="/" className="small text-muted">
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

export default Login;