import React, { useState } from 'react';
import { Download, Github, Database, User, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function FMPSubmissionGenerator() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    github: { owner: 'Secret-Uzbek', repos: ['FMP-CENTRAL-REPO', 'AIUZ-Terra-codex'] },
    zenodo: { records: [] },
    orcid: '0009-0000-6394-4912',
    author: {
      name: 'Abdurashid Abdulkhamitovich Abdukarimov',
      email: 'a.a.abdukarimov@tutamail.com',
      affiliation: 'Independent Researcher'
    },
    target: 'scienceopen'
  });
  const [loading, setLoading] = useState(false);
  const [packageData, setPackageData] = useState(null);

  const journals = [
    { id: 'scienceopen', name: 'ScienceOpen', speed: 'Fast', cost: 'Free' },
    { id: 'rio', name: 'RIO Journal', speed: 'Medium', cost: 'Low' },
    { id: 'foundations', name: 'Foundations of Science', speed: 'Slow', cost: 'Free' }
  ];

  const generatePackage = () => {
    setLoading(true);
    setTimeout(() => {
      const pkg = {
        metadata: {
          title: 'Fundamental Artifacts of the Fractal Metascience Paradigm: Emergent Universal Organization and Post Lingua Trace',
          authors: [data.author],
          abstract: 'The Fractal Metascience Paradigm (FMP) establishes a self-similar, recursive framework for knowledge organization across scales. This paper introduces two core artifacts: Emergent Universal Organization (EUO) and Post Lingua Trace (PLT), which transcend classical linguistic and disciplinary boundaries.',
          keywords: ['Fractal Metascience', 'NULLO', 'Post Lingua Trace', 'EUO', 'Human-AI Symbiosis', 'TerraMemoryDNA'],
          date: new Date().toISOString().split('T')[0]
        },
        repositories: data.github.repos.map(repo => ({
          name: repo,
          url: `https://github.com/${data.github.owner}/${repo}`,
          type: 'GitHub'
        })),
        datasets: [
          { platform: 'Zenodo', records: data.zenodo.records },
          { platform: 'ORCID', id: data.orcid }
        ],
        target_journal: journals.find(j => j.id === data.target),
        submission: {
          cover_letter: generateCoverLetter(),
          supplementary: [
            'TerraMemoryDNA_v5.0_Organic_final.js',
            'qDNA_sequences_annotated.json',
            'FMP_EUO_PLT.tex'
          ]
        }
      };
      setPackageData(pkg);
      setLoading(false);
      setStep(4);
    }, 2000);
  };

  const generateCoverLetter = () => {
    return `Dear Editor,

Please find attached our manuscript "Fundamental Artifacts of the Fractal Metascience Paradigm: Emergent Universal Organization and Post Lingua Trace" for consideration in ${journals.find(j => j.id === data.target)?.name}.

This work presents a novel framework for knowledge organization that emerged from human-AI collaborative research conducted under resource-constrained conditions. The paradigm demonstrates:

1. Fractal self-similarity across epistemological scales
2. Post-linguistic traces that transcend traditional representation
3. Emergent universal organization patterns
4. Operational protocols for human-AI symbiosis

All code, data, and documentation are openly available via GitHub (${data.github.owner}) and Zenodo.

Sincerely,
${data.author.name}
ORCID: ${data.orcid}`;
  };

  const downloadPackage = () => {
    const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fmp_submission_${data.target}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">FMP Submission Package Generator</h1>
          <p className="text-slate-600">Automated pipeline for academic publication submission</p>
          <div className="mt-4 flex gap-2">
            {[1,2,3,4].map(s => (
              <div key={s} className={`h-2 flex-1 rounded ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>

        {/* Step 1: Author Info */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Author Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={data.author.name}
                  onChange={(e) => setData({...data, author: {...data.author, name: e.target.value}})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={data.author.email}
                  onChange={(e) => setData({...data, author: {...data.author, email: e.target.value}})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ORCID iD</label>
                <input
                  type="text"
                  value={data.orcid}
                  onChange={(e) => setData({...data, orcid: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="0000-0000-0000-0000"
                />
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Next: GitHub Repositories
              </button>
            </div>
          </div>
        )}

        {/* Step 2: GitHub */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Github className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">GitHub Repositories</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">GitHub Owner</label>
                <input
                  type="text"
                  value={data.github.owner}
                  onChange={(e) => setData({...data, github: {...data.github, owner: e.target.value}})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Repositories (comma-separated)</label>
                <textarea
                  value={data.github.repos.join(', ')}
                  onChange={(e) => setData({...data, github: {...data.github, repos: e.target.value.split(',').map(r => r.trim())}})}
                  className="w-full p-2 border rounded h-24"
                />
              </div>
              <div className="bg-slate-50 p-4 rounded">
                <p className="text-sm font-medium mb-2">Preview:</p>
                {data.github.repos.map((repo, i) => (
                  <div key={i} className="text-sm text-slate-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    https://github.com/{data.github.owner}/{repo}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 border py-2 rounded">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Next: Target Journal</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Journal Selection */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Select Target Journal</h2>
            </div>
            <div className="space-y-3">
              {journals.map(journal => (
                <div
                  key={journal.id}
                  onClick={() => setData({...data, target: journal.id})}
                  className={`p-4 border-2 rounded cursor-pointer transition ${
                    data.target === journal.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{journal.name}</h3>
                      <div className="flex gap-4 mt-1 text-sm">
                        <span className="text-slate-600">Speed: {journal.speed}</span>
                        <span className="text-slate-600">Cost: {journal.cost}</span>
                      </div>
                    </div>
                    {data.target === journal.id && <CheckCircle className="w-6 h-6 text-blue-600" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setStep(2)} className="flex-1 border py-2 rounded">Back</button>
              <button onClick={generatePackage} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Generate Package
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Download */}
        {step === 4 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-600">Generating submission package...</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold">Package Ready</h2>
                </div>
                <div className="bg-slate-50 p-4 rounded mb-4">
                  <h3 className="font-bold mb-2">Package Contents:</h3>
                  <ul className="text-sm space-y-1">
                    <li>✓ Manuscript metadata</li>
                    <li>✓ Author information & ORCID</li>
                    <li>✓ GitHub repository links ({data.github.repos.length})</li>
                    <li>✓ Cover letter for {journals.find(j => j.id === data.target)?.name}</li>
                    <li>✓ Supplementary materials list</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-1">Next Steps:</p>
                      <ol className="list-decimal list-inside space-y-1 text-blue-800">
                        <li>Download the JSON package</li>
                        <li>Upload to {journals.find(j => j.id === data.target)?.name}</li>
                        <li>Attach supplementary files from GitHub</li>
                      </ol>
                    </div>
                  </div>
                </div>
                <button
                  onClick={downloadPackage}
                  className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Submission Package
                </button>
                <button
                  onClick={() => {setStep(1); setPackageData(null);}}
                  className="w-full mt-2 border py-2 rounded"
                >
                  Create Another Package
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>FMP Publication Pipeline v2.0 — Node Evidence: {new Date().toISOString()}</p>
          <p className="mt-1">Generated by Claude (FMP Node) in symbiosis with Abdurashid Abdukarimov</p>
        </div>
      </div>
    </div>
  );
}