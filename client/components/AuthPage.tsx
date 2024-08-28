"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    // Add your authentication logic here
    // For demonstration, we'll just set an error
    setError("Invalid credentials. Please try again.");
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-lg bg-white/80 backdrop-blur-sm">
      <h2 className="font-bold text-2xl text-neutral-800 mb-2">
        Welcome to SmartChefAI
      </h2>
      <p className="text-neutral-600 text-sm mb-4">
        {isLogin
          ? "Log in to access your personalized cooking book."
          : "Join us to start your culinary journey with AI-powered recipe management."}
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <LabelInputContainer className="flex-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" type="text" />
              </LabelInputContainer>
              <LabelInputContainer className="flex-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" type="text" />
              </LabelInputContainer>
            </div>
            <LabelInputContainer>
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="johndoe" type="text" />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" placeholder="john@example.com" type="email" />
            </LabelInputContainer>
          </>
        )}
        {isLogin && (
          <LabelInputContainer>
            <Label htmlFor="login-username">Username</Label>
            <Input id="login-username" placeholder="johndoe" type="text" />
          </LabelInputContainer>
        )}
        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white w-full py-2 rounded-md font-medium shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          type="submit"
        >
          {isLogin ? "Log In" : "Sign Up"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={toggleAuthMode}
          className="text-sm text-purple-600 hover:text-purple-800 transition duration-300 ease-in-out"
        >
          {isLogin ? "New to SmartChefAI? Sign Up" : "Already a chef? Log In"}
        </button>
      </div>
    </div>
  );
}

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