import { useRef, useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Home from "./Components/Home/Home.jsx";
import About from "./Components/About/About.jsx";
import Signup from "./Components/Signup/signup.jsx";
import Contact from './Components/Contacts/Contacts.jsx';
import './App.css';

gsap.registerPlugin(ScrollTrigger);


function Landing() {
  useEffect(() => {
    let requestId = null;
  
    const handleScroll = () => {
      if (requestId) return;
      requestId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const moveUp = scrollY * -0.2;
    
        for (let i = 1; i <= 4; i++) {
          const el = document.getElementById(`ball-${i}`);
          if (el) el.style.transform = `translateY(${moveUp}px)`;
        }
    
        const aboutSection = document.querySelector('.about-section');
        if (aboutSection) {
          // Allow smooth translate both up and down
          const moveAbout = scrollY * 0.08; // No Math.min, so it can animate back
          const scale = 1 - scrollY / 4000; // Avoid max clamp so it scales up when scrolling up
          const clampedScale = Math.max(scale, 0.96); // Clamp just to avoid going too small
          aboutSection.style.transform = `translateY(-${moveAbout}px) scale(${clampedScale})`;
        }
    
        requestId = null;
      });
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <section className="container">
      <nav className="nav">
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#about"  onClick={(e) => {
          e.preventDefault();
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    }}>About</a></li>
          <li><a href="#contact">Contacts</a></li>
          <li><a href="#signup">Sign in</a></li>
        </ul>
      </nav>
      <Home />
      <section id="about" style={{ scrollMarginTop: '120px' }}>
      <About />
      </section>
      <section id="contact" style={{scrollMarginTop: '120px'}}>
        <Contact/>
      </section>
      <section id="signup" style={{scrollMarginTop: '120px'}}> 
        <Signup />
      </section>
    </section>
    
    
  );
}

export default Landing;