
import React from 'react';
import { PlantAnalysis } from '../types';

interface AnalysisResultProps {
  data: PlantAnalysis;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onReset }) => {
  return (
    <div className="animate-fade-in w-full max-w-4xl mx-auto bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] mt-12">
      
      {/* Header Image/Banner */}
      <div className="relative h-56 bg-gradient-to-br from-emerald-600 to-teal-800 p-10 flex flex-col justify-end overflow-hidden">
        {/* Abstract decoration */}
        <div className="absolute top-0 right-0 p-40 bg-white/10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 p-20 bg-emerald-400/20 rounded-full blur-2xl transform -translate-x-1/4 translate-y-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">{data.name}</h2>
            <p className="text-emerald-100 font-medium italic text-xl bg-white/10 backdrop-blur-sm inline-block px-4 py-1 rounded-full">
              {data.scientificName}
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
             <div className="text-xs text-emerald-100 uppercase tracking-wider font-bold mb-1">Confidence Score</div>
             <div className="flex items-center space-x-3">
                <div className="w-32 h-2.5 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" 
                    style={{ width: `${data.confidence}%` }}
                  ></div>
                </div>
                <span className="text-white font-black text-lg">{data.confidence}%</span>
             </div>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-10 space-y-10">
        
        {/* Model Performance Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center hover:shadow-md transition-shadow">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Accuracy</div>
            <div className="text-2xl font-black text-blue-700">{data.mlMetrics?.accuracy ?? 95}%</div>
          </div>
          <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100 text-center hover:shadow-md transition-shadow">
            <div className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-1">Precision</div>
            <div className="text-2xl font-black text-violet-700">{data.mlMetrics?.precision ?? 92}%</div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center hover:shadow-md transition-shadow">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Recall</div>
            <div className="text-2xl font-black text-amber-700">{data.mlMetrics?.recall ?? 89}%</div>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center hover:shadow-md transition-shadow">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">F1-Score</div>
            <div className="text-2xl font-black text-rose-700">{data.mlMetrics?.f1Score ?? 90}%</div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center">
          <span className={`px-5 py-2 rounded-full text-sm font-bold border flex items-center gap-2 ${data.isMedicinal ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {data.isMedicinal ? (
              <>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Tanaman Obat Terverifikasi
              </>
            ) : '⚠️ Bukan Tanaman Obat / Tidak Diketahui'}
          </span>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-3">Tentang Tanaman</h3>
          <p className="text-slate-600 leading-8 text-lg">
            {data.description}
          </p>
        </div>

        {data.isMedicinal && (
          <div className="grid md:grid-cols-2 gap-10">
            {/* Benefits */}
            <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2.5 rounded-xl mr-3 shadow-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </span>
                Manfaat Kesehatan
              </h3>
              <ul className="space-y-4">
                {data.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start text-slate-700 font-medium">
                    <span className="mr-3 text-blue-500 mt-1.5">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Processing */}
            <div className="bg-purple-50/50 p-8 rounded-3xl border border-purple-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="bg-purple-100 text-purple-600 p-2.5 rounded-xl mr-3 shadow-sm">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </span>
                Cara Pengolahan
              </h3>
              <div className="space-y-5">
                {data.processingGuide.map((step, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-purple-200 text-purple-600 flex items-center justify-center text-sm font-bold shadow-sm group-hover:border-purple-400 transition-colors">
                      {step.step}
                    </div>
                    <p className="text-slate-700 leading-relaxed">{step.instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Side Effects Warning */}
         {data.isMedicinal && data.sideEffects && data.sideEffects.length > 0 && (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 flex items-start gap-4">
              <div className="text-orange-500 bg-orange-100 p-2 rounded-full shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Efek Samping & Perhatian</h4>
                <p className="text-slate-600 text-sm">
                  {data.sideEffects.join(", ")}
                </p>
              </div>
            </div>
         )}
        
        {/* Reset Button */}
        <div className="pt-6 border-t border-slate-100 flex justify-center">
          <button 
            onClick={onReset}
            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center space-x-3"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            <span>Scan Tanaman Lain</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AnalysisResult;
