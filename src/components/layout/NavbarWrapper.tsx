"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Hide the navbar on any admin route
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  return <Navbar />;
}
