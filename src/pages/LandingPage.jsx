
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  Clock3,
  ShieldCheck,
  ChartNoAxesCombined,
  Download,
  LoaderCircle
} from 'lucide-react';


export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  // Listen for browser PWA installation events.
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setCanInstall(false);
      setDeferredPrompt(null);
      setIsInstalling(false);

      alert('🎉 HABITRA has been installed successfully!');
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        'appinstalled',
        handleAppInstalled
      );
    };
  }, []);

  // Close mobile navigation with Escape.
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // PWA installation
  const handleInstallClick = async () => {
    if (isInstalling) return;

    if (!deferredPrompt) {
      alert(
        'ℹ️ Installation is not currently available in this browser. ' +
        'You can use your browser menu to look for "Install App" or "Add to Home Screen".'
      );

      closeMenu();
      return;
    }

    setIsInstalling(true);

    try {
      deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        alert(
          '✅ Installation accepted! Follow your browser instructions to finish installing HABITRA.'
        );

        setCanInstall(false);
      } else {
        alert(
          'Installation was cancelled. No problem! You can install HABITRA whenever you are ready.'
        );
      }

      setDeferredPrompt(null);

    } catch (error) {
      console.error('HABITRA installation error:', error);

      alert(
        '❌ Unable to start the installation.\n\n' +
        'Please try again or use your browser menu to install HABITRA.'
      );

    } finally {
      setIsInstalling(false);
      closeMenu();
    }
  };

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

            {canInstall && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="mobile-cta install-cta"
                disabled={isInstalling}
              >
                {isInstalling ? (
                  <>
                    <LoaderCircle className="install-spinner" size={17} />
                    Opening installer...
                  </>
                ) : (
                  <>
                    <Download size={17} />
                    Install App
                  </>
                )}
              </button>
            )}

            <Link
              to="/register"
              className="mobile-cta"
              onClick={closeMenu}
            >
              Get Started <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="desktop-actions">
            {canInstall && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="desktop-install-button"
                disabled={isInstalling}
                title="Install HABITRA"
              >
                {isInstalling ? (
                  <>
                    <LoaderCircle className="install-spinner" size={17} />
                    Opening...
                  </>
                ) : (
                  <>
                    <Download size={17} />
                    Install App
                  </>
                )}
              </button>
            )}

            <Link to="/register" className="desktop-cta">
              Get Started <ArrowUpRight size={17} />
            </Link>
          </div>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="habitra-navigation"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
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
          preload="metadata"
          poster=""
          aria-hidden="true"
        >
          <source
            src="/video_2026-11-16_15-07-09.mp4"
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

          <Link to="/register" className="hero-button" style={{backgroundColor:'blue'}}>
            Start your journey
            <ArrowUpRight size={19} />
          </Link>

        </div>

        <div className="hero-caption">
          <span>YOUR GOALS. YOUR PACE. YOUR PROGRESS.</span>

          <a href="#about" className="hero-scroll">
            SCROLL TO EXPLORE <span>↓</span>
          </a>
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

    <Link to="/register" className="text-link">
      Start building better days
      <ArrowUpRight size={17} />
    </Link>
  </div>

  <div className="about-visual">

    <div className="about-image">
      <img
        src="/HABITRA.jpg"
        alt="A peaceful moment representing consistency and personal growth"
      />

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

        <h2>
          Your future is built
          <br />
          by what you do <span>today.</span>
        </h2>

        <p>
          Start with one commitment. Build from there.
        </p>

        <Link to="/register" className="closing-button" style={{backgroundColor:'blue'}}>
          Get Started Free
          <ArrowRight size={19} />
        </Link>

      </section>

      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-main">
          <div>
            <Link to="/" className="logo">
              HABITRA<span>.</span>
            </Link>

            <p>Make your commitments count.</p>
          </div>

          <a href="#home" className="back-to-top">
            Back to top <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} HABITRA. All rights reserved.
          </span>

          <span>Created by Abdulaziz Haider.</span>
        </div>

      </footer>

    </main>
  );
}
