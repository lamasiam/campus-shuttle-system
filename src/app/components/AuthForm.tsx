import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Bus, Mail, Lock, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface AuthFormProps {
  onLogin: (email: string, password: string) => void;
}

export default function AuthForm({ onLogin }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(email, password);
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogins = [
    { role: "Student", email: "student1@campus.edu", password: "student123", color: "from-blue-500 to-cyan-500" },
    { role: "Driver", email: "driver1@campus.edu", password: "driver123", color: "from-purple-500 to-pink-500" },
    { role: "Coordinator", email: "coordinator@campus.edu", password: "coord123", color: "from-orange-500 to-red-500" },
    { role: "Admin", email: "admin@campus.edu", password: "admin123", color: "from-green-500 to-teal-500" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
            <Bus className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            Campus Shuttle
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
          </h1>
          <p className="text-white/80 text-lg">Your journey starts here</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-600" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="student@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-300"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-600" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-300"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Bus className="mr-2 h-5 w-5" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Quick Login</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {quickLogins.map((user) => (
              <button
                key={user.role}
                onClick={() => {
                  setEmail(user.email);
                  setPassword(user.password);
                  toast.success(`Filled ${user.role} credentials`);
                }}
                disabled={isLoading}
                className={`p-3 rounded-xl bg-gradient-to-br ${user.color} text-white font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50`}
              >
                {user.role}
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Click quick login buttons to auto-fill credentials
          </p>
        </div>

        <div className="text-center mt-6 text-white/60 text-sm">
          © 2026 Campus Shuttle System
        </div>
      </div>
    </div>
  );
}
