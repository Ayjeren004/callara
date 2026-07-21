'use client';

import React from 'react';
import { 
  Phone, 
  Percent, 
  Smile, 
  DollarSign, 
  ExternalLink,
  CheckCircle,
  XCircle,
  HelpCircle
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

interface OverviewTabProps {
  calls: Call[];
  onViewDetails: (call: Call) => void;
}

export default function OverviewTab({ calls, onViewDetails }: OverviewTabProps) {
  
  // Calculate dynamic metrics
  const totalCalls = calls.length;
  
  const avgQaScore = totalCalls > 0 
    ? Math.round(calls.reduce((sum, c) => sum + c.qaScore, 0) / totalCalls) 
    : 0;

  const complianceRate = totalCalls > 0 
    ? Math.round((calls.filter(c => c.status === 'Passed').length / totalCalls) * 100) 
    : 0;

  // Calculate simulated cost (assume 3 cents per min, average 3 mins/call)
  const totalCost = (totalCalls * 3.4 * 0.03).toFixed(2);

  // Helper to format ISO dates to a clean local string
  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Overview Dashboard</h2>
        <p className="text-zinc-400 mt-1.5 text-sm">
          Real-time metrics, sentiment analytics, and QA compliance tracking for voice operations.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Calls Card */}
        <div className="glass-card p-6 rounded-2xl glow-emerald flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Calls</span>
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Phone className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-white tracking-tight">{totalCalls}</h3>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10 inline-block mt-2">
              Live updates active
            </span>
          </div>
        </div>

        {/* Avg QA Score Card */}
        <div className="glass-card p-6 rounded-2xl glow-purple flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Avg QA Score</span>
            <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <Percent className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-white tracking-tight">{avgQaScore}%</h3>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-block mt-2 ${
              avgQaScore >= 80 
                ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10'
                : 'text-amber-400 bg-amber-500/5 border-amber-500/10'
            }`}>
              {avgQaScore >= 80 ? 'Excellent rating' : 'Action required'}
            </span>
          </div>
        </div>

        {/* Compliance Rate Card */}
        <div className="glass-card p-6 rounded-2xl glow-emerald flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Compliance Rate</span>
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Smile className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-white tracking-tight">{complianceRate}%</h3>
            <span className="text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 inline-block mt-2">
              Target SLA: 85%
            </span>
          </div>
        </div>

        {/* Total Cost/Spend Card */}
        <div className="glass-card p-6 rounded-2xl glow-purple flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Estimated Spend</span>
            <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <DollarSign className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-white tracking-tight">${totalCost}</h3>
            <span className="text-[10px] text-purple-400 font-semibold bg-purple-500/5 px-2 py-0.5 rounded-full border border-purple-500/10 inline-block mt-2">
              $0.03 / call-minute
            </span>
          </div>
        </div>

      </div>

      {/* Analytics Chart & Info Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SVG Glowing Line Graph */}
        <div className="glass-panel p-6 rounded-2xl col-span-2">
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-6">
            Sentiment Trends (Last 7 Days)
          </h3>
          
          <div className="h-64 w-full relative">
            {/* SVG Visual Graph */}
            <svg viewBox="0 0 500 200" className="w-full h-full">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

              {/* Area Gradient Under Curve */}
              <path 
                d="M 0 160 L 80 140 L 160 150 L 240 90 L 320 120 L 400 60 L 500 45 L 500 200 L 0 200 Z" 
                fill="url(#areaGrad)" 
              />

              {/* Glowing Main Curve Line */}
              <path 
                d="M 0 160 L 80 140 L 160 150 L 240 90 L 320 120 L 400 60 L 500 45" 
                fill="none" 
                stroke="url(#lineGrad)" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
              />

              {/* Active Nodes */}
              <circle cx="240" cy="90" r="5" fill="#10b981" className="animate-pulse" />
              <circle cx="400" cy="60" r="5" fill="#8b5cf6" className="animate-pulse" />
              <circle cx="500" cy="45" r="5" fill="#10b981" />
            </svg>

            {/* Floating tooltips */}
            <div className="absolute top-10 left-[48%] bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 px-2 py-1 rounded text-[10px] text-zinc-300 font-mono">
              Avg: +0.65
            </div>
            <div className="absolute top-5 right-[5%] bg-zinc-950/80 backdrop-blur-md border border-emerald-500/30 px-2 py-1 rounded text-[10px] text-emerald-400 font-mono">
              Peak: +0.92
            </div>
          </div>

          {/* Graph labels */}
          <div className="flex justify-between items-center text-[11px] text-zinc-500 font-mono mt-4 px-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun (Today)</span>
          </div>
        </div>

        {/* SLA Information Box */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-4">
              AI Pipeline Health
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We validate customer interactions using deep semantic parsing and classification. Ensure your local LLM rules align with core legal disclosures.
            </p>
          </div>

          <div className="space-y-3.5 my-6">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Whisper Transcript Accuracy</span>
              <span className="text-emerald-400 font-semibold font-mono">98.4%</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[98.4%] rounded-full" />
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Claude Sentiment Accuracy</span>
              <span className="text-purple-400 font-semibold font-mono">96.8%</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-[96.8%] rounded-full" />
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 bg-white/[0.01] p-3 rounded-xl border border-white/[0.03] flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
            <span>
              If call scores drop below 70%, alerts are automatically published to your webhook endpoint.
            </span>
          </div>
        </div>

      </div>

      {/* Call Stream Log List */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        
        {/* Table Header */}
        <div className="p-6 border-b border-zinc-800/60 flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
            Live Call Analytics Stream
          </h3>
          <span className="text-xs text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {totalCalls} Active sessions
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/40 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider bg-white/[0.01]">
                <th className="px-6 py-4">Caller ID</th>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">AI Sentiment</th>
                <th className="px-6 py-4">Compliance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {calls.map((call) => (
                <tr 
                  key={call.id} 
                  className="hover:bg-white/[0.02] transition-colors duration-150 group"
                >
                  <td className="px-6 py-4 font-mono font-medium text-white">{call.callerId}</td>
                  <td className="px-6 py-4 text-zinc-300">{call.customerName}</td>
                  <td className="px-6 py-4 font-mono text-xs text-zinc-400">
                    <span className="block">{formatDate(call.date)}</span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">{formatTime(call.date)}</span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 font-mono text-xs">{call.duration}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      call.sentiment === 'Positive' 
                        ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10'
                        : call.sentiment === 'Negative'
                        ? 'text-rose-400 bg-rose-500/5 border-rose-500/10'
                        : 'text-zinc-400 bg-white/5 border-white/10'
                    }`}>
                      {call.sentiment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-white">{call.qaScore}%</span>
                      <div className="w-12 bg-white/5 h-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            call.qaScore >= 80 ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${call.qaScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${
                      call.status === 'Passed' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {call.status === 'Passed' 
                        ? <CheckCircle className="w-4 h-4" /> 
                        : <XCircle className="w-4 h-4" />
                      }
                      {call.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onViewDetails(call)}
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 transition-all duration-150"
                    >
                      Inspect
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
