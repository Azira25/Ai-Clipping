import React, { useState } from 'react';
import { Scissors, BarChart2, Download, Clock, Share2, Youtube, Loader2, Sparkles, CheckCircle, Github, Hash, FileText, Star, AlertTriangle } from 'lucide-react';

// KONFIGURASI URL BACKEND
// Ganti URL di bawah ini dengan URL dari Render.com setelah Anda berhasil deploy backend.
// Contoh: const API_URL = 'https://nama-aplikasi-anda.onrender.com';
const API_URL = 'https://azira25-auto-clip.hf.space'; // Default untuk testing lokal

const App = () => {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('');
  const [clips, setClips] = useState([]);
  const [activeClip, setActiveClip] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // State baru untuk kategori
  const [category, setCategory] = useState('business');

  const extractVideoId = (inputUrl) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAnalyze = async () => {
    const id = extractVideoId(url);
    if (!id) {
      alert("Mohon masukkan URL YouTube yang valid.");
      return;
    }

    setVideoId(id);
    setIsAnalyzing(true);
    setClips([]);
    setActiveClip(null);
    setErrorMsg('');
    setProgress(10);
    setAnalysisStep('Menghubungkan ke Server Cloud...'); // Updated text

    try {
      // Menggunakan API_URL yang sudah dikonfigurasi di atas
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url, category: category }),
      });

      setProgress(50);
      setAnalysisStep('Mengunduh & Memproses Transkrip Asli...');

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Gagal menganalisa video. Pastikan Backend aktif.");
      }

      const data = await response.json();
      
      setProgress(100);
      
      if (data.length === 0) {
        throw new Error("Tidak ditemukan momen menarik atau transkrip tidak tersedia.");
      }

      setClips(data);
      setActiveClip(data[0]);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const getScoreColor = (score) => {
    if (score >= 9.0) return "text-green-400 bg-green-400/10 border-green-400/20";
    if (score >= 8.0) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    return "text-blue-400 bg-blue-400/10 border-blue-400/20";
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-purple-500 selection:text-white">
      {/* Header */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-purple-600 to-blue-500 p-2 rounded-lg">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              AutoClip Real <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded ml-2 border border-slate-700">Cloud Mode</span>
            </span>
          </div>
          <div className="flex gap-4 text-sm text-slate-400 items-center">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-800 rounded-full text-green-400 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {API_URL.includes('localhost') ? 'Local Mode' : 'Cloud Mode'}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Input Section */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Analisa Video <br/>
            <span className="text-purple-400">Berdasarkan Transkrip Asli</span>
          </h1>
          <p className="text-slate-400 mb-8">
            Sistem ini menggunakan <strong>Python Backend</strong> (Flask) untuk membaca subtitle asli video dan mencari momen relevan.
          </p>

          <div className="flex flex-col gap-4">
            {/* Category Selector */}
            <div className="flex justify-center gap-2 mb-2 flex-wrap">
                {['business', 'gaming', 'podcast', 'cooking'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                            category === cat 
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                        }`}
                    >
                        {cat === 'business' ? '💼 Bisnis & Motivasi' : 
                         cat === 'gaming' ? '🎮 Gaming' : 
                         cat === 'podcast' ? '🎙️ Podcast/Comedy' : '🍳 Masak'}
                    </button>
                ))}
            </div>

            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                <div className="relative flex items-center bg-slate-800 rounded-xl p-2 border border-slate-700 shadow-2xl">
                <div className="pl-3 pr-2 text-slate-400">
                    <Youtube className="w-6 h-6" />
                </div>
                <input
                    type="text"
                    placeholder={`Tempel link YouTube ${category.charAt(0).toUpperCase() + category.slice(1)} di sini...`}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 py-2"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    isAnalyzing 
                        ? 'bg-slate-700 text-slate-400 cursor-wait' 
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    }`}
                >
                    {isAnalyzing ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    {isAnalyzing ? 'Analisa' : 'Cari Klip'}
                </button>
                </div>
            </div>
            
            {/* Error Message */}
            {errorMsg && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-center gap-3 text-sm text-left mx-auto max-w-lg mt-4">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <div>
                        <p className="font-bold">Gagal Menganalisa:</p>
                        <p>{errorMsg}</p>
                        <p className="text-xs mt-2 opacity-70">
                           {API_URL.includes('localhost') 
                             ? "Tips: Pastikan server python lokal berjalan (python server.py)."
                             : "Tips: Pastikan server cloud (Render) sedang aktif dan tidak dalam mode sleep."}
                        </p>
                    </div>
                </div>
            )}

          </div>
        </div>

        {/* Loading State */}
        {isAnalyzing && !errorMsg && (
          <div className="max-w-2xl mx-auto mb-12 bg-slate-800/50 rounded-xl p-8 border border-slate-700 text-center">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sedang Mengunduh Data Asli...</h3>
            <p className="text-slate-400 mb-6 text-sm flex items-center justify-center gap-2">
               <Sparkles className="w-4 h-4 text-yellow-400" />
               {analysisStep}
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2.5 mb-1 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {clips.length > 0 && !isAnalyzing && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            
            {/* Left: Player & Editor */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl relative aspect-video">
                {activeClip ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?start=${Math.floor(activeClip.start)}&end=${Math.floor(activeClip.end)}&autoplay=1&rel=0&modestbranding=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    Pilih klip untuk memutar
                  </div>
                )}
              </div>

              {activeClip && (
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getScoreColor(activeClip.score)}`}>
                          Rating: {activeClip.score}/10
                        </span>
                        <span className="text-slate-400 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {Math.floor(activeClip.end - activeClip.start)} Detik
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold mb-2 leading-tight text-white">{activeClip.title}</h2>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                        <h4 className="text-xs font-semibold text-slate-300 uppercase mb-2 flex items-center gap-2">
                            <FileText className="w-3 h-3 text-blue-400"/> Isi Konten (Real Transcript)
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed italic">
                            "{activeClip.description}"
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                            <h4 className="text-xs font-semibold text-slate-300 uppercase mb-2 flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-yellow-400"/> Alasan Viral
                            </h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {activeClip.reason}
                            </p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                             <h4 className="text-xs font-semibold text-slate-300 uppercase mb-2 flex items-center gap-2">
                                <Hash className="w-3 h-3 text-purple-400"/> Hashtags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {activeClip.hashtags.map((tag, idx) => (
                                    <span key={idx} className="text-purple-300 bg-purple-500/10 px-2 py-1 rounded text-xs">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Clips List */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 flex flex-col h-[700px]">
              <div className="p-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-0 rounded-t-xl z-10">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-purple-400" />
                  Hasil Analisa Real
                </h3>
              </div>
              
              <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
                {clips.map((clip) => (
                  <div 
                    key={clip.id}
                    onClick={() => setActiveClip(clip)}
                    className={`p-3 rounded-lg cursor-pointer transition-all border group ${
                      activeClip?.id === clip.id 
                        ? 'bg-slate-700 border-purple-500 ring-1 ring-purple-500' 
                        : 'bg-slate-750 border-transparent hover:bg-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <span className="font-semibold text-sm line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors">
                        {clip.title}
                      </span>
                      <span className={`shrink-0 text-xs font-bold px-1.5 py-0.5 rounded border ${getScoreColor(clip.score)}`}>
                        {clip.score}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(clip.start)} - {formatTime(clip.end)}
                      </span>
                    </div>
                    {/* Snippet kecil teks asli */}
                    <p className="text-[10px] text-slate-500 mt-2 line-clamp-1 italic">
                        "{clip.description.substring(0, 40)}..."
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;
