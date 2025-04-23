'use client';

import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Github, LineChart, GitPullRequest, Star, Zap } from "lucide-react"
import { User } from '@supabase/supabase-js';
import { Badge } from "@/components/ui/badge";
import { ApiDemo } from "@/components/api-demo";

function HomeContent() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-6 w-6" />
              <span className="hidden sm:inline-block font-bold text-center">Tuan Anh Cursor</span>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-4">
            <nav className="hidden md:flex items-center justify-center gap-6">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary text-center"
              >
                Features
              </Link>
              <Link
                href="#demo"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary mx-4"
              >
                Demo
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary text-center"
              >
                Pricing
              </Link>
            </nav>
            <div className="flex items-center justify-center gap-2">
              {user ? (
                <>
                  <span className="text-white mr-2">{user.email}</span>
                  <Link href="/dashboards">
                    <Button variant="outline" size="sm" className="hidden sm:flex hover:bg-gray-100/10 border-2 transition-all duration-200">
                      Dashboard
                    </Button>
                  </Link>
                  <Button size="sm" onClick={handleSignOut} className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-0 transition-all duration-200">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm" className="hidden sm:flex hover:bg-gray-100/10 border-2 transition-all duration-200">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 border-0 shadow-md hover:shadow-lg transition-all duration-200">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-center">
              GitHub Repository Insights Made Simple
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-center">
              Get summaries, stats, cool facts, and important updates for any open source GitHub repository. Manage all
              your API keys in one place.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                  Get Started for Free
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 hover:bg-gray-100/10 transition-all duration-200">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section id="features" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
              Powerful Repository Insights
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 text-center">
              Stay updated on your favorite open source projects with comprehensive analytics and insights.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Card>
              <CardHeader>
                <LineChart className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">Repository Summaries</CardTitle>
                <CardDescription>Get concise summaries of repository activity and health at a glance.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Star className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">Star Analytics</CardTitle>
                <CardDescription>Track star growth and understand popularity trends over time.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Github className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">Cool Facts</CardTitle>
                <CardDescription>Discover interesting facts and statistics about repositories.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <GitPullRequest className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">PR Insights</CardTitle>
                <CardDescription>Stay updated on important pull requests and contributions.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">Version Updates</CardTitle>
                <CardDescription>Get notified about new releases and version changes.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Check className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">API Key Management</CardTitle>
                <CardDescription>Securely manage all your GitHub API keys in one place.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
        <section id="demo" className="container space-y-6 py-8 md:py-12 lg:py-24 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Try Our API</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              See how easy it is to validate and manage your API keys with our service.
            </p>
          </div>
          <div className="mt-8">
            <ApiDemo />
          </div>
        </section>
        <section id="pricing" className="container space-y-6 py-8 md:py-12 lg:py-24 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">Simple, Transparent Pricing</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 text-center">
              Choose the plan that&apos;s right for you, whether you&apos;re just exploring or need advanced insights.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 mx-auto max-w-[90rem]">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <div className="text-3xl font-bold">$0</div>
                <CardDescription>Perfect for exploring the platform</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>5 repository insights</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Basic summaries</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Star analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Email notifications</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/signup" className="w-full">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="flex flex-col border-primary relative">
              <Badge className="absolute -top-3 -right-3 px-3 py-1" variant="default">
                Coming Soon
              </Badge>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="text-3xl font-bold">$19</div>
                <CardDescription>For developers who need more insights</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>25 repository insights</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Advanced summaries</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>PR insights</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Version update alerts</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>API access</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col relative">
              <Badge className="absolute -top-3 -right-3 px-3 py-1" variant="default">
                Coming Soon
              </Badge>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="text-3xl font-bold">$99</div>
                <CardDescription>For teams and organizations</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Unlimited repository insights</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Custom analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Custom integrations</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
        <section className="container py-8 md:py-12 lg:py-24 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">Ready to get started?</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 text-center">
              Sign up today and start getting valuable insights for your favorite GitHub repositories.
            </p>
            <Link href="/signup">
              <Button size="lg" className="mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                Sign Up for Free
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 mx-auto px-4 sm:px-6 lg:px-8 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
            <Zap className="h-6 w-6" />
            <p className="text-center text-sm leading-loose">
              &copy; {new Date().getFullYear()} Tuan Anh Cursor. All rights reserved.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline text-center">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline text-center">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
} 