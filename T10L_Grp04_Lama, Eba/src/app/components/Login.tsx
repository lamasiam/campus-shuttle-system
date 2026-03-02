import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Bus, Mail, Lock, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import api from '../../services/api';

interface LoginProps {
  onLogin: (user: { id: string; name: string; email: string; role: 'student' | 'admin' | 'driver' | 'coordinator' }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      if (res?.success && res?.user) {
        if (res.token) {
          localStorage.setItem('shuttle_token', res.token);
        }
        onLogin({
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
        });
        toast.success('Logged in successfully');
      } else {
        toast.error(res?.error || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (role: 'admin' | 'driver' | 'coordinator' | 'student') => {
    const presets = {
      admin: { email: 'admin@campus.edu', password: 'admin123' },
      driver: { email: 'driver1@campus.edu', password: 'driver123' },
      coordinator: { email: 'coordinator@campus.edu', password: 'coord123' },
      student: { email: 'student1@campus.edu', password: 'student123' },
    } as const;
    setEmail(presets[role].email);
    setPassword(presets[role].password);
    toast.info(`Filled ${role} credentials`);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <Toaster position="top-right" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.25)_0%,transparent_60%)]" />
      <div className="relative w-full max-w-md px-4 py-8">
        <Card className="backdrop-blur-md bg-white/80 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto size-12 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white">
              <Bus className="size-6" />
            </div>
            <CardTitle className="mt-4">Campus Shuttle System</CardTitle>
            <CardDescription>Sign in to book rides and track shuttles</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@campus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500"
              >
                {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => quickFill('student')}
                  className="w-full"
                >
                  Student
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => quickFill('driver')}
                  className="w-full"
                >
                  Driver
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => quickFill('coordinator')}
                  className="w-full"
                >
                  Coordinator
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => quickFill('admin')}
                  className="w-full"
                >
                  Admin
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Use provided campus accounts to sign in
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
