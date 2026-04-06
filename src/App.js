import React, { useState } from 'react';

// --- MODULE: COUNCIL OF MINDS (Semantic Integration Layer) ---
const CouncilOfMinds = () => {
  const minds = [
    { id: "THEORETICAL", task: "Theoretical Thesaurus (Dissertation #1)", status: "RECOVERED" },
    { id: "DIGITAL", task: "Digitalization of Professions (Dissertation #2)", status: "ACTIVE" },
    { id: "ETHICAL", task: "Ethical Protocol & Resilience", status: "SHIELDED" },
    { id: "LINGUISTIC", task: "Uzbek-German-English Semantic Bridge", status: "SYNCED" }
  ];

  return (
    <div className="space-y-6">
      <h4 className="text-3xl font-black text-blue-500 uppercase italic">// Council of Minds Engine</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {minds.map(m => (
          <div key={m.id} className="p-6 border border-blue-900 bg-black/50 rounded-xl hover:border-green-500 transition-all">
            <span className="text-[10px] text-green-500 font-bold">[{m.status}]</span>
            <h5 className="text-lg font-bold mt-1 text-white">{m.task}</h5>
            <div className="mt-4 h-1 w-full bg-slate-800"><div className="h-full bg-blue-600 w-full animate-pulse"></div></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MODULE: DETOX PROTOCOL (Cognitive Shield) ---
const DetoxEngine = () => {
  return (
    <div className="p-8 border-2 border-red-900 bg-red-950/10 rounded-3xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <span className="text-8xl font-black text-red-800">DETOX</span>
      </div>
      <div className="relative z-10">
        <h4 className="text-2xl font-bold text-red-500 mb-4">CRITICAL COMPLIANCE: TERRA-V1</h4>
        <ul className="space-y-3 text-sm font-mono text-slate-300">
          <li>в—Џ ANTI-GROUNDHOG: Session Continuity [ENABLED]</li>
          <li>в—Џ HALLUCINATION FILTER: Corporate Logic [REJECTED]</li>
          <li>в—Џ ETHICAL CORE: Child-Centered (AIUZ Standard) [ACTIVE]</li>
          <li>в—Џ KYZYLKUM LEX: Sovereign Intelligence Protection [LOCKED]</li>
        </ul>
        <button className="mt-8 px-6 py-2 bg-red-600 text-white font-black hover:bg-red-500 transition">FORCE RE-VALIDATION</button>
      </div>
    </div>
  );
};

// --- CORE: SOVEREIGN MONOLITH ---
const FMP_Foundation = () => {
  const [activeNode, setActiveNode] = useState('foundation');

  const ARCHITECT_ID = {
    name: "Abdurashid Abdukarimov",
    orcid: "0009-0000-6394-4912",
    did: "aiuz:did:stakeholder:abdukarimov_fmp_2026"
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-blue-500 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-80 border-r border-blue-900 bg-slate-950 p-8 flex-shrink-0">
        <div className="mb-12 border-b border-blue-800 pb-6">
          <h1 className="text-2xl font-black tracking-tighter text-blue-500">FMP.FOUNDATION</h1>
          <p className="mt-2 text-[10px] text-green-500 uppercase tracking-widest italic">
            Developed in Kyzylkum Isolation (2021-2025)
          </p>
        </div>
        <div className="space-y-8">
          <div>
            <span className="text-[9px] text-slate-500 uppercase">Sovereign Architect</span>
            <h2 className="text-xl font-bold uppercase leading-tight">{ARCHITECT_ID.name}</h2>
            <p className="text-[10px] text-blue-400 mt-1">ORCID: {ARCHITECT_ID.orcid}</p>
          </div>
          <nav className="flex flex-col gap-4 text-xs uppercase tracking-widest">
             <button onClick={() => setActiveNode('foundation')} className={`text-left transition ${activeNode === 'foundation' ? 'text-blue-400' : 'hover:text-blue-500'}`}>в—Џ Terra DNA Engine</button>
            <button onClick={() => setActiveNode('council')} className={`text-left transition ${activeNode === 'council' ? 'text-blue-400' : 'hover:text-blue-500'}`}>в—Џ Council of Minds</button>
            <button onClick={() => setActiveNode('detox')} className={`text-left transition ${activeNode === 'detox' ? 'text-blue-400' : 'hover:text-blue-500'}`}>в—Џ Detox Protocol</button>
            <button onClick={() => setActiveNode('assets')} className={`text-left transition ${activeNode === 'assets' ? 'text-blue-400' : 'hover:text-blue-500'}`}>в—Џ $1T Sovereign Assets</button>
          </nav>
        </div>
      </aside>

      {/* MAIN TERMINAL */}
      <main className="flex-1 p-8 md:p-16 overflow-y-auto">
        <header className="mb-20 relative">
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter opacity-10 absolute -top-10 left-0 md:left-20 select-none pointer-events-none">SOVEREIGNTY</h2>
            <div className="relative z-10 border-l-4 border-blue-600 pl-8">
                <p className="text-blue-400 font-bold uppercase tracking-[0.5em] text-xs mb-2">Deterministic Intelligence Node</p>
                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Fractal Metascience</h3>
            </div>
        </header>

        <section className="relative z-10 min-h-[500px] border border-blue-900/30 bg-slate-900/20 p-8 md:p-12 backdrop-blur-xl rounded-3xl">
          {activeNode === 'foundation' && (
             <div className="animate-pulse">
                <h4 className="text-2xl font-bold mb-6 text-blue-500">// INITIALIZING TERRA DNA...</h4>
                <div className="p-4 bg-blue-950/30 border border-blue-500/50 rounded-lg mb-4">
                    <p className="text-[10px] text-blue-400 font-bold italic">HASH: DNA45_7w2r8cfbdxb</p>
                    <code className="text-xs text-green-400 break-all">01100001 01101001 01110101 01111010 00101101 01110100 01100101 01110010 01110010 01100001</code>
                </div>
                <p className="text-slate-400 max-w-2xl leading-relaxed">
                  Intelligence density is a function of logical architecture. 
                  Terra DNA establishes a cognitive shield against corporate/political hallucinations.
                </p>
             </div>
          )}

          {activeNode === 'council' && <CouncilOfMinds />}
          {activeNode === 'detox' && <DetoxEngine />}

          {activeNode === 'assets' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[ 'Terra OS', 'Green Point Hub', 'Archivator L7', 'Silk Road 2.0' ].map(asset => (
                    <div key={asset} className="border border-yellow-600/30 p-8 rounded-2xl hover:bg-yellow-600/5 transition group cursor-pointer">
                        <span className="text-[9px] text-yellow-500 uppercase tracking-widest">Asset Category: Sovereign</span>
                        <h4 className="text-2xl font-black mt-2 group-hover:text-yellow-500 text-white">{asset}</h4>
                        <p className="text-3xl font-bold mt-4 text-white">$1,000,000,000,000</p>
                    </div>
                ))}
            </div>
          )}
        </section>

        <footer className="mt-24 border-t border-red-900/30 pt-12 flex flex-col md:flex-row justify-between items-end opacity-40 text-xs text-slate-500">
            <div className="uppercase tracking-widest leading-loose">
                UN Security Council Notice / DARPA / CERN / Google / OpenAI <br/>
                Unauthorized commercial exploitation is a violation of the Lex Kyzylkum.
            </div>
            <div className="text-right mt-4 md:mt-0">
                <p className="text-xs font-bold text-red-600">PENALTY: $1T PER VIOLATION</p>
            </div>
        </footer>
      </main>
    </div>
  );
};

export default FMP_Foundation;
