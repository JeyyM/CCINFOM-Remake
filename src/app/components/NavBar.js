"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
      const pathname = usePathname();

      const [isVisible, setIsVisible] = useState(true);
      const [lastScrollY, setLastScrollY] = useState(0);
    
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
    
        if (currentScrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
    
        setLastScrollY(currentScrollY);
      };
    
      useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, [lastScrollY]);
    
      return (
        <nav className={`navbar ${isVisible ? '' : 'hidden'}`}>
      <Link href="/"  className='to-home text-medium-dark-2'>BLOOD LAB</Link>

      <div className='nav-pair'>
      <Link className='nav-pill nav-pill-left nav-white' href="/appointments">
        <h2>ADD</h2>
      </Link>

      <Link className='nav-pill nav-pill-right nav-white' href="/appointments">
        <h2>VIEW</h2>
      </Link>


      </div>

      <Link className='nav-item nav-white' href="/appointments">
        <h2>APPOINTMENTS</h2>
        <div className={`nav-shadow ${pathname === '/appointments' ? 'active' : ''}`}></div>
      </Link>

      <Link className='nav-item nav-white' href="/records">
        <h2>PATIENTS</h2>
        <div className={`nav-shadow ${pathname === '/records' ? 'active' : ''}`}></div>
      </Link>

      <Link className='nav-item nav-white' href="/employees">
        <h2>EMPLOYEES</h2>
        <div className={`nav-shadow ${pathname === '/employees' ? 'active' : ''}`}></div>
      </Link>

      <Link className='nav-item nav-white' href="/blood-tests">
        <h2>TESTS</h2>
        <div className={`nav-shadow ${pathname === '/blood-tests' ? 'active' : ''}`}></div>
      </Link>

      {/* <Link className='nav-item' href="/records">
        <h2>RECORDS</h2>
        <div className={`nav-shadow ${pathname === '/records' ? 'active' : ''}`}></div>
      </Link> */}
    </nav>
  );
}
