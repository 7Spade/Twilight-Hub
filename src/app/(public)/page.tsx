import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ArrowRight } from 'lucide-react';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { AuthNavigation } from '@/components/auth';

export default function PublicHomePage() {
  const heroImage = getPlaceholderImage('dashboard-hero');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <AuthNavigation />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container grid lg:grid-cols-2 gap-12 items-center py-24 md:py-32">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Welcome to Twilight Hub
            </h1>
            <p className="max-w-[600px] mx-auto lg:mx-0 text-muted-foreground md:text-xl">
              A modern platform for collaboration, organization, and workspace management. 
              Streamline your workflow with our intuitive tools and powerful features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <Image
              src={heroImage.imageUrl}
              alt="Twilight Hub Dashboard"
              width={1200}
              height={800}
              className="rounded-lg shadow-2xl"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-primary font-bold text-lg">👥</span>
              </div>
              <h3 className="text-xl font-semibold">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Work together seamlessly with real-time collaboration tools and shared workspaces.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-primary font-bold text-lg">📁</span>
              </div>
              <h3 className="text-xl font-semibold">Organization</h3>
              <p className="text-muted-foreground">
                Keep your projects and files organized with intuitive folder structures and tagging.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-primary font-bold text-lg">⚡</span>
              </div>
              <h3 className="text-xl font-semibold">Performance</h3>
              <p className="text-muted-foreground">
                Built for speed and reliability with modern technology and optimized workflows.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Twilight Hub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}