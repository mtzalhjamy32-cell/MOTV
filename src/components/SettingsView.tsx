import React from 'react';
import { Settings, Smartphone, Radio, Shield, Code, Info, RefreshCw } from 'lucide-react';

interface SettingsViewProps {
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg mb-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          <span>إعدادات التطبيق ومعلومات الأندرويد</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          دليل التشغيل على نظام أندرويد واستقبال روابط البث والفيديو من التطبيقات الخارجية.
        </p>
      </div>

      <div className="space-y-6">
        {/* Android Integration Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">دعم تطبيق أندرويد وتشغيل الروابط الخارجية</h2>
              <p className="text-xs text-slate-400">كيفية ربط التطبيق مع مشغلات ونظامات أندرويد</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
            <p className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
              <span><strong>استقبال الروابط:</strong> يدعم التطبيق استقبال أي رابط عبر باراميتر الرابط <code className="text-cyan-400 font-mono">?url=YOUR_STREAM_URL</code> أو <code className="text-cyan-400 font-mono">?stream=...</code> بحيث يقوم المشغل بتشغيله فور فتحه من أي تطبيق آخر (مثل متصفح أو مدير ملفات).</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
              <span><strong>صيغ البث المدعومة:</strong> يدعم المشغل بالكامل صيغ HLS (<code className="text-cyan-400 font-mono">.m3u8</code>)، وبثوث النقل الرقمي (<code className="text-cyan-400 font-mono">.ts</code>)، بالإضافة إلى صيغ الفيديو الشهيرة (<code className="text-cyan-400 font-mono">.mp4, .webm, .mkv, .m4v</code>).</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
              <span><strong>تغليف أندرويد (Capacitor / WebView):</strong> يمكنك تحويل هذا التطبيق بسهولة إلى تطبيق APK أصلي عبر Capacitor مع تفعيل <code className="text-cyan-400 font-mono">IntentFilter</code> لفتح روابط البث وملفات M3U مباشرة عبر OmniPlayer.</span>
            </p>
          </div>
        </div>

        {/* Supported Formats Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">الصيغ والبروتوكولات المدعومة</h2>
              <p className="text-xs text-slate-400">قائمة كاملة بالصيغ التي يعالجها المشغل بكفاءة عالية</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { format: '.ts', desc: 'ملفات تدفق النقل' },
              { format: '.m3u8', desc: 'قوائم وبثوث HLS' },
              { format: '.m3u', desc: 'قوائم قنوات IPTV' },
              { format: '.mp4', desc: 'فيديو قياسي' },
              { format: '.m4v / .m4a', desc: 'صيغ الصوت والفيديو' },
              { format: '.webm', desc: 'فيديو الويب الحديث' },
              { format: '.mkv', desc: 'ملفات ماتروشكا' },
              { format: 'HTTP / HTTPS', desc: 'بروتوكولات البث الحي' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <span className="font-mono text-cyan-400 font-bold text-sm block mb-1">{item.format}</span>
                <span className="text-[11px] text-slate-400">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data & Reset */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm mb-1">إعادة تعيين بيانات التطبيق</h3>
            <p className="text-xs text-slate-400">مسح السجل وقوائم التشغيل المخصصة واستعادة الإعدادات الافتراضية.</p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('هل أنت متأكد من رغبتك في إعادة تعيين كافة البيانات؟')) {
                onResetData();
              }
            }}
            className="flex items-center gap-2 bg-slate-800 hover:bg-red-500/20 text-slate-200 hover:text-red-300 border border-slate-700 hover:border-red-500/40 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة تعيين</span>
          </button>
        </div>
      </div>
    </div>
  );
};
