// src/components/Header.tsx
"use client"; // Ensures this component is a client component

import React from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for newer versions
import Image from 'next/image';

const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Implement actual logout logic here if needed
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
        <Image src="/logo.png" alt="Logo" width={40} height={40} />
        <h1 className="ml-2 text-xl font-bold">SmartChefAi</h1>
      </div>

    </header>
  );
};

export default Header;
