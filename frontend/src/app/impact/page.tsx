"use client";

import { motion } from "framer-motion";
import { Users, FileText, Globe, Building2 } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import PageShell from "@/components/shared/PageShell";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import ImpactMap from "@/components/shared/ImpactMap";
import CountUp from "@/components/reactbits/CountUp";

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function ImpactPage() {
  const aggregateStats = [
    { label: "Total Citizens Reached", value: 1400000000, suffix: "+", icon: Users, color: "text-amber-400", accent: "bg-amber-500/10 text-amber-400" },
    { label: "Applications Processed", value: 8400, suffix: "+", icon: FileText, color: "text-purple-400", accent: "bg-purple-500/10 text-purple-400" },
    { label: "Languages Supported", value: 22, suffix: "", icon: Globe, color: "text-emerald-400", accent: "bg-emerald-500/10 text-emerald-400" },
    { label: "States Covered", value: 36, suffix: "", icon: Building2, color: "text-blue-400", accent: "bg-blue-500/10 text-blue-400" },
  ];

  return (
    <>
      <Navbar />
      <PageShell>
        <main className="pt-36 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold tracking-wide uppercase mb-4 border border-purple-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
              </span>
              Live Platform Metrics
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] tracking-tight mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Impact</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Bridging the gap between welfare policies and citizens across India through voice-first AI.
            </p>
          </motion.div>

          {/* Aggregate Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {aggregateStats.map((stat, i) => (
              <motion.div key={i} variants={staggerItem}>
                <SpotlightCard className="glass rounded-2xl p-6 border border-white/[0.04] h-full flex flex-col justify-center items-center text-center">
                  <div className={`p-3 rounded-xl ${stat.accent} mb-4 inline-flex`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className={`text-3xl lg:text-4xl font-bold font-[family-name:var(--font-display)] tabular-nums mb-2 ${stat.color}`}>
                    <CountUp to={stat.value} duration={2} delay={0.2 * i} separator="," />
                    {stat.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Map and Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Map Column */}
            <div className="lg:col-span-2">
              <ImpactMap />
            </div>

            {/* Recent Activity / Details Column */}
            <div className="glass rounded-3xl p-6 border border-white/[0.05] flex flex-col">
              <h3 className="text-xl font-semibold mb-6 font-[family-name:var(--font-display)]">State Performance</h3>
              <div className="space-y-6 flex-1">
                {[
                  { state: "Uttar Pradesh", count: "2.4K", percentage: 85, color: "bg-purple-500" },
                  { state: "Maharashtra", count: "1.8K", percentage: 70, color: "bg-indigo-500" },
                  { state: "Bihar", count: "1.2K", percentage: 55, color: "bg-blue-500" },
                  { state: "Madhya Pradesh", count: "950", percentage: 45, color: "bg-cyan-500" },
                  { state: "Karnataka", count: "720", percentage: 35, color: "bg-emerald-500" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-white/90">{item.state}</span>
                      <span className="text-white/60">{item.count} apps</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${item.color} rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-sm text-purple-200/80 italic">
                  "Adhikaar is currently expanding support for regional state-specific schemes in South India and the North East."
                </p>
              </div>
            </div>
          </motion.div>
        </main>
      </PageShell>
    </>
  );
}
