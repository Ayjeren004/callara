'use client';

import React, { useState } from 'react';
import { 
  Key, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  FileCode2, 
  Terminal,
  Lock
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  value: string;
  created: string;
  revealed: boolean;
}

interface DeveloperTabProps {
  apiKeys: ApiKey[];
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>;
}

export default function DeveloperTab({ apiKeys, setApiKeys }: DeveloperTabProps) {
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [snippetLanguage, setSnippetLanguage] = useState<'curl' | 'python' | 'node'>('python');

  // Generate a random mock key
  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const chars = '0123456789abcdef';
    let randomHex = '';
    for (let i = 0; i < 24; i++) {
      randomHex += chars[Math.floor(Math.random() * 16)];
    }

    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      prefix: 'cl_live_...',
      value: `cl_live_${randomHex}`,
      created: new Date().toISOString().split('T')[0],
      revealed: false
    };

    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName('');
    setIsCreatingKey(false);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
  };

  const toggleRevealKey = (id: string) => {
    setApiKeys(prev => prev.map(key => {
      if (key.id === id) {
        return { ...key, revealed: !key.revealed };
      }
      return key;
    }));
  };

  const handleCopyKey = (id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Code snippets content
  const codeSnippets = {
    curl: `curl -X POST https://api.callara.io/v1/calls \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "audio=@/path/to/call.wav" \\
  -F "caller_id=+15552345678" \\
  -F "customer_name=Elena Rostova" \\
  -F "rules[]=greet_customer" \\
  -F "rules[]=disclose_recording"`,
    
    python: `import requests

url = "https://api.callara.io/v1/calls"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}
payload = {
    "caller_id": "+15552345678",
    "customer_name": "Elena Rostova",
    "rules": ["greet_customer", "disclose_recording"]
}
files = {
    "audio": open("call.wav", "rb")
}

response = requests.post(url, headers=headers, data=payload, files=files)
print(response.json())`,
    
    node: `const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('audio', fs.createReadStream('call.wav'));
form.append('caller_id', '+15552345678');
form.append('customer_name', 'Elena Rostova');
form.append('rules', JSON.stringify(['greet_customer', 'disclose_recording']));

axios.post('https://api.callara.io/v1/calls', form, {
  headers: {
    ...form.getHeaders(),
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(res => console.log(res.data))
.catch(err => console.error(err));`
  };

  return (
    <div className="space-y-8">
      
      {/* Tab Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">API & Developer Portal</h2>
        <p className="text-zinc-400 mt-1.5 text-sm">
          Manage your API credentials, set up webhooks, and integrate Callara&apos;s pipeline directly into your SaaS architecture.
        </p>
      </div>

      {/* Grid: Keys Console vs Code integration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: API Keys Console */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                <Key className="w-4.5 h-4.5 text-emerald-400" />
                API Credentials
              </h3>
              
              {!isCreatingKey && (
                <button
                  onClick={() => setIsCreatingKey(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-950 font-bold bg-emerald-400 hover:bg-emerald-300 px-3 py-1.5 rounded-xl transition-all duration-150 shadow-md shadow-emerald-500/10"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Secret Key
                </button>
              )}
            </div>

            {/* Create Key Form (Inline) */}
            {isCreatingKey && (
              <form onSubmit={handleCreateKey} className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-xl mb-6 space-y-3.5 animate-fadeIn">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Key Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Production Main Server"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full text-sm glass-input px-3.5 py-2 rounded-xl"
                  />
                </div>
                <div className="flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsCreatingKey(false)}
                    className="px-3 py-1.5 text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-lg transition-all"
                  >
                    Create Key
                  </button>
                </div>
              </form>
            )}

            {/* Active Keys List */}
            <div className="space-y-4">
              {apiKeys.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl">
                  <Lock className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-zinc-500 text-xs font-light">No active API keys found. Create a secret key to authenticate requests.</p>
                </div>
              ) : (
                apiKeys.map((key) => (
                  <div 
                    key={key.id} 
                    className="bg-zinc-900/30 border border-zinc-800/40 p-4 rounded-2xl flex items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white tracking-wide">{key.name}</h4>
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <code className="text-zinc-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                          {key.revealed ? key.value : `${key.prefix}••••••••`}
                        </code>
                        
                        <button
                          onClick={() => toggleRevealKey(key.id)}
                          className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                        >
                          {key.revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <span className="text-[10px] text-zinc-500 block">Created on {key.created}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyKey(key.id, key.value)}
                        className={`p-2 rounded-xl border transition-all ${
                          copiedKeyId === key.id
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-zinc-800/20 border-zinc-800/40 text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                        }`}
                      >
                        {copiedKeyId === key.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleDeleteKey(key.id)}
                        className="p-2 rounded-xl bg-zinc-800/20 border border-zinc-800/40 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 bg-white/[0.01] p-3 rounded-xl border border-white/[0.03] flex items-start gap-2 mt-6">
            <Lock className="w-4.5 h-4.5 text-zinc-400 flex-shrink-0 mt-0.5" />
            <span>
              Store keys securely. We recommend rotating production keys every 90 days. Never share secret keys in client-side code repositories.
            </span>
          </div>
        </div>

        {/* Right Column: Code Snippet Console */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <FileCode2 className="w-4.5 h-4.5 text-purple-400" />
              API Integration
            </h3>
            
            {/* Language Selector */}
            <div className="bg-zinc-950 border border-zinc-800/60 p-0.5 rounded-xl flex gap-1 text-[10px] font-bold uppercase tracking-wider">
              <button
                onClick={() => setSnippetLanguage('curl')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  snippetLanguage === 'curl' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setSnippetLanguage('python')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  snippetLanguage === 'python' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Python
              </button>
              <button
                onClick={() => setSnippetLanguage('node')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  snippetLanguage === 'node' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                NodeJS
              </button>
            </div>
          </div>

          {/* Code terminal body */}
          <div className="bg-zinc-950 border border-zinc-800/60 rounded-2xl overflow-hidden flex-grow flex flex-col">
            {/* Terminal Header */}
            <div className="px-4 py-2 border-b border-zinc-800/60 bg-white/[0.01] flex items-center justify-between text-xs text-zinc-500">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-[10px]">
                {snippetLanguage === 'curl' ? 'bash' : snippetLanguage === 'python' ? 'python' : 'javascript'}
              </span>
            </div>

            {/* Terminal editor content */}
            <div className="p-4 overflow-x-auto flex-grow">
              <pre className="text-zinc-300 text-xs font-mono leading-relaxed whitespace-pre select-all">
                {codeSnippets[snippetLanguage]}
              </pre>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-500 px-1">
            <span className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" />
              Response format: JSON
            </span>
            <span>REST Protocol</span>
          </div>

        </div>

      </div>

    </div>
  );
}
