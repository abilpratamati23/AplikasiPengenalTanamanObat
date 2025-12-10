import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import DatasetSection from './components/DatasetSection';
import AnalysisResult from './components/AnalysisResult';
import { AppState, PlantAnalysis } from './types';
import { analyzePlantImage, fileToBase64 } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysisData, setAnalysisData] = useState<PlantAnalysis | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setAppState(AppState.ANALYZING);

    try {
      const base64 = await fileToBase64(file);
      const result = await analyzePlantImage(base64);
      setAnalysisData(result);
      setAppState(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setAnalysisData(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-background text-slate-800 overflow-x-hidden selection:bg-emerald-200">
      <Navbar />

      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <div className="relative max-w-7xl mx-auto px-6 mb-20">
          {/* Light Mode Blobs */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-200/50 rounded-full blur-[100px] animate-blob mix-blend-multiply"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200/50 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply"></div>
          <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-blue-200/50 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply -translate-x-1/2"></div>

          <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8 pt-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm text-sm font-semibold text-slate-600 mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Powered by Advanced Computer Vision
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
              Kenali Tanaman Obat <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">di Sekitarmu</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Identifikasi tanaman herbal secara instan, pahami manfaat medisnya, dan pelajari cara pengolahan yang tepat untuk kesehatan Anda.
            </p>
          </div>
        </div>

        {/* Upload/Interaction Section */}
        <div id="analyze" className="max-w-4xl mx-auto px-6 relative z-20">
          {appState === AppState.IDLE && (
            <div 
              className="glass-panel rounded-[2.5rem] border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer p-16 text-center group shadow-xl"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.2)]">
                <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-3">Upload Foto Tanaman</h3>
              <p className="text-slate-500 text-lg">Klik area ini atau drag foto ke sini</p>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*" 
                className="hidden" 
              />
            </div>
          )}

          {appState === AppState.ANALYZING && (
            <div className="glass-panel rounded-[2.5rem] p-16 text-center flex flex-col items-center shadow-xl">
              <div className="relative w-40 h-40 mb-8">
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-3xl opacity-80 shadow-inner" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[2px] rounded-3xl">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 animate-pulse">Sedang Menganalisis...</h3>
              <p className="text-slate-500 mt-2 font-medium">Sistem sedang mengidentifikasi karakteristik tanaman.</p>
            </div>
          )}

          {appState === AppState.ERROR && (
             <div className="bg-white rounded-[2.5rem] p-16 text-center border border-red-100 shadow-xl">
                <div className="w-24 h-24 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Gagal Menganalisis</h3>
                <p className="text-slate-500 mt-2 mb-8">Terjadi kesalahan saat memproses gambar. Pastikan format gambar sesuai atau coba gambar lain.</p>
                <button onClick={handleReset} className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-colors">
                  Coba Lagi
                </button>
             </div>
          )}

          {appState === AppState.SUCCESS && analysisData && (
            <AnalysisResult data={analysisData} onReset={handleReset} />
          )}
        </div>

        <DatasetSection />
      </main>

      <footer className="py-12 text-center border-t border-slate-200 bg-white">
        <p className="text-slate-500 text-sm font-medium">© 2024 Identifikasi Tanaman Obat. Built with React & Gemini 2.5.</p>
      </footer>
    </div>
  );
};

export default App;