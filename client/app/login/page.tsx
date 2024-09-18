import React from 'react';
import { LoginPage } from '@/components/LoginPage';
import Link from 'next/link';

export default function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-radial from-[#3F5EFB] via-[#9653B9] to-[#FC446B] p-4">
      <LoginPage />
      <div className="mt-4 text-center">
          <a href="/signup" className="text-sm hover:text-purple-800 transition duration-300 ease-in-out text-black">
            New to SmartChefAI? Sign Up
          </a>
      </div>
    </main>
  );
}
