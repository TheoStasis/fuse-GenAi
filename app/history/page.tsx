"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import ExpandableNode from "../components/ExpandableNode";
import { Clock, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Spline from '@splinetool/react-spline';

interface HistoryEntry {
  _id: string;
  topic: string;
  interest: string;
  result: {
    analogy: string;
    raw_mapping: {
      mappings: any[];
    };
  };
  createdAt: string;
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [splineRef, setSplineRef] = useState<any>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch history on mount
  useEffect(() => {
    if (status === "authenticated") {
      fetchHistory();
    }
  }, [status]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (data.success) {
        setHistory(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this history entry?")) return;

    try {
      const res = await fetch(`/api/history?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setHistory(history.filter((entry) => entry._id !== id));
        if (selectedEntry?._id === id) {
          setSelectedEntry(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete history:", error);
      alert("Failed to delete history entry");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBackgroundClick = () => {
    setSelectedEntry(null);
  };

  return (
    <main className="min-h-screen bg-[#09090B] relative selection:bg-blue-500/30 font-sans">
      
      {/* Spline Background */}
      <div className="fixed inset-0 z-0 bg-[#09090B]">
        <Spline 
          scene="https://prod.spline.design/vGQwr-uT48fPnPpM/scene.splinecode"
          onLoad={(spline: any) => {
            setSplineRef(spline);
          }}
        />
      </div>

      {/* UI Layer */}
      <div className="relative z-10 pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
        
        <div className="pointer-events-auto">
          <Navbar isSignedIn={status === "authenticated"} />
        </div>

        {/* Header */}
        <div className="mb-8 pointer-events-auto">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Generator</span>
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-blue-400" size={24} />
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
              History
            </h1>
          </div>
          <p className="text-gray-400">View and manage your past analogy searches</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20 pointer-events-auto">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20 pointer-events-auto">
            <div className="bg-neutral-900/60 backdrop-blur-md border border-white/10 p-12 rounded-3xl max-w-md mx-auto">
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No History Yet</h2>
              <p className="text-gray-400 mb-6">Your past searches will appear here</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
              >
                Create Your First Analogy
              </Link>
            </div>
          </div>
        ) : (
          <div
            className="grid md:grid-cols-2 gap-6 pointer-events-auto"
            onClick={handleBackgroundClick}
          >
            {/* History List */}
            <div className="space-y-4">
              {history.map((entry) => (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-black/60 backdrop-blur-xl border rounded-2xl p-4 cursor-pointer transition-all ${
                    selectedEntry?._id === entry._id
                      ? "border-blue-500/50 shadow-[0_0_40px_-10px_rgba(59,130,246,0.4)]"
                      : "border-white/10 hover:border-blue-500/30"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedEntry?._id === entry._id) {
                      setSelectedEntry(null);
                    } else {
                      setSelectedEntry(entry);
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                          {entry.topic}
                        </div>
                        <span className="text-gray-600">→</span>
                        <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                          {entry.interest}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{formatDate(entry.createdAt)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(entry._id);
                      }}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Selected Entry Details */}
            <AnimatePresence>
              {selectedEntry && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="sticky top-32"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden">
                    
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 bg-black/40">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                            {selectedEntry.topic}
                          </div>
                          <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                            {selectedEntry.interest}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(selectedEntry.createdAt)}
                        </div>
                      </div>
                      <div className="w-full h-px bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-8 max-h-[calc(100vh-300px)] overflow-y-auto">
                      {/* Main Analogy Story */}
                      <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">
                          Analogy
                        </h3>
                        <p className="text-base leading-relaxed font-light text-gray-200">
                          {selectedEntry.result.analogy}
                        </p>
                      </div>

                      {/* Expandable Nodes */}
                      <div className="space-y-4">
                        {selectedEntry.result.raw_mapping?.mappings?.map((item: any, i: number) => (
                          <ExpandableNode key={i} item={item} />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>
    </main>
  );
}

