"use client";

import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Spline from "@splinetool/react-spline";
import Link from "next/link";
import { ArrowLeft, Zap, Brain, BookOpen } from "lucide-react";
import { useSession } from "next-auth/react";
import Footer from "../components/Footer";

export default function AboutPage() {
  const { status } = useSession();
  const isSignedIn = status === "authenticated";
  return (
    <main className="min-h-screen bg-[#09090B] relative selection:bg-blue-500/30 font-sans">
      {/* Spline Background */}
      <div className="fixed inset-0 z-0 bg-[#09090B]">
        <Spline scene="https://prod.spline.design/vGQwr-uT48fPnPpM/scene.splinecode" />
      </div>

      {/* Navbar */}
      <div className="pointer-events-auto">
        <Navbar isSignedIn={isSignedIn} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto pointer-events-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6">
              FUSE.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400">
              Where Complex Concepts Meet Your Passions
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            {/* What is FUSE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-blue-500/20">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    What is FUSE?
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    FUSE is an AI-powered analogy generator that transforms the
                    way you learn. Connect any complex topic to anything you're
                    passionate about. Our intelligent system creates vivid,
                    memorable analogies that make difficult concepts click.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-purple-500/20">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    How It Works
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    Pick a topic you want to understand. Tell us what you love.
                    Watch as FUSE crafts a brilliant analogy that bridges the
                    gap between the unknown and what sets your heart on fire.
                    Learning becomes an adventure.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Why FUSE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-pink-500/20">
                  <BookOpen className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Why FUSE?
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    Traditional learning is forgotten. Personalized analogies
                    stick. By connecting concepts to your passions, we tap into
                    what makes your brain light up—creating knowledge that
                    lasts. Your learning journey is unique. So should your
                    education.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16"
          >
            <Link
              href="/"
              className="inline-block group relative px-12 py-6 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full hover:border-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative flex items-center gap-2">
                <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-2 transition-transform" />
                <span className="text-lg font-bold text-white">
                  Back to Home
                </span>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
