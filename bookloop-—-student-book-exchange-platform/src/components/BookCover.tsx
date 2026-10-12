import React, { useState } from 'react';
import { BookOpen, Code, Atom, HeartPulse, Cog, Binary, BarChart3, Scale, Layers } from 'lucide-react';

interface BookCoverProps {
  title: string;
  author: string;
  category: string;
  edition?: string;
  coverImage?: string;
  palette?: string;
  className?: string;
  aspect?: 'card' | 'detail';
}

const PALETTE_CONFIG: Record<
  string,
  {
    bg: string;
    accent: string;
    badgeBg: string;
    pattern: string;
    textColor: string;
  }
> = {
  navy: {
    bg: 'from-[#0b1736] via-[#112353] to-[#0d1b40]',
    accent: '#38bdf8',
    badgeBg: 'bg-sky-500/20 text-sky-200 border-sky-400/30',
    pattern: 'radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.15) 0%, transparent 50%)',
    textColor: 'text-white'
  },
  teal: {
    bg: 'from-[#042f2e] via-[#0d4a46] to-[#063330]',
    accent: '#2dd4bf',
    badgeBg: 'bg-teal-500/20 text-teal-200 border-teal-400/30',
    pattern: 'radial-gradient(circle at 20% 80%, rgba(45, 212, 191, 0.18) 0%, transparent 60%)',
    textColor: 'text-white'
  },
  emerald: {
    bg: 'from-[#064e3b] via-[#065f46] to-[#043e30]',
    accent: '#34d399',
    badgeBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
    pattern: 'radial-gradient(circle at 75% 25%, rgba(52, 211, 153, 0.18) 0%, transparent 55%)',
    textColor: 'text-white'
  },
  indigo: {
    bg: 'from-[#1e1b4b] via-[#2e266d] to-[#17143e]',
    accent: '#818cf8',
    badgeBg: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30',
    pattern: 'radial-gradient(circle at 70% 30%, rgba(129, 140, 248, 0.2) 0%, transparent 50%)',
    textColor: 'text-white'
  },
  slate: {
    bg: 'from-[#0f172a] via-[#1e293b] to-[#0a0f1d]',
    accent: '#94a3b8',
    badgeBg: 'bg-slate-400/20 text-slate-200 border-slate-400/30',
    pattern: 'radial-gradient(circle at 30% 70%, rgba(148, 163, 184, 0.15) 0%, transparent 50%)',
    textColor: 'text-white'
  },
  sky: {
    bg: 'from-[#0c4a6e] via-[#075985] to-[#083344]',
    accent: '#38bdf8',
    badgeBg: 'bg-sky-500/20 text-sky-200 border-sky-400/30',
    pattern: 'radial-gradient(circle at 50% 20%, rgba(56, 189, 248, 0.2) 0%, transparent 55%)',
    textColor: 'text-white'
  },
  amber: {
    bg: 'from-[#451a03] via-[#78350f] to-[#361301]',
    accent: '#fbbf24',
    badgeBg: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
    pattern: 'radial-gradient(circle at 75% 75%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)',
    textColor: 'text-white'
  }
};

function getCategoryIcon(cat: string) {
  const c = cat.toLowerCase();
  if (c.includes('computer') || c.includes('code') || c.includes('software')) return <Code className="w-5 h-5 text-sky-300" />;
  if (c.includes('physics') || c.includes('quantum')) return <Atom className="w-5 h-5 text-teal-300" />;
  if (c.includes('medical') || c.includes('bio') || c.includes('health')) return <HeartPulse className="w-5 h-5 text-emerald-300" />;
  if (c.includes('mechanical') || c.includes('eng')) return <Cog className="w-5 h-5 text-slate-300" />;
  if (c.includes('math')) return <Binary className="w-5 h-5 text-amber-300" />;
  if (c.includes('econ') || c.includes('commerce') || c.includes('business')) return <BarChart3 className="w-5 h-5 text-cyan-300" />;
  if (c.includes('law')) return <Scale className="w-5 h-5 text-indigo-300" />;
  return <BookOpen className="w-5 h-5 text-teal-300" />;
}

export const BookCover: React.FC<BookCoverProps> = ({
  title,
  author,
  category,
  edition,
  coverImage,
  palette = 'navy',
  className = '',
  aspect = 'card'
}) => {
  const [imgError, setImgError] = useState(false);

  const chosenPalette = PALETTE_CONFIG[palette] || PALETTE_CONFIG.navy;
  const isDetail = aspect === 'detail';

  if (coverImage && !imgError && coverImage.startsWith('http')) {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-slate-900 shadow-md ${className}`}>
        <img
          src={coverImage}
          alt={title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center"
        />
      </div>
    );
  }

  // Academic stylized jacket representation
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${chosenPalette.bg} shadow-md border border-slate-700/50 flex flex-col justify-between p-4 md:p-5 select-none transition-transform duration-200 ${className}`}
      style={{
        backgroundImage: chosenPalette.pattern
      }}
    >
      {/* Textbook spine visual highlight strip */}
      <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />
      <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-white/15 pointer-events-none" />

      {/* Top Header metadata */}
      <div className="pl-2 flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded bg-black/30 backdrop-blur-xs">
            {getCategoryIcon(category)}
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
            {category}
          </span>
        </div>

        {edition && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border backdrop-blur-xs ${chosenPalette.badgeBg}`}>
            {edition}
          </span>
        )}
      </div>

      {/* Title & Author Center */}
      <div className="pl-2 my-auto py-3 z-10 flex flex-col justify-center">
        <div className="h-0.5 w-8 bg-teal-400 mb-2 opacity-80" />
        <h3
          className={`font-bold leading-tight line-clamp-3 ${chosenPalette.textColor} ${
            isDetail ? 'text-2xl md:text-3xl' : 'text-base md:text-lg'
          }`}
        >
          {title}
        </h3>
        <p className="mt-2 text-xs md:text-sm text-slate-300 line-clamp-2 font-medium">
          {author}
        </p>
      </div>

      {/* Bottom Academic Seal / Strip */}
      <div className="pl-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 z-10">
        <span className="flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-teal-400" />
          <span>Academic Edition</span>
        </span>
        <span className="font-mono text-[10px] text-slate-400/80">BookLoop</span>
      </div>

      {/* Corner geometric subtle watermark */}
      <div
        className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 pointer-events-none"
        style={{ background: chosenPalette.accent }}
      />
    </div>
  );
};
