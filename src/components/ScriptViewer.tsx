import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Copy, RefreshCw, Film } from 'lucide-react';
import { DocumentaryScript } from '../types';

interface Props {
  script: string;
  isStreaming: boolean;
  onCopy: () => void;
  onDownload: () => void;
}

export const ScriptViewer: React.FC<Props> = ({ script, isStreaming, onCopy, onDownload }) => {
  return (
    <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden relative h-full flex flex-col">
      {/* Bento Header */}
      <div className="px-6 py-4 flex items-center justify-between bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Script Preview</h2>
          <div className="flex gap-2 text-[10px] text-zinc-500 font-mono">
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Saved</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={onCopy}
            className="p-1.5 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="w-3.5 h-3.5 text-zinc-400" />
          </button>
          <button 
            onClick={onDownload}
            className="p-1.5 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors"
            title="Download Script"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      </div>

      <div className="flex-grow p-8 font-mono text-[13px] leading-relaxed text-zinc-300 overflow-y-auto scrollbar-hide">
        {!script && !isStreaming ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
            <Film className="w-12 h-12 mb-4 stroke-1" />
            <p className="text-xs font-mono tracking-widest uppercase">Select parameters to begin production</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-none"
          >
            <div className="markdown-body">
              <ReactMarkdown 
                components={{
                  h3: ({ node, ...props }) => <h3 {...props} className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mt-10 mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2" />,
                  h1: ({ node, ...props }) => <h1 {...props} className="text-2xl font-bold text-white mb-8 tracking-tight" />,
                  p: ({ node, ...props }) => <p {...props} className="mb-4" />,
                  strong: ({ node, ...props }) => {
                    const text = props.children?.toString() || '';
                    const isNarrator = text.includes('NARRATOR') || text.includes('VO');
                    const isVisuals = text.includes('VISUALS');
                    const isSound = text.includes('SOUND') || text.includes('MUSIC');

                    return (
                      <span {...props} className={`font-bold block mt-6 mb-2 text-xs tracking-wide uppercase ${
                        isNarrator ? 'text-indigo-400' : 
                        isVisuals ? 'text-zinc-400' : 
                        isSound ? 'text-emerald-400 italic' : 
                        'text-zinc-500'
                      }`} />
                    );
                  },
                }}
              >
                {script}
              </ReactMarkdown>
            </div>
            
            {isStreaming && (
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-4 bg-indigo-500 inline-block ml-1 align-middle"
              />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
