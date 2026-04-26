import { useState } from 'react';
import { DirectorDashboard } from './components/DirectorDashboard';
import { ScriptViewer } from './components/ScriptViewer';
import { ScriptParams } from './types';
import { generateDocumentaryScript } from './services/geminiService';

export default function App() {
  const [params, setParams] = useState<ScriptParams>({
    topic: '',
    tone: 'investigative',
    duration: 10,
    narrativeStyle: 'narrator',
    targetAudience: 'General Public'
  });

  const [script, setScript] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeView, setActiveView] = useState<'studio' | 'archive' | 'settings'>('studio');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleGenerate = async () => {
    setActiveView('studio');
    setIsLoading(true);
    setIsStreaming(true);
    setScript('');
    
    try {
      const streamer = generateDocumentaryScript(params);
      for await (const chunk of streamer) {
        setScript(prev => prev + chunk);
      }
    } catch (error) {
      console.error("Failed to generate script:", error);
      setScript("### SYSTEM ERROR\nFailed to sync with story database. Please check your uplink.");
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
  };

  const handleDownload = () => {
    const blob = new Blob([script], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Script_${params.topic.slice(0, 20).replace(/\s+/g, '_')}.md`;
    a.click();
  };

  return (
    <div className="w-full h-screen bg-zinc-950 text-zinc-100 font-sans p-6 overflow-hidden flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-center justify-between px-2 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]">D</div>
          <h1 className="text-xl font-bold tracking-tight">DocuGen <span className="text-indigo-400 text-sm font-medium ml-1">PRO</span></h1>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
          <button 
            onClick={() => setActiveView('studio')}
            className={`${activeView === 'studio' ? 'text-white border-b-2 border-indigo-500 pb-1' : 'hover:text-white transition-colors'}`}
          >
            Studio
          </button>
          <button 
            onClick={() => setActiveView('archive')}
            className={`${activeView === 'archive' ? 'text-white border-b-2 border-indigo-500 pb-1' : 'hover:text-white transition-colors'}`}
          >
            Archive
          </button>
          <button 
            onClick={() => setActiveView('settings')}
            className={`${activeView === 'settings' ? 'text-white border-b-2 border-indigo-500 pb-1' : 'hover:text-white transition-colors'}`}
          >
            Settings
          </button>
        </nav>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="hidden md:block px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold transition-colors"
          >
            {isFullScreen ? 'Exit Focus' : 'Focus Mode'}
          </button>
          <button 
            onClick={() => {
              setScript('');
              setParams({ ...params, topic: '' });
              setActiveView('studio');
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-sm font-bold transition-colors"
          >
            New Project
          </button>
        </div>
      </header>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-grow overflow-hidden relative">
        {activeView === 'studio' ? (
          <>
            {/* Input Panel */}
            <div className={`${isFullScreen ? 'hidden' : 'md:col-span-12 lg:col-span-5'} h-full overflow-hidden transition-all duration-300`}>
              <DirectorDashboard 
                params={params} 
                setParams={setParams} 
                onGenerate={handleGenerate} 
                isLoading={isLoading} 
              />
            </div>

            {/* Preview Panel */}
            <div className={`${isFullScreen ? 'md:col-span-12 lg:col-span-12' : 'md:col-span-12 lg:col-span-7'} h-full overflow-hidden transition-all duration-300`}>
              <ScriptViewer 
                script={script} 
                isStreaming={isStreaming} 
                onCopy={handleCopy} 
                onDownload={handleDownload} 
              />
            </div>
          </>
        ) : activeView === 'archive' ? (
          <div className="col-span-12 h-full bg-zinc-900 border border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
              <span className="text-zinc-500 font-mono">00</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Project Archive</h2>
            <p className="text-zinc-500 max-w-md">Your documentary scripts will appear here. Connect to cloud storage to sync your local drafts.</p>
          </div>
        ) : (
          <div className="col-span-12 h-full bg-zinc-900 border border-zinc-800 rounded-3xl p-12 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-8">Production Settings</h2>
            <div className="max-w-2xl space-y-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">AI Configuration</h3>
                <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="font-bold">Gemini 1.5 Pro (Latest)</div>
                    <div className="text-xs text-zinc-500">Highest narrative fidelity with enhanced sound design cues.</div>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded text-[10px] font-bold">ACTIVE</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Export Preferences</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl cursor-pointer hover:bg-zinc-800 transition-colors">
                    <input type="checkbox" checked readOnly className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-indigo-500" />
                    <div>
                      <div className="font-bold text-sm">Include Industry Visual Cues</div>
                      <div className="text-[10px] text-zinc-500">Adds framing and B-roll suggestions to every script segment.</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl cursor-pointer hover:bg-zinc-800 transition-colors">
                    <input type="checkbox" checked readOnly className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-indigo-500" />
                    <div>
                      <div className="font-bold text-sm">Adaptive Soundscape Design</div>
                      <div className="text-[10px] text-zinc-500">Suggests specific musical moods and Foley effects for each scene.</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <footer className="flex-shrink-0 flex items-center justify-between text-[10px] text-zinc-600 border-t border-zinc-900 pt-4 px-2">
        <div className="flex gap-4">
          <span>LATENCY: 1.2s</span>
          <span>BUILD: AIS-PRODUCTION</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          SYSTEM OPERATIONAL
        </div>
      </footer>
    </div>
  );
}
