"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, ChefHat, ArrowRightLeft, ScanEye } from "lucide-react";

export default function AnalogyCard({ data, interest }: { data: any, interest: string }) {
  const [mode, setMode] = useState<"analogy" | "technical">("analogy");

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* 1. The "Game HUD" Header */}
      <div className="flex items-center justify-between mb-6 text-xs font-mono text-blue-400 tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <ScanEye className="w-4 h-4 animate-pulse" />
          <span>Decryption Complete</span>
        </div>
        <div className="bg-blue-900/30 border border-blue-500/30 px-3 py-1 rounded-full">
          Domain: {interest}
        </div>
      </div>

      {/* 2. The Holographic Card */}
      <div className="relative group">
        {/* Glow Effect behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        
        <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 overflow-hidden">
          
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* 3. The Interactive Toggle */}
          <div className="flex justify-center mb-10 relative z-10">
            <button 
              onClick={() => setMode(mode === "analogy" ? "technical" : "analogy")}
              className="flex items-center gap-4 bg-neutral-900 border border-white/20 p-2 rounded-full hover:border-white/40 transition-all cursor-pointer group/btn"
            >
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${mode === "technical" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500"}`}>
                Technical
              </span>
              <ArrowRightLeft className="w-4 h-4 text-gray-400 group-hover/btn:rotate-180 transition-transform duration-500" />
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${mode === "analogy" ? "bg-purple-600 text-white shadow-lg" : "text-gray-500"}`}>
                Analogy
              </span>
            </button>
          </div>

          {/* 4. The Content Switcher */}
          <div className="min-h-[200px] relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {mode === "analogy" ? (
                  <>
                    <div className="inline-block p-4 rounded-full bg-purple-500/10 mb-6 border border-purple-500/20">
                       {/* You can map icons dynamically later, for now use a generic one */}
                       <ChefHat className="w-8 h-8 text-purple-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-purple-400 mb-6">
                      "{data.raw_mapping.mappings[0].analogy}..."
                    </h2>
                    <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                      {data.analogy}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="inline-block p-4 rounded-full bg-blue-500/10 mb-6 border border-blue-500/20">
                       <Cpu className="w-8 h-8 text-blue-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400 mb-6">
                      {data.raw_mapping.concept}
                    </h2>
                    <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                      Technically, this is defined as {data.raw_mapping.mappings[0].technical.toLowerCase()}...
                      <span className="block mt-4 text-sm text-gray-500 font-mono">
                        
                      </span>
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
      
      {/* 5. The "Connection Points" (Your Arrows from before, but cleaner) */}
      <div className="mt-12 grid gap-4">
        {data.raw_mapping.mappings.map((item: any, i: number) => (
           <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <span className="text-blue-400 font-mono text-sm">{item.technical}</span>
              <div className="h-px bg-white/10 flex-1 mx-4"></div>
              <span className="text-purple-400 font-bold">{item.analogy}</span>
           </div>
        ))}
      </div>

    </div>
  );
}