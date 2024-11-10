'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function New() {
  return (
      <div>
        <h1>New Subpage</h1>
        <Link href="..">Back</Link>
      </div>
  );
}
