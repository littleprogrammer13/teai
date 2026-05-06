import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeaiApp() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <div className="min-h-screen bg-[#020202] text-[#e0e0e0] font-sans selection:bg-cyan-500">
      {/* HUD de Navegação */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center backdrop-blur-md z-50">
        <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">TEAI</h1>
        <div className="flex gap-8 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
          {['Text', 'Image', 'Audio', 'Video'].map(t => (
            <button key={t} onClick={() => setActiveTab(t.toLowerCase())} className={activeTab === t.toLowerCase() ? "text-cyan-400" : ""}>{t}</button>
          ))}
        </div>
      </nav>

      <main className="pt-32 max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-5xl font-medium mb-8 leading-tight">Crie universos com <span className="italic">inteligência pura.</span></h2>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <textarea 
              className="relative w-full h-48 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-xl focus:outline-none focus:border-zinc-700"
              placeholder={`Descreva sua visão para ${activeTab}...`}
            />
          </div>

          <div className="mt-8 flex justify-between items-center">
             <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[10px] font-bold">L3</div>
                <div className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[10px] font-bold">SVD</div>
                <div className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[10px] font-bold">AD2</div>
             </div>
             <button className="bg-white text-black px-12 py-4 rounded-2xl font-black hover:bg-cyan-400 transition-all active:scale-95 shadow-2xl shadow-cyan-500/20">
                GERAR {activeTab.toUpperCase()}
             </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
