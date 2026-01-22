
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
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-100/40 rounded-full blur-[100px] animate-blob mix-blend-multiply"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply"></div>

          <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8 pt-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-100 bg-emerald-50 text-xs font-bold text-emerald-700 mb-4 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Computer Vision & Image Processing
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
              Identifikasi <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">Tanaman Obat</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
              Proses citra digital untuk mengenali khasiat herbal. Temukan manfaat medis dan panduan pengolahan tanaman di sekitar Anda.
            </p>
          </div>
        </div>

        {/* Interaction Section */}
        <div id="analyze" className="max-w-4xl mx-auto px-6 relative z-20">
          {appState === AppState.IDLE && (
            <div 
              className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all cursor-pointer p-16 text-center group shadow-sm hover:shadow-xl"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner">
                <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Pilih Foto Tanaman</h3>
              <p className="text-slate-400 font-medium">Klik untuk upload atau tarik gambar ke sini</p>
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
            <div className="bg-white rounded-[2.5rem] p-12 text-center flex flex-col items-center shadow-lg border border-slate-100">
              <div className="relative w-64 h-64 mb-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                {previewUrl && (
                  <img src={previewUrl} alt="Processing" className="w-full h-full object-cover grayscale-[0.5]" />
                )}
                <div className="scan-line animate-scan"></div>
                <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay"></div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Memproses Citra...</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">Mengekstrak fitur morfologi dan mencocokkan dengan database botani.</p>
                <div className="flex justify-center gap-1.5 pt-4">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></div>
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]"></div>
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            </div>
          )}

          {appState === AppState.ERROR && (
             <div className="bg-white rounded-[2.5rem] p-16 text-center border border-red-50 shadow-xl">
                <div className="w-20 h-20 mx-auto bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Analisis Gagal</h3>
                <p className="text-slate-500 mt-2 mb-8">Gambar tidak dapat diproses. Coba gunakan foto dengan pencahayaan yang lebih baik.</p>
                <button onClick={handleReset} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold transition-all hover:bg-slate-800">
                  Coba Kembali
                </button>
             </div>
          )}

          {appState === AppState.SUCCESS && analysisData && (
            <AnalysisResult data={analysisData} onReset={handleReset} />
          )}
        </div>

        <DatasetSection />
      </main>

      <footer className="py-12 text-center border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-slate-400 text-sm font-semibold tracking-wide uppercase">Identifikasi Tanaman Obat © 2024</p>
          <p className="text-slate-300 text-xs mt-2">Ditenagai oleh Vercel, GitHub Pages & Gemini Vision</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
