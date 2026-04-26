import React from 'react';
import { DocumentaryTone, ScriptParams } from '../types';
import { Clapperboard, FileText, Globe, Clock, MessageSquare, Sparkles } from 'lucide-react';

interface Props {
  params: ScriptParams;
  setParams: (params: ScriptParams) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const DirectorDashboard: React.FC<Props> = ({ params, setParams, onGenerate, isLoading }) => {
  const tones: DocumentaryTone[] = ['investigative', 'poetic', 'nature', 'historical', 'true-crime', 'biographical'];

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Documentary Parameters</h2>
        <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 uppercase font-mono">Manual Entry</span>
      </div>

      <div className="space-y-6">
        {/* Topic Input */}
        <div>
          <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Subject Matter</label>
          <textarea
            value={params.topic}
            onChange={(e) => setParams({ ...params, topic: e.target.value })}
            placeholder="e.g. The secret life of urban foxes..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none h-24"
          />
        </div>

        {/* Tone Selection */}
        <div>
          <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Narrative Tone</label>
          <div className="grid grid-cols-2 gap-2">
            {tones.map((tone) => (
              <button
                key={tone}
                onClick={() => setParams({ ...params, tone })}
                className={`text-[10px] uppercase font-bold py-2 px-3 rounded-lg border transition-all ${
                  params.tone === tone 
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' 
                    : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'
                }`}
              >
                {tone.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Style & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Runtime (min)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={isNaN(params.duration) ? '' : params.duration}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setParams({ ...params, duration: isNaN(val) ? 0 : val });
              }}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Narrative Style</label>
            <select
              value={params.narrativeStyle}
              onChange={(e) => setParams({ ...params, narrativeStyle: e.target.value as any })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%236b7280%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27m6%208%204%204%204-4%27%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
            >
              <option value="narrator">Omniscient</option>
              <option value="interview">Interview</option>
              <option value="first-person">POV</option>
            </select>
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Target Audience</label>
          <input
            type="text"
            value={params.targetAudience}
            onChange={(e) => setParams({ ...params, targetAudience: e.target.value })}
            placeholder="e.g. History buffs..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          onClick={onGenerate}
          disabled={isLoading || !params.topic}
          className="w-full mt-4 bg-white text-zinc-950 font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Generate Full Script
              <Sparkles className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <div className="mt-auto pt-10 text-[10px] text-zinc-600 font-mono tracking-tighter flex items-center justify-between">
        <span>ENGINE: GEMINI 1.5 PRO</span>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
          <span>READY</span>
        </div>
      </div>
    </div>
  );
};
