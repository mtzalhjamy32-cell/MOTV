import React, { useState } from 'react';
import { MediaItem } from '../types';
import { detectMediaType } from '../utils/m3uParser';
import { Link, Play, X, Smartphone, Globe, CheckCircle } from 'lucide-react';

interface AddStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayStream: (item: MediaItem) => void;
}

export const AddStreamModal: React.FC<AddStreamModalProps> = ({ isOpen, onClose, onPlayStream }) => {
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [streamTitle, setStreamTitle] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamUrl.trim()) return;

    const url = streamUrl.trim();
    const type = detectMediaType(url);
    const title = streamTitle.trim() || `بث / فيديو (${type.toUpperCase()})`;

    const newItem: MediaItem = {
      id: `custom-${Date.now()}`,
      title,
      url,
      type,
      category: 'روابط مخصصة',
      addedAt: Date.now(),
    };

    setSuccessMsg('جاري فتح الرابط في المشغل...');
    setTimeout(() => {
      onPlayStream(newItem);
      setStreamUrl('');
      setStreamTitle('');
      setSuccessMsg(null);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Link className="w-5 h-5 text-cyan-400" />
          <span>تشغيل رابط بث أو فيديو مباشر</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          أدخل رابط أي تدفق مباشر أو فيديو (يدعم .ts, .m3u8, .mp4, والمزيد) لتشغيله فوراً.
        </p>

        {successMsg && (
          <div className="mb-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-3 flex items-center gap-2 text-emerald-300 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">عنوان الفيديو أو البث (اختياري)</label>
            <input
              type="text"
              placeholder="مثال: قناة الرياضة المباشرة"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">رابط البث أو الملف (URL)</label>
            <input
              type="url"
              required
              placeholder="https://example.com/stream.m3u8 أو .ts أو .mp4"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono text-xs"
            />
          </div>

          {/* Android Intent Hint */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex items-start gap-3 text-slate-400 text-xs">
            <Smartphone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200 mb-0.5">الاستقبال من تطبيقات أخرى (Android Intent):</p>
              <p>يمكنك فتح هذا التطبيق من أي متصفح أو تطبيق آخر عن طريق إرسال الرابط بالمعامل: <code className="text-cyan-400 font-mono">?url=رابط_الفيديو</code></p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>تشغيل الآن</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
