
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  Clock3,
  ShieldCheck,
  ChartNoAxesCombined
} from 'lucide-react';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="habitra">

      {/* NAVBAR */}
      <header className="site-header">
        <nav className="navbar">

          <Link to="/" className="logo" onClick={closeMenu}>
            HABITRA<span>.</span>
          </Link>

          <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
            <a href="#home" onClick={closeMenu}>Home</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#features" onClick={closeMenu}>Features</a>

            <Link
              to="/register"
              className="mobile-cta"
              onClick={closeMenu}
            >
              Get Started <ArrowUpRight size={17} />
            </Link>
          </div>

          <Link to="/register" className="desktop-cta">
            Get Started <ArrowUpRight size={17} />
          </Link>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>

        </nav>
      </header>

      {/* HERO */}
      <section className="hero" id="home">

        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero-poster.jpg"
        >
          <source
            src="/videos/habitra-hero.mp4"
            type="video/mp4"
          />
        </video>

        <div className="hero-shade"></div>

        <div className="hero-inner">

          <span className="hero-eyebrow">
            A BETTER WAY TO MOVE FORWARD
          </span>

          <h1>
            Become who
            <br />
            you <span>commit</span> to be.
          </h1>

          <p>
            Less overthinking. More meaningful action.
            Build a life around the things that matter.
          </p>

          <Link to="/register" className="hero-button">
            Start your journey
            <ArrowUpRight size={19} />
          </Link>

        </div>

        <div className="hero-caption">
          <span>YOUR GOALS. YOUR PACE. YOUR PROGRESS.</span>
          <span className="hero-scroll">
            SCROLL TO EXPLORE ↓
          </span>
        </div>

      </section>

      {/* ABOUT */}
      <section className="about" id="about">

        <div className="about-intro">
          <span className="eyebrow">THE HABITRA APPROACH</span>

          <h2>
            Big changes begin
            <br />
            with <span>small promises.</span>
          </h2>

          <p>
            HABITRA helps you turn your intentions
            into everyday commitments.
          </p>
        </div>

        <div className="about-visual">

          <div className="about-image">
            <div className="image-overlay">
              <span>MAKE EACH DAY COUNT</span>
              <h3>Progress over perfection.</h3>
            </div>
          </div>

          <div className="about-note">
            <span className="note-mark">H.</span>
            <p>
              Built for people who want to take
              their goals seriously.
            </p>
          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="features" id="features">

        <div className="features-heading">
          <div>
            <span className="eyebrow">MADE FOR REAL LIFE</span>
            <h2>Focus on what matters.</h2>
          </div>

          <p>
            Everything you need to bring
            more intention to your days.
          </p>
        </div>

        <div className="feature-grid">

          <article className="feature-card">
            <div className="feature-top">
              <span>01</span>
              <Clock3 size={23} />
            </div>

            <h3>Plan with purpose.</h3>

            <p>
              Give your daily goals a clear place
              in your schedule.
            </p>
          </article>

          <article className="feature-card featured-card">
            <div className="feature-top">
              <span>02</span>
              <ShieldCheck size={23} />
            </div>

            <h3>Stay accountable.</h3>

            <p>
              Be honest about your commitments.
              Learn from every day.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-top">
              <span>03</span>
              <ChartNoAxesCombined size={23} />
            </div>

            <h3>See your progress.</h3>

            <p>
              Understand your consistency
              through meaningful reports.
            </p>
          </article>

        </div>

      </section>

      {/* FINAL CTA */}
      <section className="closing-section">

        <span className="eyebrow">THE NEXT STEP IS YOURS</span>

        <h2 style={{color:'white'}}>
          Your future is built
          <br />
          by what you do <span>today.</span>
        </h2>

        <Link to="/register" className="closing-button">
          Get Started Free
          <ArrowRight size={19} />
        </Link>

      </section>

      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-main">
          <Link to="/" className="logo">
            HABITRA<span>.</span>
          </Link>

          <p>Make your commitments count.</p>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} HABITRA
          </span>

          <span>Created by Abdulaziz.</span>
        </div>

      </footer>

    </main>
  );
}
