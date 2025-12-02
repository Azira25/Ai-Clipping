import React, { useState, useEffect, useRef } from 'react';
import { Play, Scissors, BarChart2, Download, Clock, Share2, Youtube, Loader2, Sparkles, CheckCircle, AlertCircle, Github } from 'lucide-react';

const App = () => {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('');
  const [clips, setClips] = useState([]);
  const [activeClip, setActiveClip] = useState(null);
  const [videoDuration, setVideoDuration] = useState(600); // Default 10 mins mockup

  // Fungsi untuk ekstrak ID YouTube dari URL
  const extractVideoId = (inputUrl) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAnalyze = () => {
    const id = extractVideoId(url);
    if (!id) {
      alert("Mohon masukkan URL YouTube yang valid.");
      return;
    }

    setVideoId(id);
    setIsAnalyzing(true);
    setClips([]);
    setActiveClip(null);
    setProgress(0);

    // Simulasi Proses Analisis AI
    const steps = [
      "Mengunduh transkrip audio...",
      "Analisis Semantik & SEO Keywords...",
      "Mendeteksi pola retensi audiens...",
      "Optimasi Judul Clickbait & Viral...",
      "Finalisasi klip..."
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          generateMockClips(id);
          setIsAnalyzing(false);
          return 100;
        }
        
        // Update teks langkah analisis
        if (prev % 20 === 0 && currentStep < steps.length) {
          setAnalysisStep(steps[currentStep]);
          currentStep++;
        }
        
        return prev + 2; // Kecepatan loading
      });
    }, 100);
  };

  // Generate Klip dengan Judul SEO Friendly & Viral
  const generateMockClips = (vidId) => {
    // Judul diperbarui menggunakan formula SEO: Hook + Keyword + Benefit/Curiosity
    const generatedClips = [
      { 
        id: 1, 
        title: "NGAKAK ABIS! Momen Paling Lucu yang Bikin Sakit Perut (Wajib Tonton)", 
        start: 30, end: 45, 
        score: 98, 
        reason: "Tawa keras & lonjakan volume audio terdeteksi" 
      },
      { 
        id: 2, 
        title: "RAHASIA SUKSES: Inti Pembahasan yang Jarang Orang Tahu (Terungkap)", 
        start: 120, end: 150, 
        score: 95, 
        reason: "High retention rate & kata kunci bernilai tinggi" 
      },
      { 
        id: 3, 
        title: "FAKTA MENGEJUTKAN! Ternyata Selama Ini Kita Salah? 😱", 
        start: 200, end: 215, 
        score: 92, 
        reason: "Pernyataan kontroversial & trending topic" 
      },
      { 
        id: 4, 
        title: "JANGAN LAKUKAN INI! Kesalahan Fatal yang Sering Diabaikan", 
        start: 310, end: 325, 
        score: 89, 
        reason: "Emosi negatif (fear/warning) pemicu klik" 
      },
      { 
        id: 5, 
        title: "CARA CEPAT KAYA? Kesimpulan Tajam dari Pakar Ekonomi", 
        start: 400, end: 420, 
        score: 88, 
        reason: "Pacing bicara cepat & keyword finansial" 
      },
      { 
        id: 6, 
        title: "DIBALIK LAYAR: Bloopers Tak Terduga yang Bikin Malu", 
        start: 50, end: 60, 
        score: 85, 
        reason: "Anomali audio & jeda canggung (Authenticity)" 
      },
      { 
        id: 7, 
        title: "DEBAT PANAS! Pertanyaan Penonton yang Bikin Narasumber Diam", 
        start: 450, end: 470, 
        score: 82, 
        reason: "Interaksi tinggi & ketegangan vokal" 
      },
      { 
        id: 8, 
        title: "MOTIVASI HIDUP: Quote Inspiratif untuk Mengubah Nasibmu", 
        start: 500, end: 515, 
        score: 80, 
        reason: "Nada bicara motivasional & musik latar naik" 
      },
      { 
        id: 9, 
        title: "VISUAL MEMUKAU: Transisi Edit Level Dewa (Tutorial Singkat)", 
        start: 10, end: 20, 
        score: 78, 
        reason: "Perubahan visual cepat & saturasi warna" 
      },
      { 
        id: 10, 
        title: "BONUS KHUSUS: Cara Mendapatkan Akses Gratis (Limited Time)", 
        start: 580, end: 595, 
        score: 75, 
        reason: "Call to Action (CTA) kuat & urgensi" 
      },
    ];
    setClips(generatedClips);
    // Auto play klip pertama
    setActiveClip(generatedClips[0]);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-yellow-400";
    return "text-blue-400";
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
              AutoClip AI
            </span>
          </div>
          <div className="flex gap-4 text-sm text-slate-400 items-center">
            <span className="hover:text-white cursor-pointer hidden md:block">Dashboard</span>
            <span className="hover:text-white cursor-pointer hidden md:block">Pricing</span>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border border-slate-700"
            >
              <Github className="w-3 h-3" />
              Deploy to GitHub
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Input Section */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Ubah Video Panjang Jadi <br/>
            <span className="text-purple-400">Shorts Viral</span> + SEO Judul
          </h1>
          <p className="text-slate-400 mb-8">
            Tempel link YouTube, AI kami akan mencari 10 momen terbaik, membuatkan <strong>Judul SEO Clickbait</strong>, dan memotongnya untuk TikTok, Reels, & Shorts.
          </p>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative flex items-center bg-slate-800 rounded-xl p-2 border border-slate-700 shadow-2xl">
              <div className="pl-3 pr-2 text-slate-400">
                <Youtube className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Tempel link YouTube di sini (contoh: https://youtu.be/...)"
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
                {isAnalyzing ? 'Menganalisis...' : 'Analisa Video'}
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <div className="max-w-2xl mx-auto mb-12 bg-slate-800/50 rounded-xl p-8 border border-slate-700 text-center">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sedang Mencari Momen Viral...</h3>
            <p className="text-slate-400 mb-6 text-sm">{analysisStep}</p>
            <div className="w-full bg-slate-700 rounded-full h-2.5 mb-1 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Mulai</span>
              <span>{Math.round(progress)}%</span>
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
                    src={`https://www.youtube.com/embed/${videoId}?start=${activeClip.start}&end=${activeClip.end}&autoplay=1&rel=0&modestbranding=1`}
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
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-bold mb-2 leading-tight">{activeClip.title}</h2>
                      <div className="flex items-center gap-2 text-sm text-slate-400 flex-wrap">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(activeClip.start)} - {formatTime(activeClip.end)}</span>
                        <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                        <span className="text-green-400 font-semibold">Skor Viral: {activeClip.score}/100</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition" title="Copy Title">
                        <Share2 className="w-5 h-5 text-slate-300" />
                      </button>
                      <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center gap-2 transition text-sm md:text-base">
                        <Download className="w-4 h-4" />
                        <span className="hidden md:inline">Export MP4</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Mengapa klip ini viral?</h4>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {activeClip.reason}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Clips List */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 flex flex-col h-[600px]">
              <div className="p-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-0 rounded-t-xl z-10">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-purple-400" />
                  10 Klip Terdeteksi
                </h3>
              </div>
              
              <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
                {clips.map((clip) => (
                  <div 
                    key={clip.id}
                    onClick={() => setActiveClip(clip)}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      activeClip?.id === clip.id 
                        ? 'bg-slate-700 border-purple-500 ring-1 ring-purple-500' 
                        : 'bg-slate-750 border-transparent hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <span className="font-semibold text-sm line-clamp-2 leading-snug">{clip.title}</span>
                      <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full bg-slate-900 ${getScoreColor(clip.score)}`}>
                        {clip.score}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(clip.start)} - {formatTime(clip.end)}
                      </span>
                      <span>{(clip.end - clip.start)}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
        
        {/* Placeholder / Empty State */}
        {clips.length === 0 && !isAnalyzing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-center">
             {[
               {icon: <Clock className="w-8 h-8 text-blue-400"/>, title: "Hemat Waktu", desc: "Tidak perlu menonton ulang video berjam-jam."},
               {icon: <Sparkles className="w-8 h-8 text-purple-400"/>, title: "Optimasi SEO", desc: "Judul otomatis yang ramah mesin pencari dan memancing klik."},
               {icon: <BarChart2 className="w-8 h-8 text-green-400"/>, title: "Siap Viral", desc: "Format dioptimalkan untuk engagement tinggi."}
             ].map((item, idx) => (
               <div key={idx} className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                 <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                   {item.icon}
                 </div>
                 <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                 <p className="text-slate-400 text-sm">{item.desc}</p>
               </div>
             ))}
          </div>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.8);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 1);
        }
      `}</style>
    </div>
  );
};

export default App;
