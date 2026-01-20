import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Logo/Header */}
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Share a Recipe That Matters
            </h1>
          </div>

          {/* Main Copy */}
          <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
            <p>
              Every recipe tells a story.
            </p>
            <p>
              The recipes we make — for celebrations, after practice, or just because — 
              connect us to the people and moments we treasure most.
            </p>
            <p>
              We're creating a cookbook that celebrates our Special Olympics community, 
              and we'd love to include yours.
            </p>
            <p className="font-medium text-gray-900">
              Your recipe doesn't need to be fancy. It just needs to be yours.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <Link href="/submit">
              <Button size="lg" className="text-lg px-12 py-6 h-auto">
                Share Your Recipe
              </Button>
            </Link>
          </div>

          {/* Small text */}
          <p className="text-sm text-gray-500">
            Takes about 5-10 minutes. You can save and come back anytime.
          </p>

          {/* Admin link (small, bottom) */}
          <div className="pt-12 border-t border-gray-200">
            <Link 
              href="/admin" 
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Admin Access
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
}
