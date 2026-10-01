import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container py-2">

          <Link
            to="/"
            className="navbar-brand fw-bold d-flex align-items-center"
          >
            <span className="brand-icon">👣</span>
            <span className="ms-2">Little Steps</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">

            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">

              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#how-it-works">
                  How It Works
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#why-us">
                  Why Little Steps
                </a>
              </li>

              <li className="nav-item">
                <Link className="btn btn-outline-primary px-4" to="/login">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link className="btn btn-primary px-4" to="/register">
                  Get Started
                </Link>
              </li>

            </ul>

          </div>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="hero-section">

        <div className="container">

          <div className="row align-items-center min-vh-75">

            <div className="col-lg-6">

              <div className="hero-badge mb-3">
                🛡️ Trusted • Verified • 24×7 Childcare
              </div>

              <h1 className="display-4 fw-bold hero-title">
                Trusted childcare,
                <br />
                whenever you need it.
              </h1>

              <p className="lead text-muted mt-4">
                Find safe, verified and flexible childcare centers
                designed around your family's schedule — day or night.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">

                <Link
                  to="/register"
                  className="btn btn-primary btn-lg px-4"
                >
                  Find Childcare
                </Link>

                <a
                  href="#how-it-works"
                  className="btn btn-outline-secondary btn-lg px-4"
                >
                  Learn More
                </a>

              </div>

              <div className="hero-stats mt-5">

                <div>
                  <h5 className="fw-bold mb-0">24×7</h5>
                  <small className="text-muted">
                    Flexible care
                  </small>
                </div>

                <div>
                  <h5 className="fw-bold mb-0">Verified</h5>
                  <small className="text-muted">
                    Care providers
                  </small>
                </div>

                <div>
                  <h5 className="fw-bold mb-0">Flexible</h5>
                  <small className="text-muted">
                    Booking plans
                  </small>
                </div>

              </div>

            </div>


            {/* Hero Illustration */}
            <div className="col-lg-6 text-center mt-5 mt-lg-0">

              <div className="hero-illustration">

                <div className="illustration-circle">
                  👶
                </div>

                <div className="floating-card card-one">
                  <span>🛡️</span>
                  <div>
                    <strong>Verified</strong>
                    <small>Trusted caregivers</small>
                  </div>
                </div>

                <div className="floating-card card-two">
                  <span>🕐</span>
                  <div>
                    <strong>24×7 Care</strong>
                    <small>Day & night support</small>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Why Little Steps */}
      <section id="why-us" className="py-5 bg-light">

        <div className="container py-4">

          <div className="text-center mb-5">

            <span className="section-label">
              WHY LITTLE STEPS
            </span>

            <h2 className="fw-bold mt-2">
              Childcare you can trust
            </h2>

            <p className="text-muted">
              Everything parents need to find reliable childcare.
            </p>

          </div>


          <div className="row g-4">

            <div className="col-md-4">

              <div className="feature-card h-100">

                <div className="feature-icon">
                  🛡️
                </div>

                <h5 className="fw-bold">
                  Verified Caregivers
                </h5>

                <p className="text-muted mb-0">
                  Caregivers and childcare centers go through
                  verification workflows for greater peace of mind.
                </p>

              </div>

            </div>


            <div className="col-md-4">

              <div className="feature-card h-100">

                <div className="feature-icon">
                  🕐
                </div>

                <h5 className="fw-bold">
                  24×7 Availability
                </h5>

                <p className="text-muted mb-0">
                  Find childcare options that support day shifts,
                  night shifts and flexible schedules.
                </p>

              </div>

            </div>


            <div className="col-md-4">

              <div className="feature-card h-100">

                <div className="feature-icon">
                  📅
                </div>

                <h5 className="fw-bold">
                  Flexible Plans
                </h5>

                <p className="text-muted mb-0">
                  Choose hourly, daily or monthly childcare plans
                  based on your family's needs.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* How It Works */}
      <section id="how-it-works" className="py-5">

        <div className="container py-4">

          <div className="text-center mb-5">

            <span className="section-label">
              HOW IT WORKS
            </span>

            <h2 className="fw-bold mt-2">
              Childcare made simple
            </h2>

          </div>


          <div className="row g-4 text-center">

            <div className="col-md-3">

              <div className="step-number">
                1
              </div>

              <h5 className="fw-bold mt-3">
                Search
              </h5>

              <p className="text-muted">
                Find childcare centers near you.
              </p>

            </div>


            <div className="col-md-3">

              <div className="step-number">
                2
              </div>

              <h5 className="fw-bold mt-3">
                Compare
              </h5>

              <p className="text-muted">
                Compare facilities, caregivers and plans.
              </p>

            </div>


            <div className="col-md-3">

              <div className="step-number">
                3
              </div>

              <h5 className="fw-bold mt-3">
                Book
              </h5>

              <p className="text-muted">
                Choose a suitable childcare slot.
              </p>

            </div>


            <div className="col-md-3">

              <div className="step-number">
                4
              </div>

              <h5 className="fw-bold mt-3">
                Relax
              </h5>

              <p className="text-muted">
                Receive confirmation and stay informed.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* Call To Action */}
      <section className="cta-section py-5">

        <div className="container text-center py-4">

          <h2 className="fw-bold">
            Ready to find the right childcare?
          </h2>

          <p className="mb-4">
            Take the first step towards safer, flexible childcare.
          </p>

          <Link
            to="/register"
            className="btn btn-light btn-lg px-5"
          >
            Get Started
          </Link>

        </div>

      </section>


      {/* Footer */}
      <footer className="footer py-4">

        <div className="container">

          <div className="row align-items-center">

            <div className="col-md-6">

              <div className="fw-bold">
                👣 Little Steps
              </div>

              <small className="text-muted">
                Trusted childcare, whenever you need it.
              </small>

            </div>

            <div className="col-md-6 text-md-end mt-3 mt-md-0">

              <small className="text-muted">
                © 2026 Little Steps. All rights reserved.
              </small>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;