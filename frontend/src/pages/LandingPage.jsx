import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LoginModal from '../components/LoginModal'
import './LandingPage.css'
import clg1 from '../assets/clg4.jpg'
import clg2 from '../assets/clg6.jpg';
import clg3 from '../assets/clg3.jpg';

const slides = [
  {
    image: clg3, // Note: using the generated path
    title: 'Welcome to EduPortal University',
    desc: 'Empowering the next generation of leaders and innovators.'
  },
  {
    image:clg2,
    title: 'World-Class Infrastructure',
    desc: 'State-of-the-art facilities for research and excellence.'
  },
   {
    image:clg1,
    title: 'Vibrant Campus Life',
    desc: 'Engage in a diverse and enriching student community.'
  }
 
  
]

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(s => (s + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={`landing-page ${showLoginModal ? 'modal-open' : ''}`}>
      {/* Navbar */}
      <nav className="landing-nav glass">
        <div className="container nav-content">
          <div className="nav-brand">
            <span className="logo-icon"><Link to="/">🏛️</Link></span>
            <span className="brand-name"><Link to="/">EduPortal</Link></span>
          </div>
          <div className="nav-links">
            <a href="#about">About</a>
            {/* <a href="#departments">Departments</a> */}
            <button onClick={() => setShowLoginModal(true)} className="btn btn-primary">Sign In</button>
          </div>
        </div>
      </nav>

      {/* Hero Slider */}
      <section className="hero-slider">
        {slides.map((slide, index) => (
          <div key={index} className={`slide ${index === currentSlide ? 'active' : ''}`}
               style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${slide.image})` }}>
            <div className="container slide-content animate-fade">
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-desc">{slide.desc}</p>
              {/* <div className="slide-actions">
                <button className="btn btn-primary">Apply Now</button>
                <button className="btn btn-outline">Explore Programs</button>
              </div> */}
            </div>
          </div>
        ))}
        <div className="slider-dots">
          {slides.map((_, i) => (
            <span key={i} className={`dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section container">
        <div className="section-header">
          <span className="badge">Our Mission</span>
          <h2>Excellence in Education</h2>
          <p>EduPortal has been a beacon of knowledge and academic rigor.</p>
        </div>
        <div className="about-grid">
          <div className="glass-card about-card">
            <div className="card-icon">🎯</div>
            <h3>Goal Oriented</h3>
            <p>Our curriculum is designed to make students industry-ready from day one.</p>
          </div>
          <div className="glass-card about-card">
            <div className="card-icon">🔬</div>
            <h3>Research Led</h3>
            <p>Partnering with global labs to bring cutting-edge tech to our classrooms.</p>
          </div>
          <div className="glass-card about-card">
            <div className="card-icon">🌍</div>
            <h3>Global Community</h3>
            <p>Over 5,000 students from 20+ countries calling this campus home.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer glass">
        <div className="container footer-grid">
          <div className="footer-info">
            <div className="nav-brand">
              <span className="logo-icon">🏛️</span>
              <span className="brand-name">EduPortal</span>
            </div>
            <p>The leading management system for modern educational institutions.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowLoginModal(true); }}>Admin Login</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowLoginModal(true); }}>Faculty Portal</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowLoginModal(true); }}>Student Dashboard</a>
          </div>
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>📧 info@eduportal.edu</p>
            <p>📞 +91 98765 43210</p>
            <p>📍 Tech Campus, Hyderabad</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 EduPortal. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  )
}
