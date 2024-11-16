// DONT FORGET TO PUT THESE OR IT WONT BE INTERACTABLE
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {

  return (
    <div className='home-page background'>
      <div className='home-page-buttons'>
        <h1 className='title-text'>Blood Lab</h1>
        <Link href="/appointments" className='large-button-1'>APPOINTMENTS</Link>
      </div>

      <img src="/home-wave.svg" className='home-wave' />
    </div>
  );
}
