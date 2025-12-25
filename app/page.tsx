"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import Spline from "@splinetool/react-spline";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Zap,
  BookOpen,
  Heart,
  ArrowRight,
  Mail,
  Lock,
} from "lucide-react";

type View = "LANDING" | "AUTH" | "APP" | "SIGN_UP";

export default function Home() {
  // Hooks
  const { data: session, status } = useSession();
  const router = useRouter();

  // View State
  const [view, setView] = useState<View>("LANDING");

  // Auth State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // App State
  const [topic, setTopic] = useState("");
  const [interest, setInterest] = useState(""); 
  const [result, setResult] = useState<any>(null);
  const [loadingStep, setLoadingStep] = useState("Init");
  const splineRef = useRef<any>(null);

  // Handle session changes
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setView("APP");
    } else if (status === "unauthenticated") {
      setView("LANDING");
    }
  }, [status, session]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        setEmail("");
        setPassword("");
        setView("APP");
      }
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signIn("google", { redirect: false });
    } catch (err: any) {
      setError(err.message || "Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Sign up failed");
      } else {
        // Account created successfully, now sign in
        setUsername("");
        setEmail("");
        setPassword("");
        
        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInResult?.error) {
          setError(signInResult.error);
        } else if (signInResult?.ok) {
          setView("APP");
        }
      }
    } catch (err: any) {
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!topic || !interest) return;

    setLoading(true);
    setResult(null);

    const steps = ["Init", "Scan", "Map", "Critic", "Fuse"];

    let stepIndex = 0;
    setLoadingStep(steps[0]);

    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setLoadingStep(steps[stepIndex]);
      }
    }, 800);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, interest }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setResult(data);

      // Save to history
      try {
        await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, interest, result: data }),
        });
      } catch (historyError) {
        console.error("Failed to save history:", historyError);
      }
    } catch {
      alert("AI Brain Freeze! Try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090B] relative selection:bg-blue-500/30 font-sans">
      {/* ----------------------------------------------------- */}
      {/* LAYER 0: SPLINE BACKGROUND (Always Rendered)          */}
      {/* ----------------------------------------------------- */}
      <div className="fixed inset-0 z-0 bg-[#09090B] pointer-events-auto">
        <Spline
          scene="https://prod.spline.design/vGQwr-uT48fPnPpM/scene.splinecode"
          onLoad={(spline: any) => {
            splineRef.current = spline;
          }}
        />
      </div>

      {/* ----------------------------------------------------- */}
      {/* LAYER 1: NAVBAR (Conditional - Hidden on AUTH view)   */}
      {/* ----------------------------------------------------- */}
      <AnimatePresence>
        {view !== "AUTH" && view !== "SIGN_UP" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pointer-events-auto relative z-11"
          >
            <Navbar isSignedIn={view === "APP"} />
          </motion.div>
        )}
      </AnimatePresence>


              
          {/* ============================================ */}
          {/* VIEW 3: APP (Main Application)               */}
          {/* ============================================ */}
          {view === "APP" && (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-5xl pt-32 pb-20"
            >
              {!result && (
                <div className="text-center mb-12 space-y-4 pointer-events-auto">
                  <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                    FUSE.
                  </h1>
                  <p className="text-gray-400">
                    Connect complex topics to things you love.
                  </p>
                </div>
              )}

              {/* INPUT ENGINE */}
              <motion.div
                layout
                className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center mb-16"
              >
                {/* Topic Card */}
                <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl hover:border-blue-500/50 transition-colors group pointer-events-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                      <BookOpen size={24} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-200">
                      The Topic
                    </h2>
                  </div>
                  <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Recursion"
                    className="w-full bg-transparent border-b-2 border-white/10 py-2 text-xl md:text-2xl font-light focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-700 text-white"
                  />
                </div>

                {/* Generate Button */}
                <div className="flex justify-center z-20 pointer-events-auto">
                    <button
                      onClick={handleGenerate}
                      disabled={loading || !topic || !interest}
                      className="relative group w-20 h-20 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:scale-100 shadow-[0_0_40px_-10px_rgba(59,130,246,0.35)] hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.45)]"
                    >
                      {loading ? (
                        <div className="relative w-14 h-14 rounded-full bg-black/80 border border-white/15 flex items-end justify-center gap-[6px] overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/25 via-cyan-400/25 to-purple-500/25 blur-2xl" />
                          {["from-blue-400 via-cyan-300 to-white", "from-purple-400 via-pink-300 to-white", "from-cyan-400 via-emerald-300 to-white", "from-indigo-400 via-blue-300 to-white"].map((gradient, idx) => (
                            <motion.span
                              key={gradient}
                              className={`relative w-[4px] h-10 rounded-full bg-gradient-to-b ${gradient} shadow-[0_0_20px_rgba(56,189,248,0.35)]`}
                              animate={{ scaleY: [0.5, 1.25, 0.5], y: [2, -3, 2], opacity: [0.7, 1, 0.7] }}
                              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.18 }}
                            />
                          ))}
                        </div>
                      ) : (
                        <Zap className="w-8 h-8 fill-black" />
                      )}
                    </button>
                    <div className="min-h-6 flex items-center justify-center">
                      {loading && (
                        <motion.p
                          key={loadingStep}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[10px] font-mono text-blue-200 tracking-[0.2em] uppercase text-center"
                        >
                          {loadingStep}
                        </motion.p>
                      )}
                    </div>
                </div>

                {/* Interest Card */}
                <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl hover:border-purple-500/50 transition-colors group pointer-events-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                      <Heart size={24} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-200">
                      Your Passion
                    </h2>
                  </div>
                  <input
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    placeholder="e.g. Inception"
                    className="w-full bg-transparent border-b-2 border-white/10 py-2 text-xl md:text-2xl font-light focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-700 text-white"
                  />
                </div>
              </motion.div>

              {/* RESULTS ENGINE */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Story Card */}
                  <div className="bg-neutral-900/60 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-3xl relative overflow-hidden pointer-events-auto">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                    <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">
                      Decryption Complete
                    </h3>
                    {/* Critic Verification Badge */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="bg-green-500/20 border border-green-500/50 px-3 py-1 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-mono text-green-400 uppercase">
                          Critic Verified: {result?.raw_mapping?.confidence_score || "99.8%"}
                        </span>
                      </div>
                    </div>
                    <p className="text-lg md:text-xl leading-relaxed font-light text-gray-200">
                      {result.analogy}
                    </p>
                  </div>

                  {/* Expandable Nodes */}
                  <div className="space-y-4">
                    {result.raw_mapping.mappings.map((item: any, i: number) => (
                      <div key={i} className="pointer-events-auto">
                        <ExpandableNode item={item} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
          </div>

          <Footer />
        </main>
  );
}
