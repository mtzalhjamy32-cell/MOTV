import React from 'react';
import { PlayHistoryItem, MediaItem } from '../types';
import { History, Play, Trash2, Clock, Radio } from 'lucide-react';

interface HistoryViewProps {
  history: PlayHistoryItem[];
  onPlayItem: (item: MediaItem) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onPlayItem, onClearHistory }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>سجل المشاهدة والتشغيل السابق</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            تابع الفيديوهات والقنوات التي قمت بتشغيلها مؤخراً مع إمكانية إعادة الاستئناف.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>مسح السجل</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300 mb-1">سجل المشاهدة فارغ</h3>
          <p className="text-xs text-slate-500">القنوات والفيديوهات التي تقوم بتشغيلها ستظهر هنا تلقائياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {history.map((item) => {
            const mediaItem: MediaItem = {
              id: item.id,
              title: item.title,
              url: item.url,
              type: item.type,
              logo: item.logo,
            };

            const dateStr = new Date(item.lastPlayed).toLocaleString('ar-SA', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                onClick={() => onPlayItem(mediaItem)}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 transition-all duration-300 cursor-pointer group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <Radio className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono bg-slate-950 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30 uppercase">
                      {item.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm line-clamp-2 mb-1 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> {dateStr}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Play className="w-3.5 h-3.5 fill-current" /> تشغيل مجدداً
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 truncate max-w-[100px]">{item.url}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
