import React from 'react';
import { KaggleDatasetInfo } from '../types';

const DatasetSection: React.FC = () => {
  const dataset: KaggleDatasetInfo = {
    title: "Medicinal Plant Dataset (Indonesia)",
    url: "https://www.kaggle.com/datasets/nurdiankasim/tanaman-herbal", // Placeholder link
    description: "Dataset ini berisi lebih dari 5,000 citra berkualitas tinggi dari 12 jenis tanaman obat populer di Indonesia. Digunakan untuk melatih model Computer Vision kami.",
    imageCount: "5,240+",
    classes: ["Daun Kari", "Daun Kunyit", "Lidah Buaya", "Daun Sirih", "Daun Mint", "Daun Kemangi", "Daun Sirsak"]
  };

  return (
    <section id="dataset" className="py-24 px-6 relative overflow-hidden bg-white">
      {/* Decorative BG */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100/60 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          
          <div className="flex-1 space-y-8">
            <div className="inline-block px-4 py-1.5 text-xs font-bold text-purple-600 bg-purple-100 rounded-full">
              Training Data Source
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Didukung oleh <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Kaggle Datasets</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Teknologi identifikasi kami disimulasikan menggunakan data latih yang komprehensif. 
              Variasi pencahayaan, sudut pandang, dan latar belakang dipelajari untuk memastikan akurasi deteksi di dunia nyata.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="text-3xl font-black text-slate-900 mb-1">{dataset.imageCount}</div>
                <div className="text-sm font-medium text-slate-500">Total Citra</div>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="text-3xl font-black text-slate-900 mb-1">{dataset.classes.length}+</div>
                <div className="text-sm font-medium text-slate-500">Jenis Tanaman</div>
              </div>
            </div>

            <a 
              href="https://www.kaggle.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 text-slate-900 hover:text-blue-600 transition-colors font-bold mt-4 group text-lg"
            >
              <img src="https://www.kaggle.com/static/images/favicon.ico" alt="Kaggle" className="w-6 h-6" />
              <span>Lihat Dataset di Kaggle</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>

          <div className="flex-1 relative">
            <div className="relative z-10 grid grid-cols-2 gap-6">
              {/* Mock Grid of Dataset Images with light borders */}
              <div className="space-y-6 translate-y-12">
                <img src="https://picsum.photos/300/400?random=1" alt="Plant 1" className="rounded-3xl shadow-xl border-4 border-white hover:scale-105 transition-transform duration-500" />
                <img src="https://picsum.photos/300/300?random=2" alt="Plant 2" className="rounded-3xl shadow-xl border-4 border-white hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="space-y-6">
                <img src="https://picsum.photos/300/300?random=3" alt="Plant 3" className="rounded-3xl shadow-xl border-4 border-white hover:scale-105 transition-transform duration-500" />
                <img src="https://picsum.photos/300/400?random=4" alt="Plant 4" className="rounded-3xl shadow-xl border-4 border-white hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            
            {/* Decorative background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-200/40 to-blue-200/40 filter blur-3xl rounded-full -z-0"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DatasetSection;
