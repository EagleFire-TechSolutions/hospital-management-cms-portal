
"use client";

import "../styles/style2.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  MapPin,
  Phone,
  Globe,
  ExternalLink,
} from "lucide-react";

import {
  FaFacebookSquare,
  FaInstagram,
  FaPinterestSquare,
} from "react-icons/fa";

import {
  HeartPulse,
  Clock,
  Smartphone,
  PlusCircle,
  Leaf,
  Cross,
  Flower2,
   Menu,
  X
} from "lucide-react";

import {
  FaPills,
  FaFlask,
  FaNotesMedical,
  FaCalendarCheck,
  FaHeartPulse,
  FaUserDoctor,
} from "react-icons/fa6";

export default function Home() {
  const router = useRouter();
 const [menuOpen, setMenuOpen] = useState(false);
  const login = () => {
    router.push("/login");
    console.log("Login clicked");
  };

  const register = () => {
    router.push("/register");
    console.log("Login clicked");
  };

  const appointement = () => {
    alert("Please login first");
    console.log("Appointment clicked");
  };

  const reports = () => {
    alert("Please login first");
    console.log("Reports clicked");
  };

  const bobtn = () => {
    alert("Please login first");
    console.log("Book Appointment clicked");
  };

  const butser = () => {
    console.log("Learn More clicked");
  };

  const book = () => {
    alert("Please login first");
    console.log("Book Now clicked");
  };

  return (
    <>
      {/* HERO SECTION */}

{/* HERO SECTION */}
<section className="hero" id="home">


<nav className="navbar" id="navbar">
  <a
    href="#home"
    className="brand"
    aria-label="EverCare Home"
    onClick={() => setMenuOpen(false)}
  >
    <span className="brand-mark">
      <FaHeartPulse />
    </span>

    <span className="brand-text">
      <span className="brand-name">
        Ever<span>Care</span>
      </span>
      <span className="brand-tagline">
        HEALTHCARE MANAGEMENT SYSTEM
      </span>
    </span>
  </a>

  <button
    type="button"
    className="hamburger"
    aria-label={menuOpen ? "Close menu" : "Open menu"}
    aria-expanded={menuOpen}
    aria-controls="main-navigation"
    onClick={() => setMenuOpen((open) => !open)}
  >
    {menuOpen ? <X size={27} /> : <Menu size={27} />}
  </button>

  <ul
    id="main-navigation"
    className={`nav-links ${menuOpen ? "menu-open" : ""}`}
  >
    <li>
      <a
        className="active"
        href="#home"
        onClick={() => setMenuOpen(false)}
      >
        Home
      </a>
    </li>

    <li>
      <a href="#about" onClick={() => setMenuOpen(false)}>
        About
      </a>
    </li>

    <li>
      <a href="#doctors" onClick={() => setMenuOpen(false)}>
        Doctors
      </a>
    </li>

    <li>
      <a href="#services" onClick={() => setMenuOpen(false)}>
        Services
      </a>
    </li>

    <li>
      <a href="#contact" onClick={() => setMenuOpen(false)}>
        Contact
      </a>
    </li>

    {/* Login button for mobile/tablet menu */}
    <li className="mobile-auth-item">
      <button
        type="button"
        onClick={() => {
          setMenuOpen(false);
          login();
        }}
      >
        Login
      </button>
    </li>

    {/* Register button for mobile/tablet menu */}
    <li className="mobile-auth-item">
      <button
        type="button"
        onClick={() => {
          setMenuOpen(false);
          register();
        }}
      >
        Register
      </button>
    </li>
  </ul>

  {/* Original desktop Login and Register buttons */}
  <div className="nav-actions">
    <button id="login" onClick={login}>
      Login
    </button>
    <button id="register" onClick={register}>
      Register
    </button>
  </div>
</nav>


  <div className="hero-content" id="content-hero">
    <div className="hero-copy">
      <span className="hero-eyebrow">
        <FaHeartPulse />
        Your Health, Our Priority
      </span>

      <h1 id="heading">
        Quality Healthcare
        <br />
        for a <span>Healthier You</span>
      </h1>

      <p className="hero-description" id="para2">
        EverCare HMS makes it easier to connect with doctors,
        manage your healthcare, and access essential medical
        services in one place.
      </p>

      <div className="hero-actions">
        <button
          id="appointments"
          onClick={appointement}
        >
          <FaCalendarCheck />
          Book Appointment
        </button>

        <button
          id="reports"
          onClick={reports}
        >
          View Reports
        </button>
      </div>

      <div className="hero-features">
        <article className="hero-feature">
          <span className="feature-icon">
            <FaCalendarCheck />
          </span>
          <div>
            <h3>Easy Booking</h3>
            <p>Convenient appointment access</p>
          </div>
        </article>

        <article className="hero-feature">
          <span className="feature-icon">
            <FaUserDoctor />
          </span>
          <div>
            <h3>Expert Doctors</h3>
            <p>Connect with medical professionals</p>
          </div>
        </article>

        <article className="hero-feature">
          <span className="feature-icon">
            <FaNotesMedical />
          </span>
          <div>
            <h3>Health Records</h3>
            <p>Access essential health information</p>
          </div>
        </article>
      </div>
    </div>

    <div className="hero-visual">
      <div className="hero-image-backdrop"></div>

      <img
        id="co1"
        src="/image/co1.avif"
        alt="Healthcare professional providing medical care"
      />

      <div className="hero-floating-card appointment-card">
        <span className="floating-icon">
          <FaCalendarCheck />
        </span>
        <div>
          <h3>Appointments</h3>
          <p>Simple and convenient</p>
        </div>
      </div>

      <div className="hero-floating-card care-card">
        <span className="floating-icon">
          <FaHeartPulse />
        </span>
        <div>
          <h3>Care comes first</h3>
          <p>Your health matters</p>
        </div>
      </div>
    </div>
  </div>
</section>



{/* ABOUT SECTION */}
<section id="about">
  <div className="about-heading">
    <span className="about-eyebrow">ABOUT EVERCARE</span>
    <h1 id="about-h1">
      Why Choose <span>Us</span>
    </h1>
    <p className="about-intro">
      Delivering compassionate, patient-centered healthcare
      through quality, professionalism, and continuous improvement.
    </p>
  </div>

  <div className="about-grid">
    {/* OUR VISION */}
    <div id="box-1" className="about-card vision-card">
      <div className="about-card-image">
        <img
          src="/image/d (1).jpg"
          alt="Doctor consulting a patient with compassion"
          loading="lazy"
        />
      </div>

      <div className="about-card-content">
        <div className="about-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>

        <h2>Our Vision</h2>
        <p>
          To improve and expand our healthcare services
          with quality, compassion, and empathy.
        </p>
        <span className="about-card-accent" />
      </div>
    </div>

    {/* OUR MISSION */}
    <div id="box-2" className="about-card mission-card">
      <div className="about-card-image">
        <img
          src="/image/d (2).jpg"
          alt="Healthcare professionals collaborating as a team"
          loading="lazy"
        />
      </div>

      <div className="about-card-content">
        <div className="about-icon mission-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </div>

        <h2>Our Mission</h2>
        <p>
          To enhance clinical quality and patient safety through
          modern technology and service innovation. We strive to
          provide affordable, patient-centered care by engaging
          our staff and consultants in continuous improvement.
        </p>
        <span className="about-card-accent blue-accent" />
      </div>
    </div>

    {/* CORE VALUES */}
    <div id="box-4" className="about-card values-card">
      <div className="about-card-image">
        <img
          src="/image/d (3).jpg"
          alt="Doctor providing attentive and respectful patient care"
          loading="lazy"
        />
      </div>

      <div className="about-card-content">
        <div className="about-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M16 3.2a4 4 0 0 1 0 7.6M22 21v-2a4 4 0 0 0-3-3.87" />
          </svg>
        </div>

        <h2>Our Core Values</h2>
        <ul>
          <li>Empathy and compassion</li>
          <li>Working together</li>
          <li>Respect for every individual</li>
          <li>Professional and personal development</li>
        </ul>
        <span className="about-card-accent" />
      </div>
    </div>

    {/* QUALITY POLICY */}
    <div id="box-3" className="about-card quality-card">
      <div className="about-card-image">
        <img
          src="/image/d (4).jpg"
          alt="Healthcare professional managing medical records"
          loading="lazy"
        />
      </div>

      <div className="about-card-content">
        <div className="about-icon mission-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        <h2>Our Quality Policy</h2>
        <p>
          EverCare Medical Centre is committed to holistic patient
          care delivered with the highest standards of skill and
          professionalism. We aim to provide effective treatment
          at affordable prices while continually improving the
          quality of our healthcare services.
        </p>
        <span className="about-card-accent blue-accent" />
      </div>
    </div>
  </div>
</section>




{/* DOCTORS SECTION */}
<section id="doctors">
  <div className="doctors-heading">
    <span className="doctors-eyebrow">
      <span className="doctors-eyebrow-dot"></span>
      OUR MEDICAL TEAM
    </span>

    <h1 className="h1-doc">
      Meet Our <span>Expert Doctors</span>
    </h1>

    <p className="doctors-intro">
      Experienced healthcare professionals committed to providing
      compassionate care and helping you live a healthier life.
    </p>
  </div>

  <div className="doctors-highlights">
    <div className="doctor-highlight">
      <span className="highlight-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11Z" />
        </svg>
      </span>
      <div>
        <strong>Patient First</strong>
        <small>Care with compassion</small>
      </div>
    </div>

    <div className="doctor-highlight">
      <span className="highlight-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </span>
      <div>
        <strong>Easy Scheduling</strong>
        <small>Book your appointment</small>
      </div>
    </div>

    <div className="doctor-highlight">
      <span className="highlight-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </span>
      <div>
        <strong>Dedicated Care</strong>
        <small>Your health matters</small>
      </div>
    </div>
  </div>

  <div className="doctors-grid">
    {[
      {
        id: 1,
        name: "Dr. Saajad",
        specialty: "Neurologist",
        image: "/image/1.avif",
        availability: "Tue–Fri",
      },
      {
        id: 2,
        name: "Dr. Saira",
        specialty: "Gynecologist",
        image: "/image/2.avif",
        availability: "Tue–Fri",
      },
      {
        id: 3,
        name: "Dr. Nimra",
        specialty: "Cardiologist",
        image: "/image/3.avif",
        availability: "Tue–Fri",
      },
      {
        id: 4,
        name: "Dr. Humna",
        specialty: "Dermatologist",
        image: "/image/4.avif",
        availability: "Tue–Fri",
      },
      {
        id: 5,
        name: "Dr. Saim",
        specialty: "Nephrologist",
        image: "/image/5.avif",
        availability: "Tue–Fri",
      },
      {
        id: 6,
        name: "Dr. Mahnoor",
        specialty: "Pediatrician",
        image: "/image/6.avif",
        availability: "Tue–Fri",
      },
      {
        id: 7,
        name: "Dr. Ahmed",
        specialty: "Diabetologist",
        image: "/image/7.avif",
        availability: "Tue–Sat",
      },
      {
        id: 8,
        name: "Dr. Ahmer",
        specialty: "Ophthalmologist",
        image: "/image/8.avif",
        availability: "Tue–Fri",
      },
    ].map((doctor) => (
      <article className="doctor-card" key={doctor.id}>
        <div className="doctor-photo">
          <img
            src={doctor.image}
            alt={doctor.name}
            loading="lazy"
          />

          <span className="doctor-photo-label">
            <span className="availability-dot"></span>
            Appointment Available
          </span>

          <span className="doctor-number">
            {String(doctor.id).padStart(2, "0")}
          </span>
        </div>

        <div className="doctor-card-content">
          <span className="doctor-specialty">
            {doctor.specialty}
          </span>

          <h2>{doctor.name}</h2>

          <div className="doctor-divider"></div>

          <div className="doctor-detail">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
            </svg>
            <span>Experience: <strong>6+ Years</strong></span>
          </div>

          <div className="doctor-detail">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M16 3v4M8 3v4M3 10h18" />
            </svg>
            <span>Available: <strong>{doctor.availability}</strong></span>
          </div>

          <button
            type="button"
            className="doctor-book-btn"
            onClick={bobtn}
          >
            Book Appointment
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </article>
    ))}
  </div>

  <div className="doctors-bottom">
    <div className="doctors-bottom-icon">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11Z" />
      </svg>
    </div>

    <div className="doctors-bottom-text">
      <h2>Your Health Journey Starts Here</h2>
      <p>
        Choose your specialist and take the next step toward better health.
      </p>
    </div>

    <button
      type="button"
      className="doctors-bottom-btn"
      onClick={bobtn}
    >
      Book a Visit <span aria-hidden="true">→</span>
    </button>
  </div>
</section>

{/* SERVICES SECTION */}
<section id="services">
  <div className="services-heading">
    <span className="services-eyebrow">
      <span className="services-eyebrow-dot"></span>
      OUR SERVICES
    </span>

    <h1 id="services-h1">
      Quality Healthcare Services
      <span> Under One Roof</span>
    </h1>

    <p className="services-intro">
      From consultation to diagnostics, we provide complete healthcare
      services to keep you and your family healthy, always.
    </p>
  </div>

  <div id="services-box">
    <article id="box1" className="service-card">
      <div className="service-icon-wrap">
        <FaUserDoctor className="service-icon" />
      </div>
      <h2 className="service-title">Doctor Consultation</h2>
      <p className="service-description">
        Get expert advice and personalized treatment from experienced doctors.
      </p>
      <button
        type="button"
        className="service-learn-btn"
        onClick={() =>
          document.getElementById("about")?.scrollIntoView({
            behavior: "smooth",
          })
        }
      >
        Learn More <span aria-hidden="true">→</span>
      </button>
    </article>

    <article id="box2" className="service-card">
      <div className="service-icon-wrap">
        <FaHeartPulse className="service-icon" />
      </div>
      <h2 className="service-title">Emergency Care</h2>
      <p className="service-description">
        Access urgent medical support for unexpected health concerns.
      </p>
      <button
        type="button"
        className="service-learn-btn"
        onClick={() =>
          document.getElementById("about")?.scrollIntoView({
            behavior: "smooth",
          })
        }
      >
        Learn More <span aria-hidden="true">→</span>
      </button>
    </article>

    <article id="box3" className="service-card">
      <div className="service-icon-wrap">
        <FaCalendarCheck className="service-icon" />
      </div>
      <h2 className="service-title">Appointment Booking</h2>
      <p className="service-description">
        Schedule visits conveniently and manage your appointments online.
      </p>
      <button
        type="button"
        className="service-learn-btn"
        onClick={book}
      >
        Learn More <span aria-hidden="true">→</span>
      </button>
    </article>

    <article id="box4" className="service-card">
      <div className="service-icon-wrap">
        <FaFlask className="service-icon" />
      </div>
      <h2 className="service-title">Laboratory Tests</h2>
      <p className="service-description">
        Get reliable diagnostic testing to support better treatment decisions.
      </p>
      <button
        type="button"
        className="service-learn-btn"
        onClick={() =>
          document.getElementById("about")?.scrollIntoView({
            behavior: "smooth",
          })
        }
      >
        Learn More <span aria-hidden="true">→</span>
      </button>
    </article>

    <article id="box5" className="service-card">
      <div className="service-icon-wrap">
        <FaPills className="service-icon" />
      </div>
      <h2 className="service-title">Pharmacy Service</h2>
      <p className="service-description">
        Find convenient pharmacy support for your healthcare needs.
      </p>
      <button
        type="button"
        className="service-learn-btn"
        onClick={() =>
          document.getElementById("about")?.scrollIntoView({
            behavior: "smooth",
          })
        }
      >
        Learn More <span aria-hidden="true">→</span>
      </button>
    </article>

    <article id="box6" className="service-card">
      <div className="service-icon-wrap">
        <FaNotesMedical className="service-icon" />
      </div>
      <h2 className="service-title">Medical Records</h2>
      <p className="service-description">
        Keep important health information organized and accessible.
      </p>
      <button
        type="button"
        className="service-learn-btn"
        onClick={() =>
          document.getElementById("about")?.scrollIntoView({
            behavior: "smooth",
          })
        }
      >
        Learn More <span aria-hidden="true">→</span>
      </button>
    </article>
  </div>

  <div className="services-actions">
    <button
      type="button"
      className="services-about-btn"
      onClick={() =>
        document.getElementById("about")?.scrollIntoView({
          behavior: "smooth",
        })
      }
    >
      Learn More
    </button>

    <button
      type="button"
      className="services-book-btn"
      onClick={book}
    >
      Book Now <span aria-hidden="true">→</span>
    </button>
  </div>
</section>



{/* CONTACT SECTION */}
<section id="contact">
  {/* HEADER */}
  <div className="contact-heading">
    <span className="contact-eyebrow">
      <span className="contact-eyebrow-dot"></span>
      CONTACT EVERCARE
      <span className="contact-eyebrow-dot"></span>
    </span>

    <h1 id="contact-h1">
      Let's Get In Touch <span>with Us</span>
    </h1>

    <p className="contact-intro">
      Have a question or need assistance? Our team is here to help
      you access the healthcare support you need.
    </p>
  </div>

  {/* MAIN CONTENT */}
  <div id="contact-content">

    {/* LEFT COLUMN */}
    <div className="contact-info">

      {/* INTRODUCTION CARD */}
      <div id="cont-bo">
        <div className="contact-info-icon" aria-hidden="true">
          <HeartPulse size={28} strokeWidth={2.2} />
        </div>

        <h2>We're Here for You</h2>

        <p id="con-p">
          We are committed to providing quality healthcare services
          and patient support. Contact us for appointments, doctor
          consultations, emergency care, and general inquiries.
        </p>
      </div>

      {/* CONTACT DETAILS CARD */}
      <div id="cont-bo1">
        <div className="contact-info-title">
          <span className="contact-title-icon" aria-hidden="true">
            <Smartphone size={23} />
          </span>
          <h2>Contact Information</h2>
        </div>

        <div className="contact-detail">
          <span className="contact-detail-icon" aria-hidden="true">
            <Phone size={22} />
          </span>
          <div>
            <h3>Emergency Contact</h3>
            <p>+92 321 9876543</p>
          </div>
        </div>

        <div className="contact-detail">
          <span className="contact-detail-icon" aria-hidden="true">
            <MapPin size={22} />
          </span>
          <div>
            <h3>Our Location</h3>
            <p>Main Shahrah-e-Faisal, Karachi, Pakistan</p>
          </div>
        </div>

        <div className="contact-detail">
          <span className="contact-detail-icon" aria-hidden="true">
            <Clock size={22} />
          </span>
          <div>
            <h3>Working Hours</h3>
            <p>Mon - Sat | 9:00 AM - 10:00 PM</p>
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT COLUMN — CONTACT FORM */}
    <form className="form">
      <div className="contact-form-heading">
        <h2>Send Us a Message</h2>
        <p>Fill out the form below and get in touch with our team.</p>
      </div>

      <div className="contact-form-grid">
        <div className="contact-field">
          <label htmlFor="contact-name">Full Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder="Enter your name"
            autoComplete="name"
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-email">Email Address</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-phone">Phone Number</label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            autoComplete="tel"
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-subject">Subject</label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            placeholder="What is this about?"
            required
          />
        </div>

        <div className="contact-field contact-message-field">
          <label htmlFor="contact-message">Your Message</label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Write your message here..."
            rows={4}
            required
          />
        </div>
      </div>

      <div className="capcha">
        <label htmlFor="contact-captcha">Security Check</label>

        <div className="captcha-row">
          <div className="captcha-code" aria-label="Sample code">
            2 3 4 u d
          </div>

          <input
            id="contact-captcha"
            name="captcha"
            type="text"
            placeholder="Enter code"
            autoComplete="off"
            required
          />
        </div>
      </div>

      <label className="contact-agreement">
        <input type="checkbox" name="agree" required />
        <span>I have read and understand this policy.</span>
      </label>

      <button type="submit" className="contact-submit-btn">
        Contact Us <span aria-hidden="true">→</span>
      </button>
    </form>
  </div>

  {/* TRUSTED BY */}
  <div className="contact-trusted">
    <div className="trusted-heading">
      <span></span>
      <h2>TRUSTED BY</h2>
      <span></span>
    </div>

    <div className="trusted-logos">
      <div className="trusted-logo">
        <PlusCircle className="trusted-health-icon" size={27} />
        <span>HealthPlus</span>
      </div>

      <div className="trusted-logo">
        <HeartPulse className="trusted-medicare-icon" size={27} />
        <span>MediCare</span>
      </div>

      <div className="trusted-logo">
        <Leaf className="trusted-lifewell-icon" size={27} />
        <span>LifeWell</span>
      </div>

      <div className="trusted-logo">
        <Cross className="trusted-careone-icon" size={27} />
        <span>CareOne</span>
      </div>

      <div className="trusted-logo">
        <Flower2 className="trusted-wellness-icon" size={27} />
        <span>Wellness</span>
      </div>
    </div>
  </div>
</section>




{/* FOOTER */}
<footer>
  <div className="footer">
    <div id="footer-con1">

      {/* Hospital Contact Information */}
      <div id="footer-con">
        <h4 className="foo-h4">
          <MapPin size={17} aria-hidden="true" />
          Address:
        </h4>

        <p>Main Mansehra Road, Mandian Abbottabad.</p>

        <h4>
          <Phone size={17} aria-hidden="true" />
          Phone:
        </h4>

        <p>
          <a
            href="tel:09929311155"
            className="footer-contact-link"
          >
            0992-9311155
          </a>
        </p>

        <h4>
          <Globe size={17} aria-hidden="true" />
          Website:
        </h4>

        <p>
          <a
            href="https://ath.gov.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-link"
          >
            ath.gov.pk
            <ExternalLink
              size={13}
              aria-hidden="true"
            />
          </a>
        </p>

        {/* Social Media Links */}
        <div id="links">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebookSquare aria-hidden="true" />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram aria-hidden="true" />
          </a>

          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pinterest"
          >
            <span className="footer-brand-letter">P</span>
          </a>

          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
          >
            <span className="footer-brand-letter">X</span>
          </a>
        </div>
      </div>

      {/* Social Media Heading */}
      <div id="he">
        <h1>Connect With Us</h1>
      </div>

      {/* Hospital Location Map */}
      <iframe
        id="map"
        src="https://www.google.com/maps?q=Ayub+Teaching+Hospital+Abbottabad&output=embed"
        loading="lazy"
        title="Ayub Teaching Hospital location in Abbottabad"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      ></iframe>

    </div>
  </div>
</footer>

    </>
  );
}
