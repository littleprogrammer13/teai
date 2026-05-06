import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function TeaiApp() {
  const [activeTab, setActiveTab] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("teai_token") || "");
  const [loginData, setLoginData] = useState({ user: '', pass: '' });

  const handleLogin = async () => {
    const res = await fetch('/teai/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ user: loginData.user, password: loginData.pass })
    });
    const d = await res.json();
    if(d.auth) { 
      setToken(d.token); 
      localStorage.setItem("teai_token", d.token);
      alert("Acesso Vilor Confirmado.");
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch('/teai/generate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ prompt, mode: activeTab, token })
    });
    // Lógica de exibição de resultado (Blob ou JSON)
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-[#e0e0e0] font-sans">
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center backdrop-blur-md z-50 border-b border-white/5">
        <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">TEAI</h1>
        <div className="flex gap-6 items-center">
          {['Text', 'Image', 'Audio', 'Video'].map(t => (
            <button key={t} onClick={() => setActiveTab(t.toLowerCase())} 
              className={`text-xs font-bold uppercase ${activeTab === t.toLowerCase() ? "text-cyan-400" : "text-gray-500"}`}>{t}</button>
          ))}
          {!token && (
            <div className="flex gap-2 bg-zinc-900 p-2 rounded-lg border border-white/10">
              <input placeholder="Vilor?" className="bg-transparent text-xs w-16 outline-none" onChange={e => setLoginData({...loginData, user: e.target.value})} />
              <input type="password" placeholder="Pass" className="bg-transparent text-xs w-16 outline-none" onChange={e => setLoginData({...loginData, pass: e.target.value})} />
              <button onClick={handleLogin} className="text-[10px] text-cyan-400 font-bold">OK</button>
            </div>
          )}
          {token && <span className="text-[10px] text-green-500 font-bold tracking-tighter">VILOR ACCESS</span>}
        </div>
      </nav>

      <main className="pt-40 max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-6xl font-medium mb-12 tracking-tight">Evolua sua <span className="italic font-light">imaginação.</span></h2>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
            <textarea 
              className="relative w-full h-56 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-xl focus:outline-none focus:border-zinc-700 transition-all"
              placeholder={`Descreva sua visão para ${activeTab}...`}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <div className="mt-8 flex justify-between items-center">
             <p className="text-zinc-600 text-xs tracking-widest uppercase">{token ? "Modo Ilimitado" : "Free Trial Ativo"}</p>
             <button onClick={handleGenerate} className="bg-white text-black px-16 py-5 rounded-2xl font-black hover:bg-cyan-400 transition-all shadow-2xl">
                {loading ? "PROCESSANDO..." : `GERAR ${activeTab.toUpperCase()}`}
             </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
