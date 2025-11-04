/* import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font= Poppins(
  {
    subsets:["latin"],
    weight:["600"]
  }
)

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_#38bdf8,_#1e40af)]">
      <div className="space-y-6 text-center">
        <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md",font.className,)}>
          Auth
        </h1>
        <p className="text-white text-lg">A Simple Authentication Service</p>
        <div>
          <LoginButton>
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
      
    </main>
  );
}

 */

'use client';
import { signOut, useSession } from "next-auth/react";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Github,
  Chrome,
  ArrowRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { LoginButton } from '@/components/auth/login-button';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setIsVisible(true);
  }, []);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gray-700/10 via-transparent to-transparent"></div>

      <div className="relative">
        <header className="container mx-auto px-6 py-8">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8" />
              <span className="text-2xl font-bold">Dev AI</span>
            </div>

            {status === "loading" ? (
              <p className="text-gray-400">Loading...</p>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-300">
                   Welcome, {session.user?.name || "User"}!
                </span>
                <Button
                  size="sm"
                  className="bg-gray-800 text-white hover:bg-gray-700"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <LoginButton>
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                >
                  Sign In
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </LoginButton>
            )}
            
          </nav>
        </header>

        <main className="container mx-auto px-6">
          <section
            className={`text-center py-20 transition-all duration-1000 transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Badge
              variant="outline"
              className="mb-6 border-white/20 text-white px-4 py-2 text-sm"
            >
              Next.js 14 • Auth.js v5 • TypeScript
            </Badge>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Enterprise-Grade
              <br />
              Authentication
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
              Complete authentication solution with multi-factor security, role-based access control,
              and seamless OAuth integration. Built for modern applications.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <LoginButton>
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </LoginButton>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Chrome className="w-5 h-5" />
                  <Github className="w-5 h-5" />
                  <span className="text-sm">OAuth Ready</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="container mx-auto px-6 py-12 mt-20 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="w-6 h-6" />
              <span className="text-lg font-semibold">Dev AI</span>
            </div>
            <p className="text-gray-500">
              © 2025 Dev AI. Enterprise-grade authentication.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
