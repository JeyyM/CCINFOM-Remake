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
      <Link href="/"  className='to-home'>BLOOD LAB</Link>

      <Link className='nav-item' href="/appointments">
        <h2>APPOINTMENTS</h2>
        <div className={`nav-shadow ${pathname === '/appointments' ? 'active' : ''}`}></div>
      </Link>

      <Link className='nav-item' href="/employees">
        <h2>EMPLOYEES</h2>
        <div className={`nav-shadow ${pathname === '/employees' ? 'active' : ''}`}></div>
      </Link>

      <Link className='nav-item' href="/blood-tests">
        <h2>TESTS</h2>
        <div className={`nav-shadow ${pathname === '/blood-tests' ? 'active' : ''}`}></div>
      </Link>

      <Link className='nav-item' href="/records">
        <h2>RECORDS</h2>
        <div className={`nav-shadow ${pathname === '/records' ? 'active' : ''}`}></div>
      </Link>
    </nav>
  );
}
