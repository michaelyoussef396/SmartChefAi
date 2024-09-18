import React from 'react';
import { SignUpPage } from '@/components/SignUpPage';
import Link from 'next/link';

export default function SignUp() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-radial from-[#3F5EFB] via-[#9653B9] to-[#FC446B] p-4">
      <SignUpPage />
      <div className="mt-4 text-center">
          <a href="/login" className="text-sm text-black hover:text-purple-800 transition duration-300 ease-in-out">
            Already a chef? Log In
          </a>
      </div>
    </main>
  );
}
