"use client";

import { motion } from "framer-motion";

export default function ImpactMap() {
  // A highly simplified abstract representation of India for demo purposes.
  // In a real production app, you would use a library like react-simple-maps or a detailed SVG.
  const regions = [
    { id: "north", label: "North India", d: "M 130 20 L 170 20 L 190 70 L 150 110 L 110 80 Z", density: 85, color: "fill-purple-500/80" },
    { id: "west", label: "West India", d: "M 110 80 L 150 110 L 130 190 L 70 150 Z", density: 70, color: "fill-indigo-500/80" },
    { id: "central", label: "Central India", d: "M 150 110 L 220 120 L 200 190 L 130 190 Z", density: 95, color: "fill-purple-600/90" },
    { id: "east", label: "East India", d: "M 220 120 L 280 130 L 260 200 L 200 190 Z", density: 60, color: "fill-indigo-400/70" },
    { id: "northeast", label: "North East", d: "M 280 130 L 340 110 L 360 150 L 300 170 Z", density: 40, color: "fill-purple-400/60" },
    { id: "south", label: "South India", d: "M 130 190 L 200 190 L 180 290 L 150 310 Z", density: 80, color: "fill-indigo-600/90" }
  ];

  return (
    <div className="relative w-full min-h-[400px] glass rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8 border border-white/[0.05]">
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-xl font-semibold font-[family-name:var(--font-display)]">National Reach</h3>
        <p className="text-sm text-muted-foreground">Density of schemes unlocked by region</p>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2 bg-black/40 p-4 rounded-xl backdrop-blur-md border border-white/[0.05]">
        <div className="text-xs font-medium text-white/70 mb-1">Impact Density</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-600/90"></div>
          <span className="text-xs text-white/60">High (Central, North)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500/80"></div>
          <span className="text-xs text-white/60">Medium (South, West)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-400/60"></div>
          <span className="text-xs text-white/60">Low (North East, East)</span>
        </div>
      </div>

      <motion.svg 
        viewBox="0 0 400 350" 
        className="w-full h-full max-w-md drop-shadow-2xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {/* Glow effect behind the map */}
        <circle cx="200" cy="175" r="100" fill="rgba(168, 85, 247, 0.15)" filter="blur(40px)" />
        
        {regions.map((region) => (
          <motion.g key={region.id} className="group relative cursor-pointer">
            <motion.path
              d={region.d}
              className={`${region.color} stroke-white/10 stroke-[2px] transition-all duration-300 group-hover:brightness-125 group-hover:stroke-white/30`}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
              }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
            />
            <motion.text
              x="0"
              y="0"
              fill="white"
              fontSize="12"
              fontWeight="500"
              className="opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
            >
              <textPath href={`#${region.id}-path`} startOffset="50%" textAnchor="middle">
                {region.label}
              </textPath>
            </motion.text>
          </motion.g>
        ))}
      </motion.svg>
    </div>
  );
}
