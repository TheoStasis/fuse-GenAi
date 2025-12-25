"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Sparkles } from "lucide-react";

export default function ExpandableNode({ item }: { item: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverConcept, setHoverConcept] = useState(false);
  const [hoverAnalogy, setHoverAnalogy] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
          isOpen 
            ? "bg-neutral-900/90 border-blue-500/50 shadow-[0_0_40px_-10px_rgba(59,130,246,0.4)]" 
            : "bg-black/60 border-white/10 hover:bg-white/5 hover:border-blue-500/30"
        }`}
      >
        {/* The "Closed" Header View */}
        <div className="flex items-center justify-between p-6 relative z-10">
          
          {/* Left: Technical */}
          <div 
            className="flex items-center gap-4 text-left relative"
            onMouseEnter={() => setHoverConcept(true)}
            onMouseLeave={() => setHoverConcept(false)}
          >
            <div className={`p-3 rounded-xl transition-colors ${isOpen ? "bg-blue-600/20 text-blue-400" : "bg-white/5 text-gray-500"} ${hoverConcept ? "bg-blue-600/30 text-blue-300 scale-110" : ""}`}>
              <Code size={20} />
            </div>
            <div className="relative">
              <div className="text-[10px] uppercase tracking-widest text-blue-400/60 font-mono mb-1">Concept</div>
              <div className="text-lg font-bold text-white">{item.technical_term}</div>
              
              {/* Hover Tooltip */}
              <AnimatePresence>
                {hoverConcept && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-blue-950/95 border border-blue-500/50 rounded-lg shadow-xl z-50 backdrop-blur-sm"
                  >
                    <div className="text-xs font-semibold text-blue-300 mb-1">Technical Concept</div>
                    <div className="text-xs text-gray-300 leading-relaxed">
                      {item.technical_definition?.substring(0, 120)}
                      {item.technical_definition && item.technical_definition.length > 120 ? "..." : ""}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Center: Animated Connector (Desktop Only) */}
          <div className="hidden md:flex flex-1 items-center justify-center px-6 relative">
            {/* Animated gradient line with pulse effect */}
            <div className="relative w-full h-1 overflow-hidden">
              {/* Base gradient line */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-blue-500/50 to-purple-900/30 group-hover:from-blue-600/60 group-hover:via-white/60 group-hover:to-purple-600/60 transition-all duration-700" />
              
              {/* Animated moving gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ width: "50%" }}
              />
              
              {/* Pulsing particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full blur-sm"
                  animate={{
                    x: ["0%", "100%"],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: "easeInOut",
                  }}
                  style={{ left: `${i * 30}%` }}
                />
              ))}
            </div>
          </div>

          {/* Right: Analogy */}
          <div 
            className="flex items-center gap-4 text-right relative"
            onMouseEnter={() => setHoverAnalogy(true)}
            onMouseLeave={() => setHoverAnalogy(false)}
          >
            <div className="relative">
              <div className="text-[10px] uppercase tracking-widest text-purple-400/60 font-mono mb-1">Analogy</div>
              <div className="text-lg font-bold text-white">{item.analogy_term}</div>
              
              {/* Hover Tooltip */}
              <AnimatePresence>
                {hoverAnalogy && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-purple-950/95 border border-purple-500/50 rounded-lg shadow-xl z-50 backdrop-blur-sm"
                  >
                    <div className="text-xs font-semibold text-purple-300 mb-1">Creative Analogy</div>
                    <div className="text-xs text-gray-300 leading-relaxed">
                      {item.analogy_explanation?.substring(0, 120)}
                      {item.analogy_explanation && item.analogy_explanation.length > 120 ? "..." : ""}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className={`p-3 rounded-xl transition-colors ${isOpen ? "bg-purple-600/20 text-purple-400" : "bg-white/5 text-gray-500"} ${hoverAnalogy ? "bg-purple-600/30 text-purple-300 scale-110" : ""}`}>
              <Sparkles size={20} />
            </div>
          </div>
        </div>

        {/* The "Expanded" Deep Dive View */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="relative overflow-hidden"
            >
              {/* The "Translation Layer" (Code vs Story) */}
              <div className="px-6 py-4 bg-black/40 border-y border-white/5 flex items-center justify-center gap-4 font-mono text-xs md:text-sm text-gray-400 overflow-x-auto">
                <span className="text-blue-300">{item.code_analogy_left || "Logic(x)"}</span>
                <span className="text-white/20">==</span>
                <span className="text-purple-300">{item.code_analogy_right || "Story(y)"}</span>
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-8 text-left relative z-10">
                {/* Technical Column */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Technical Definition
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.technical_definition}
                  </p>
                </div>

                {/* Analogy Column */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Why it fits
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.analogy_explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}