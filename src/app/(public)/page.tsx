import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ArrowRight } from 'lucide-react';
import { getPlaceholderImage } from '@/lib/placeholder-images';

export default function WelcomePage() {
  const heroImage = getPlaceholderImage('dashboard-hero');
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                Sign Up <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid lg:grid-cols-2 gap-12 items-center py-24 md:py-32">
            <div className="flex flex-col gap-6 text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Welcome to Twilight Hub
                </h1>
                <p className="max-w-[600px] mx-auto lg:mx-0 text-muted-foreground md:text-xl">
                    A multi-functional application designed for modern needs, combining user management, organizational collaboration, and social features with a futuristic twilight purple design.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button size="lg" asChild>
                        <Link href="/signup">
                            Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="#">Learn More</Link>
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
                />
            </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container py-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Twilight Hub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
