'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Terminal, 
  Key, 
  PhoneCall, 
  Activity
} from 'lucide-react';
import OverviewTab from './OverviewTab';
import SimulatorTab from './SimulatorTab';
import DeveloperTab from './DeveloperTab';
import CallDetailModal from './CallDetailModal';

// Seed Initial Mock Call Database
const initialCalls = [
  {
    id: 'call_001',
    callerId: '+1 (555) 234-5678',
    customerName: 'Marcus Vance',
    date: '2026-07-21T09:15:30Z',
    duration: '4m 32s',
    sentiment: 'Negative',
    avgSentimentScore: 0.35,
    qaScore: 68,
    status: 'Failed',
    transcript: [
      { speaker: 'Agent', text: 'Hello, thanks for calling Callara customer support. My name is Sarah. How can I help you today?', sentiment: 'Positive' },
      { speaker: 'Customer', text: 'Yeah, hi. I am extremely frustrated. I was billed twice for my subscription this month and I want a refund immediately.', sentiment: 'Negative' },
      { speaker: 'Agent', text: 'Oh, I am very sorry to hear that. I can definitely look into your billing issue. Could you please verify your email address?', sentiment: 'Neutral' },
      { speaker: 'Customer', text: 'It is marcus.vance@gmail.com. But seriously, this is the second time this happened. I do not have time for system glitches.', sentiment: 'Negative' },
      { speaker: 'Agent', text: 'Thank you. I see the duplicate charge on your account. I am going to process a credit for one of the charges right away.', sentiment: 'Positive' },
      { speaker: 'Customer', text: 'Well, okay, but will this happen again? I want a guarantee that your system is fixed.', sentiment: 'Negative' },
      { speaker: 'Agent', text: 'I will submit a ticket to our engineering team to inspect your account. It should be fully resolved now.', sentiment: 'Neutral' },
      { speaker: 'Customer', text: 'Fine. Just make sure that refund hits my card. Thanks.', sentiment: 'Neutral' }
    ],
    qaRules: [
      { rule: 'Agent greeted customer politely', passed: true, reason: 'Sarah used a warm, standard greeting.' },
      { rule: 'Verified customer identity', passed: true, reason: 'Verified email marcus.vance@gmail.com.' },
      { rule: 'Avoided defensive language', passed: true, reason: 'Apologized for the billing issue and took responsibility.' },
      { rule: 'Offered additional product benefits / Upsold', passed: false, reason: 'Failed to offer or mention subscription tiers or upgrades during support interaction.' },
      { rule: 'Provided clear resolution timeline', passed: false, reason: 'Refund processed, but did not specify that it takes 3-5 business days to clear.' }
    ]
  },
  {
    id: 'call_002',
    callerId: '+1 (415) 890-1234',
    customerName: 'Elena Rostova',
    date: '2026-07-21T08:42:10Z',
    duration: '2m 15s',
    sentiment: 'Positive',
    avgSentimentScore: 0.92,
    qaScore: 100,
    status: 'Passed',
    transcript: [
      { speaker: 'Agent', text: 'Thank you for calling Callara Sales. My name is Alex. How are you doing today?', sentiment: 'Positive' },
      { speaker: 'Customer', text: 'Hi Alex. I am doing well, thank you. I am looking to integrate a voice intelligence system for our customer service center and wanted to understand Callara\'s pricing tiers.', sentiment: 'Positive' },
      { speaker: 'Agent', text: 'That is wonderful to hear! We offer our Startup tier at $0.03 per call minute and our Enterprise SaaS plan, which includes full custom QA compliance rules and dedicated LLM parameters. What is your typical monthly call volume?', sentiment: 'Positive' },
      { speaker: 'Customer', text: 'We handle about 50,000 calls a month, mostly under 5 minutes.', sentiment: 'Neutral' },
      { speaker: 'Agent', text: 'Perfect. For that volume, our Pro tier would save you about 20% compared to standard minute rates, plus you get automated sentiment dashboards. I can set up a developer sandbox key for you right now.', sentiment: 'Positive' },
      { speaker: 'Customer', text: 'That sounds perfect. Let\'s do that. Send the invite to elena@techstack.io.', sentiment: 'Positive' },
      { speaker: 'Agent', text: 'Absolutely. I\'ve sent the invite link. Is there anything else I can assist you with before we conclude?', sentiment: 'Positive' },
      { speaker: 'Customer', text: 'Nope, that is all. Thank you, Alex!', sentiment: 'Positive' }
    ],
    qaRules: [
      { rule: 'Agent greeted customer politely', passed: true, reason: 'Alex used an excellent, polite greeting.' },
      { rule: 'Identified customer needs and volume', passed: true, reason: 'Inquired about monthly volume (50k calls).' },
      { rule: 'Stated correct pricing and models', passed: true, reason: 'Correctly listed Startup pricing at $0.03/min and highlighted Pro benefits.' },
      { rule: 'Offered additional product benefits / Upsold', passed: true, reason: 'Successfully offered developer sandbox and customized Pro package.' },
      { rule: 'Asked if additional assistance was needed', passed: true, reason: 'Asked "Is there anything else I can assist you with?" prior to disconnect.' }
    ]
  },
  {
    id: 'call_003',
    callerId: '+1 (212) 765-4321',
    customerName: 'Robert Chen',
    date: '2026-07-20T17:05:00Z',
    duration: '3m 50s',
    sentiment: 'Neutral',
    avgSentimentScore: 0.65,
    qaScore: 80,
    status: 'Passed',
    transcript: [
      { speaker: 'Agent', text: 'Welcome to Callara Security Support. This is David. Please be advised this call is recorded for quality assurance. How can I help you?', sentiment: 'Neutral' },
      { speaker: 'Customer', text: 'Hello. I need to reset my Master Admin API password. I locked myself out of the developer console.', sentiment: 'Neutral' },
      { speaker: 'Agent', text: 'I can certainly assist with an admin credential reset. To proceed, please provide your account name and verify the last four digits of the billing credit card.', sentiment: 'Neutral' },
      { speaker: 'Customer', text: 'Sure, the account is ChenConsulting, and the card digits are 4321.', sentiment: 'Neutral' },
      { speaker: 'Agent', text: 'Verification successful. I have dispatched a secure password-reset link to the registered admin email address. It is valid for 15 minutes.', sentiment: 'Positive' },
      { speaker: 'Customer', text: 'I got it, it works. Thanks for the quick help.', sentiment: 'Positive' },
      { speaker: 'Agent', text: 'You are very welcome. Have a wonderful day.', sentiment: 'Positive' }
    ],
    qaRules: [
      { rule: 'Stated security and recording disclosure', passed: true, reason: 'Stated that the call is recorded for quality assurance.' },
      { rule: 'Verified billing credit card credentials', passed: true, reason: 'Verified last 4 digits (4321).' },
      { rule: 'Sent reset link to authorized address only', passed: true, reason: 'Confirmed link sent to registered admin email.' },
      { rule: 'Upsold premium security add-ons', passed: false, reason: 'Did not offer Multi-Factor Authentication (MFA) upgrade options.' },
      { rule: 'Greeted and closed call professionally', passed: true, reason: 'Closed with "Have a wonderful day".' }
    ]
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'developer'>('overview');
  const [calls, setCalls] = useState(initialCalls);
  const [selectedCall, setSelectedCall] = useState<typeof initialCalls[0] | null>(null);
  const [apiKeys, setApiKeys] = useState([
    { id: 'key_1', name: 'Production Key', prefix: 'cl_live_...', value: 'cl_live_8f3c7e9a2b5d4e6f1a8c9b0d', created: '2026-07-15', revealed: false },
    { id: 'key_2', name: 'Development Sandbox', prefix: 'cl_test_...', value: 'cl_test_3a7b9c1d5e6f8a0b2c4d6e8f', created: '2026-07-20', revealed: false }
  ]);

  return (
    <div className="min-h-screen bg-[#07070a] text-slate-100 flex flex-col md:flex-row relative overflow-hidden">
      
      {/* Background Neon Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 glass-panel border-r border-zinc-800/60 p-6 flex flex-col justify-between flex-shrink-0 z-10 md:h-screen sticky top-0">
        <div>
          {/* Logo Header */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-purple-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <PhoneCall className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Callara
              </h1>
              <span className="text-[10px] font-medium tracking-widest text-emerald-400 uppercase">
                Voice intelligence
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-emerald-500/10 to-transparent text-emerald-400 border-l-2 border-emerald-500'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Overview Dashboard
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'simulator'
                  ? 'bg-gradient-to-r from-purple-500/10 to-transparent text-purple-400 border-l-2 border-purple-500'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Call Pipeline Sandbox
            </button>

            <button
              onClick={() => setActiveTab('developer')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'developer'
                  ? 'bg-gradient-to-r from-emerald-500/10 to-transparent text-emerald-400 border-l-2 border-emerald-500'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
              }`}
            >
              <Key className="w-4 h-4" />
              API & Dev Portal
            </button>
          </nav>
        </div>

        {/* Sidebar Footer (System Status Indicators) */}
        <div className="pt-6 border-t border-zinc-800/60 mt-6 md:mt-0">
          <div className="flex items-center justify-between text-xs text-zinc-500 px-2 mb-2">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              System Status
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold uppercase">
              Operational
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-500 px-2">
            <span>API Version</span>
            <code className="text-zinc-400 font-mono">v1.2.6-stable</code>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-grow p-4 md:p-10 z-10 overflow-y-auto max-h-screen">
        
        {/* Render Tab Views */}
        {activeTab === 'overview' && (
          <OverviewTab 
            calls={calls} 
            onViewDetails={(call) => setSelectedCall(call)} 
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorTab 
            onNewCallSimulated={(newCall) => {
              setCalls(prev => [newCall, ...prev]);
              // Trigger a small delay and switch to overview
              setTimeout(() => {
                setActiveTab('overview');
                setSelectedCall(newCall);
              }, 1200);
            }} 
          />
        )}

        {activeTab === 'developer' && (
          <DeveloperTab 
            apiKeys={apiKeys} 
            setApiKeys={setApiKeys} 
          />
        )}

      </main>

      {/* Call Detail Overlay Modal */}
      {selectedCall && (
        <CallDetailModal 
          call={selectedCall} 
          onClose={() => setSelectedCall(null)} 
        />
      )}

    </div>
  );
}
