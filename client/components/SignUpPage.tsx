"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col w-full", className)}>
      {children}
    </div>
  );
};

export function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5555/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      setSuccess("Registration successful! Please log in.");
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-lg bg-white/80 backdrop-blur-sm">
      <h2 className="font-bold text-2xl text-neutral-800 mb-2">Sign Up for SmartChefAI</h2>
      <p className="text-neutral-600 text-sm mb-4">Join us to start your culinary journey with AI-powered recipe management.</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <LabelInputContainer className="flex-1">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" placeholder="John" type="text" required onChange={(e) => setFirstName(e.target.value)} />
          </LabelInputContainer>
          <LabelInputContainer className="flex-1">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" placeholder="Doe" type="text" required onChange={(e) => setLastName(e.target.value)} />
          </LabelInputContainer>
        </div>
        
        <LabelInputContainer>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" placeholder="john@example.com" type="email" required onChange={(e) => setEmail(e.target.value)} />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" placeholder="••••••••" type="password" required onChange={(e) => setPassword(e.target.value)} />
        </LabelInputContainer>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <button
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white w-full py-2 rounded-md font-medium shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
