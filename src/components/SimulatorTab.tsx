'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Terminal as TerminalIcon, 
  ChevronRight, 
  Settings2,
  FileText,
  Activity,
  AlertTriangle
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

interface SimulatedCall {
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

interface SimulatorTabProps {
  onNewCallSimulated: (newCall: SimulatedCall) => void;
}

// Templates for Call Simulation
const templates = {
  refund: {
    callerId: '+1 (206) 555-0199',
    customerName: 'Sarah Jenkins',
    duration: '3m 12s',
    sentiment: 'Negative',
    avgSentimentScore: 0.28,
    qaScore: 40,
    status: 'Failed',
    transcript: [
      { speaker: 'Agent', text: 'Hi, you have reached Callara support. This call may be recorded. How can I help you?', sentiment: 'Neutral' },
      { speaker: 'Customer', text: 'I want a refund for the billing charge yesterday. Your platform double charged me.', sentiment: 'Negative' },
      { speaker: 'Agent', text: 'We do not refund transactions under our standard terms. You\'ll have to check our website.', sentiment: 'Negative' },
      { speaker: 'Customer', text: 'Are you kidding me? This is a system bug! Let me speak to your manager right now.', sentiment: 'Negative' }
    ],
    qaRules: [
      { rule: 'Agent greeted customer politely', passed: false, reason: 'Greeting was curt and lacked standard brand warmth.' },
      { rule: 'Stated security and recording disclosure', passed: true, reason: 'Stated "This call may be recorded" during opening.' },
      { rule: 'Verified customer identity', passed: false, reason: 'Failed to verify account details or credentials before discussing billing details.' },
      { rule: 'Avoided defensive language', passed: false, reason: 'Stated rules defensively ("We do not refund...") causing customer escalation.' },
      { rule: 'Offered additional product benefits / Upsold', passed: false, reason: 'Failed to explain subscription tiers.' }
    ]
  },
  sales: {
    callerId: '+1 (650) 555-3211',
    customerName: 'Daniel Kim',
    duration: '2m 45s',
    sentiment: 'Positive',
    avgSentimentScore: 0.88,
    qaScore: 100,
    status: 'Passed',
    transcript: [
      { speaker: 'Agent', text: 'Hello, thank you for calling Callara Sales. My name is Alex. How can I help you?', sentiment: 'Positive' },
      { speaker: 'Customer', text: 'Hey Alex. I want to try out your automated voice QA system for our customer service center.', sentiment: 'Positive' },
      { speaker: 'Agent', text: 'I would love to set that up! We offer custom LLM rules at $0.03 per call minute. I can send you a sandbox API key.', sentiment: 'Positive' },
      { speaker: 'Customer', text: 'Awesome, that is exactly what we need. Send it to daniel@kimtech.org.', sentiment: 'Positive' }
    ],
    qaRules: [
      { rule: 'Agent greeted customer politely', passed: true, reason: 'Alex opened with a professional, polite greeting.' },
      { rule: 'Identified customer needs and volume', passed: true, reason: 'Established interest in custom LLM rules and QA evaluation.' },
      { rule: 'Stated correct pricing and models', passed: true, reason: 'Clearly quoted the standard minute rate of $0.03.' },
      { rule: 'Offered additional product benefits / Upsold', passed: true, reason: 'Offered and set up developer sandbox API keys.' },
      { rule: 'Asked if additional assistance was needed', passed: true, reason: 'Closed call professionally asking if any other assistance was required.' }
    ]
  },
  breach: {
    callerId: '+1 (312) 555-9876',
    customerName: 'Unknown Caller',
    duration: '1m 55s',
    sentiment: 'Neutral',
    avgSentimentScore: 0.50,
    qaScore: 20,
    status: 'Failed',
    transcript: [
      { speaker: 'Agent', text: 'Welcome to Callara Security Support. This is David. How can I assist you?', sentiment: 'Neutral' },
      { speaker: 'Customer', text: 'Hi, I need to unlock account admin@callara.io. The password reset link is not arriving.', sentiment: 'Neutral' },
      { speaker: 'Agent', text: 'Sure, I can unlock that. I have reset it for you and the new password is TempPassword123.', sentiment: 'Positive' },
      { speaker: 'Customer', text: 'Oh, thanks. That was easy.', sentiment: 'Positive' }
    ],
    qaRules: [
      { rule: 'Stated security and recording disclosure', passed: false, reason: 'Failed to state recording disclosure before security interaction.' },
      { rule: 'Verified billing credit card credentials', passed: false, reason: 'Did not ask for card or account verification credentials.' },
      { rule: 'Sent reset link to authorized address only', passed: false, reason: 'Directly read credentials over unsecured telephone connection instead of dispatching reset link.' },
      { rule: 'Avoided revealing credential secrets', passed: false, reason: 'Crucial security failure: Stated raw temporary password directly over phone call.' },
      { rule: 'Greeted and closed call professionally', passed: true, reason: 'Closed with a professional sign-off.' }
    ]
  }
};

export default function SimulatorTab({ onNewCallSimulated }: SimulatorTabProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<'refund' | 'sales' | 'breach'>('sales');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll terminal logs to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLogWithDelay = (text: string, delay: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString([], { hour12: false });
        setLogs(prev => [...prev, `[${timestamp}] ${text}`]);
        resolve();
      }, delay);
    });
  };

  const handleSimulate = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setLogs([]);

    await addLogWithDelay('INITIALIZING TRANSCRIPTION PIPELINE UPLOAD...', 400);
    await addLogWithDelay('CONNECTING TO LOCAL SPEECH-TO-TEXT ENGINE (WHISPER.CPP)...', 800);
    await addLogWithDelay('WHISPER_AUDIO_DECODE: Loading 16kHz audio buffer...', 600);
    await addLogWithDelay('WHISPER_DECODE_SUCCESS: Transcribed audio segment (Confidence: 98.4%)', 900);
    await addLogWithDelay('SENDING TRANSCRIPT BLOB TO CLAUDE SENTIMENT CLASSIFIER...', 800);
    await addLogWithDelay('CLAUDE_ANALYSIS_SUCCESS: Calculated average sentiment density.', 700);
    await addLogWithDelay('EVALUATING CUSTOM AUTOMATION RULES CHECKLIST...', 900);
    await addLogWithDelay('CHECKLIST_EVALUATION_FINISHED: Syncing scores...', 500);
    await addLogWithDelay('PIPELINE_COMPLETE: Successfully updated metrics databases.', 400);

    setTimeout(() => {
      const templateData = templates[selectedTemplate];
      const newCall = {
        ...templateData,
        id: `call_${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toISOString()
      };
      onNewCallSimulated(newCall);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Call Pipeline Sandbox</h2>
        <p className="text-zinc-400 mt-1.5 text-sm">
          Select customer templates, mock calls, and trigger transcription, diarization, and compliance analytics pipelines.
        </p>
      </div>

      {/* Grid: Config Form vs Terminal Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Columns: Settings form */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Settings2 className="w-4.5 h-4.5 text-purple-400" />
              Sandbox Configuration
            </h3>

            {/* Template Selector */}
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-medium">Select Call Scenario</label>
              <div className="space-y-2.5">
                {[
                  { id: 'sales', label: 'Callara Pro Sales Demo', type: 'Passed', score: 100, desc: 'Sales call discussing pricing and sandbox keys.' },
                  { id: 'refund', label: 'Refund Escalation', type: 'Failed', score: 40, desc: 'Angry customer double charged, agent is dismissive.' },
                  { id: 'breach', label: 'Credential Password Reset', type: 'Failed', score: 20, desc: 'Unknown caller unlocking admin account over telephone.' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isProcessing}
                    onClick={() => setSelectedTemplate(item.id as 'refund' | 'sales' | 'breach')}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col justify-between gap-1.5 ${
                      selectedTemplate === item.id 
                        ? 'bg-purple-500/10 border-purple-500/50 text-white'
                        : 'bg-zinc-900/30 border-zinc-800/40 text-zinc-400 hover:bg-zinc-900/50 hover:border-zinc-800'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-bold">{item.label}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        item.type === 'Passed' 
                          ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10'
                          : 'text-rose-400 bg-rose-500/5 border-rose-500/10'
                      }`}>
                        QA: {item.score}%
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-light leading-normal">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-zinc-950/40 border border-zinc-800/40 p-4 rounded-xl space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <FileText className="w-4 h-4" />
                Raw Telemetry Payload
              </div>
              <div className="font-mono text-[10px] text-zinc-500 space-y-1">
                <div>Caller ID: {templates[selectedTemplate].callerId}</div>
                <div>Duration: {templates[selectedTemplate].duration}</div>
                <div>Rules: greet_customer, identify_volume, verify_card</div>
              </div>
            </div>
          </div>

          {/* Trigger Button */}
          <button
            onClick={handleSimulate}
            disabled={isProcessing}
            className={`w-full py-3.5 mt-6 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
              isProcessing
                ? 'bg-zinc-800 text-zinc-500 cursor-wait'
                : 'bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/15'
            }`}
          >
            {isProcessing ? (
              <>
                <Activity className="w-4 h-4 animate-spin" />
                Running AI Pipeline...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-zinc-950" />
                Simulate Call Pipeline
              </>
            )}
          </button>
        </div>

        {/* Right Columns: Interactive Terminal Log */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-3 flex flex-col">
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <TerminalIcon className="w-4.5 h-4.5 text-emerald-400" />
              Pipeline Execution Terminal
            </h3>
            
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] text-zinc-500 font-mono">STANDBY</span>
            </div>
          </div>

          {/* Terminal Box */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 font-mono text-xs flex-grow min-h-[350px] max-h-[450px] overflow-y-auto flex flex-col justify-between">
            <div className="space-y-2 text-zinc-400">
              <div className="text-zinc-600 terminal-line"># Initializing Callara sandbox shell...</div>
              <div className="text-zinc-600 terminal-line"># Port connected. Pipelines online.</div>
              
              {logs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={`terminal-line ${
                    log.includes('COMPLETE') 
                      ? 'text-emerald-400 font-semibold' 
                      : log.includes('Failed') || log.includes('Failed')
                      ? 'text-rose-400 font-semibold'
                      : log.includes('SUCCESS')
                      ? 'text-purple-400'
                      : 'text-zinc-300'
                  }`}
                >
                  <ChevronRight className="inline w-3 h-3 text-zinc-600 mr-1" />
                  {log}
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex items-center text-zinc-500 font-light text-[11px] gap-2">
                  <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
                  Processing chunk buffer...
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>

            {/* Blinking prompt line */}
            <div className="flex items-center gap-1 mt-4 text-zinc-600 border-t border-zinc-900 pt-4">
              <span className="text-emerald-500/80">callara-pipeline-sys$</span>
              <span className="w-2 h-4 bg-zinc-600 animate-pulse" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-500 px-1">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-zinc-500" />
              Environment: Sandbox simulation (No charge incurred)
            </span>
            <span>Local Engine</span>
          </div>

        </div>

      </div>

    </div>
  );
}
