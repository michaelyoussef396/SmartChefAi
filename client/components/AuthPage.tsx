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

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(false); // Default to sign-up mode
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const data = isLogin
      ? {
          email: formData.get("email"),
          password: formData.get("password"),
        }
      : {
          first_name: formData.get("firstName"),
          last_name: formData.get("lastName"),
          email: formData.get("email"),
          password: formData.get("password"),
        };

    try {
      const response = await fetch(
        isLogin ? "http://127.0.0.1:5555/login" : "http://127.0.0.1:5555/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        if (isLogin) {
          setSuccess("Logged in successfully!");
          // Handle redirection or other logic here
        } else {
          setSuccess("Registration successful! Please log in.");
          setIsLogin(true); // Switch to login mode after successful registration
        }
      } else {
        const errorData = await response.json();
        console.log("Error:", errorData);
        setError(errorData.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-lg bg-white/80 backdrop-blur-sm">
      <h2 className="font-bold text-2xl text-neutral-800 mb-2">
        {isLogin ? "Log In" : "Sign Up"} to SmartChefAI
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
                <Input id="firstName" name="firstName" placeholder="John" type="text" required />
              </LabelInputContainer>
              <LabelInputContainer className="flex-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" placeholder="Doe" type="text" required />
              </LabelInputContainer>
            </div>
            <LabelInputContainer>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" placeholder="john@example.com" type="email" required />
            </LabelInputContainer>
          </>
        )}
        {isLogin && (
          <>
            <LabelInputContainer>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" placeholder="john@example.com" type="email" required />
            </LabelInputContainer>
          </>
        )}
        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" placeholder="••••••••" type="password" required />
        </LabelInputContainer>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

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
