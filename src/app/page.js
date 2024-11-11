// DONT FORGET TO PUT THESE OR IT WONT BE INTERACTABLE
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {

  return (
    <div className='vertical'>
      <h1>Main Menu</h1>

      <Link href="/query">Queries Sample</Link>
      <Link href="/input">Adding Sample</Link>

      <Link href="/add">Add New Appointment</Link>
      <Link href="/appointments">Manage Appointments</Link>
      <Link href="/employees">Manage Employees</Link>
      <Link href="/records">Manage Records</Link>
      <Link href="/blood-tests">Manage Blood Tests</Link>
    </div>
  );
}
