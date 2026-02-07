import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Bus, User, Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay for effect
    setTimeout(() => {
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
      setIsLoading(false);
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: '2',
        name: registerName,
        email: registerEmail,
        role: role,
      });
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 opacity-[0.03]"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[70vh] h-[70vh] rounded-full bg-blue-500/20 blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[70vh] h-[70vh] rounded-full bg-purple-500/20 blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30 transform hover:scale-110 transition-transform duration-300">
            <Bus size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Campus Shuttle</h1>
          <p className="text-slate-500 font-medium">Your ride, simplified.</p>
        </div>

        <Card className="border-0 shadow-2xl shadow-indigo-100 bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden">
          <CardHeader className="pb-0 pt-8 px-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100/80 rounded-2xl mb-6">
                <TabsTrigger 
                  value="login" 
                  className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all"
                >
                  Register
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-0 focus-visible:outline-none">
                <form onSubmit={handleLogin} className="space-y-5 pb-8">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="font-bold text-slate-700">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your.email@campus.edu"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" classNam="font-bold text-slate-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Sign In <ArrowRight size={18} />
                      </span>
                    )}
                  </Button>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="text-xs font-medium text-slate-500 space-y-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2 text-indigo-600 font-bold mb-1">
                        <Sparkles size={14} /> Quick Access Tips:
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2 rounded-lg border border-blue-50 shadow-sm">
                          <span className="block text-[10px] uppercase text-slate-400 font-bold">Student</span>
                          <span className="text-slate-700">student@edu</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-blue-50 shadow-sm">
                          <span className="block text-[10px] uppercase text-slate-400 font-bold">Driver</span>
                          <span className="text-slate-700">driver@edu</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-blue-50 shadow-sm">
                          <span className="block text-[10px] uppercase text-slate-400 font-bold">Coord</span>
                          <span className="text-slate-700">coordinator@edu</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-blue-50 shadow-sm">
                          <span className="block text-[10px] uppercase text-slate-400 font-bold">Admin</span>
                          <span className="text-slate-700">admin@edu</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="mt-0 focus-visible:outline-none">
                <form onSubmit={handleRegister} className="space-y-4 pb-8">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="font-bold text-slate-700">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="John Doe"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                        className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="font-bold text-slate-700">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your.email@campus.edu"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                        className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" classNam="font-bold text-slate-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="font-bold text-slate-700">Role</Label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                      <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as 'student' | 'admin' | 'driver' | 'coordinator')}
                        className="w-full pl-12 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                        <option value="driver">Driver</option>
                        <option value="coordinator">Coordinator</option>
                      </select>
                      <div className="absolute right-4 top-4 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
        
        <p className="text-center text-slate-400 text-sm mt-8 font-medium">
          © 2026 Campus Shuttle System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
