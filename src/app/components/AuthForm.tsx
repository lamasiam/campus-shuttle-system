import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AuthFormProps {
  onLogin: (user: { id: string; name: string; email: string; role: 'student' | 'admin' | 'driver' | 'coordinator' }) => void;
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin' | 'driver' | 'coordinator'>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - detect role from email
    let userRole: 'student' | 'admin' | 'driver' | 'coordinator' = 'student';
    let userName = 'Student User';
    
    if (loginEmail.includes('admin')) {
      userRole = 'admin';
      userName = 'Admin User';
    } else if (loginEmail.includes('driver')) {
      userRole = 'driver';
      userName = 'John Smith';
    } else if (loginEmail.includes('coordinator')) {
      userRole = 'coordinator';
      userName = 'Coordinator User';
    }
    
    onLogin({
      id: '1',
      name: userName,
      email: loginEmail,
      role: userRole,
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: '2',
      name: registerName,
      email: registerEmail,
      role: role,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Campus Shuttle System</CardTitle>
          <CardDescription>Sign in to track and book shuttle rides</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your.email@campus.edu"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-medium">Quick Login Tips:</p>
                  <p>• Use "student" in email for student access</p>
                  <p>• Use "driver" in email for driver access</p>
                  <p>• Use "coordinator" in email for coordinator access</p>
                  <p>• Use "admin" in email for admin access</p>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="John Doe"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your.email@campus.edu"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'student' | 'admin' | 'driver' | 'coordinator')}
                    className="w-full px-3 py-2 border border-input rounded-md"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                    <option value="driver">Driver</option>
                    <option value="coordinator">Coordinator</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}