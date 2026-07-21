'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Headphones,
  Calendar,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Info
} from 'lucide-react';

interface TranscriptLine {
  speaker: string;
  text: string;
  sentiment: string;
}

interface QARule {
  rule: string;
  passed: boolean;
  reason: string;
}

interface Call {
  id: string;
  callerId: string;
  customerName: string;
  date: string;
  duration: string;
  sentiment: string;
  avgSentimentScore: number;
  qaScore: number;
  status: string;
  transcript: TranscriptLine[];
  qaRules: QARule[];
}

interface CallDetailModalProps {
  call: Call;
  onClose: () => void;
}

export default function CallDetailModal({ call, onClose }: CallDetailModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Parse duration string (e.g. "4m 32s" -> seconds)
  const parseDuration = (dur: string) => {
    const minsMatch = dur.match(/(\d+)m/);
    const secsMatch = dur.match(/(\d+)s/);
    const mins = minsMatch ? parseInt(minsMatch[1]) : 0;
    const secs = secsMatch ? parseInt(secsMatch[1]) : 0;
    return mins * 60 + secs;
  };

  const totalSeconds = parseDuration(call.duration);

  // Format time (seconds -> mm:ss)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Handle Play/Pause simulation timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalSeconds) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, totalSeconds]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      
      {/* Dark overlay backdrop */}
      <div 
        className="absolute inset-0 bg-[#020204]/90 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Main modal container */}
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#0c0c10] border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col glow-purple z-10 animate-fadeIn">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-800/60 flex justify-between items-start bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
              <Headphones className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{call.customerName}</h3>
                <span className="text-[10px] text-zinc-500 font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                  {call.id}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mt-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  {call.duration}
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" strokeWidth={2.5} />
                  {call.callerId}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  {new Date(call.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* QA Score Display */}
            <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-2.5 pr-4">
              <div className="relative w-11 h-11 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle 
                    cx="22" 
                    cy="22" 
                    r="18" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.05)" 
                    strokeWidth="3" 
                  />
                  <circle 
                    cx="22" 
                    cy="22" 
                    r="18" 
                    fill="none" 
                    stroke={call.qaScore >= 80 ? '#10b981' : '#f43f5e'} 
                    strokeWidth="3.5"
                    strokeDasharray={113}
                    strokeDashoffset={113 - (113 * call.qaScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-xs font-bold text-white font-mono">{call.qaScore}%</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 block">QA Score</span>
                <span className={`text-xs font-semibold ${call.status === 'Passed' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {call.status}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 border border-zinc-800/40 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audio Player Strip */}
        <div className="px-8 py-5 bg-zinc-950/40 border-b border-zinc-800/40 flex items-center gap-6">
          <button
            onClick={togglePlay}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isPlaying 
                ? 'bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/20' 
                : 'bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
            } text-zinc-950`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-zinc-950" /> : <Play className="w-4 h-4 fill-zinc-950 ml-0.5" />}
          </button>

          <div className="text-xs font-mono text-zinc-400 min-w-[80px]">
            {formatTime(currentTime)} / {formatTime(totalSeconds)}
          </div>

          {/* Animated Audio Waveform Simulator */}
          <div className={`flex items-center gap-1.5 flex-grow h-12 justify-center px-4 ${isPlaying ? 'wave-active' : ''}`}>
            {[...Array(40)].map((_, i) => (
              <span key={i} className="wave-bar" />
            ))}
          </div>

          <div className="flex items-center gap-2 text-zinc-400 hover:text-white cursor-pointer">
            <Volume2 className="w-4 h-4" />
            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[70%]" />
            </div>
          </div>
        </div>

        {/* Double Column content: Transcript vs. QA Audit */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* Left Column: Transcript (Scrollable) */}
          <div className="w-full md:w-[60%] border-r border-zinc-800/40 flex flex-col h-full bg-[#09090c]">
            <div className="p-4 border-b border-zinc-800/40 bg-white/[0.005] flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Full Conversation Transcript
              </span>
              <span className="text-[10px] text-zinc-500">
                Processed via Whisper local model
              </span>
            </div>
            
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {call.transcript.map((line, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-4 p-4 rounded-2xl border transition-all ${
                    line.speaker === 'Agent' 
                      ? 'bg-zinc-900/40 border-zinc-800/30' 
                      : 'bg-zinc-800/10 border-zinc-800/20'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    line.speaker === 'Agent' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}>
                    {line.speaker === 'Agent' ? 'AG' : 'CU'}
                  </div>

                  <div className="flex-grow space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">{line.speaker}</span>
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        line.sentiment === 'Positive' 
                          ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10'
                          : line.sentiment === 'Negative'
                          ? 'text-rose-400 bg-rose-500/5 border-rose-500/10'
                          : 'text-zinc-400 bg-white/5 border-white/10'
                      }`}>
                        {line.sentiment === 'Positive' && <ThumbsUp className="w-2.5 h-2.5" />}
                        {line.sentiment === 'Negative' && <ThumbsDown className="w-2.5 h-2.5" />}
                        {line.sentiment}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed font-light">
                      {line.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: QA Criteria Checklist */}
          <div className="w-full md:w-[40%] flex flex-col h-full bg-zinc-950/20">
            <div className="p-4 border-b border-zinc-800/40 bg-white/[0.005] flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Automated QA Validation
              </span>
              <span className="text-[10px] text-zinc-500">
                Rule evaluation by LLM agent
              </span>
            </div>

            <div className="flex-grow p-6 overflow-y-auto space-y-5">
              
              {call.qaRules.map((ruleItem, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-2xl border transition-all ${
                    ruleItem.passed 
                      ? 'bg-emerald-500/[0.01] border-emerald-500/10 hover:bg-emerald-500/[0.02]' 
                      : 'bg-rose-500/[0.01] border-rose-500/10 hover:bg-rose-500/[0.02]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {ruleItem.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 flex-grow">
                      <h4 className="text-xs font-bold text-white tracking-wide">
                        {ruleItem.rule}
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">
                        {ruleItem.reason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl flex items-start gap-2.5">
                <Info className="w-4.5 h-4.5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
                    Telemetry Details
                  </span>
                  <p className="text-[11px] text-zinc-500 leading-normal font-light">
                    SaaS telemetry collected. Webhook event published successfully under event identifier <code className="text-zinc-400 font-mono">evt_3c92f8a12</code>.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
