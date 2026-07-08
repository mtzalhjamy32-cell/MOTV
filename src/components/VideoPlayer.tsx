import React, { useEffect, useRef, useState } from 'react';
import { MediaItem } from '../types';
import { detectMediaType } from '../utils/m3uParser';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Settings as SettingsIcon,
  Radio,
  Share2,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  ListVideo,
  Smartphone,
  ExternalLink,
  Link
} from 'lucide-react';

interface VideoPlayerProps {
  currentMedia: MediaItem | null;
  playlist?: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
  onAddToHistory: (item: MediaItem, progress: number, duration: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentMedia,
  playlist = [],
  onSelectMedia,
  onAddToHistory,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState<'contain' | 'cover' | 'fill'>('contain');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [showAspectMenu, setShowAspectMenu] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showPlaylistDrawer, setShowPlaylistDrawer] = useState<boolean>(false);
  const [quickUrl, setQuickUrl] = useState<string>('');

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and load video stream when currentMedia changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentMedia) return;

    setErrorState(null);
    setIsLoading(true);

    const videoUrl = currentMedia.url;
    const isHls = currentMedia.type === 'm3u8' || videoUrl.includes('.m3u8');
    const isTs = currentMedia.type === 'ts' || videoUrl.endsWith('.ts') || videoUrl.includes('.ts?');

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (isHls || isTs) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          enableWorker: true,
        });
        hlsRef.current = hls;
        hls.loadSource(videoUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          video.play().then(() => setIsPlaying(true)).catch((e) => {
            console.log('Autoplay blocked:', e);
            setIsPlaying(false);
          });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.warn('HLS error:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Fatal network error encountered, trying to recover...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Fatal media error encountered, trying to recover...');
                hls.recoverMediaError();
                break;
              default:
                setErrorState('تعذر تشغيل البث المباشر أو الرابط. قد يكون الرابط منتهي الصلاحية أو محظور (CORS).');
                setIsLoading(false);
                hls.destroy();
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native Safari HLS support
        video.src = videoUrl;
        video.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        });
      } else {
        setErrorState('متصفحك لا يدعم تشغيل هذا النوع من البث المباشر (HLS/TS).');
        setIsLoading(false);
      }
    } else {
      // Standard video format (MP4, WebM, etc.)
      video.src = videoUrl;
      video.load();
      video.onloadedmetadata = () => {
        setIsLoading(false);
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      };
      video.onerror = () => {
        setErrorState('حدث خطأ أثناء تحميل ملف الفيديو. تأكد من صحة الرابط.');
        setIsLoading(false);
      };
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentMedia]);

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
      if (currentMedia && videoRef.current.currentTime > 0 && Math.floor(videoRef.current.currentTime) % 10 === 0) {
        onAddToHistory(currentMedia, videoRef.current.currentTime, videoRef.current.duration || 0);
      }
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), duration || video.currentTime + seconds);
  };

  const toggleFullscreen = () => {
    const container = playerContainerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSpeedMenu(false);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSpeedMenu(false);
        setShowAspectMenu(false);
      }
    }, 3500);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return '00:00';
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = Math.floor(secs % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
    }
    return `${mins < 10 ? '0' : ''}${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const copyUrl = () => {
    if (currentMedia) {
      navigator.clipboard.writeText(currentMedia.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!currentMedia) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 text-center mx-4 my-6">
        <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 animate-pulse">
          <Radio className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-2">لا يوجد فيديو أو بث قيد التشغيل حالياً</h2>
        <p className="text-slate-400 max-w-md mb-6">
          اختر قناة أو فيديو من قوائم التشغيل أو اضغط على زر "إضافة رابط أو بث" لتشغيل أي رابط فيديو أو بث (MP4, M3U8, TS).
        </p>
      </div>
    );
  }

  const isLiveStream = currentMedia.type === 'm3u8' || currentMedia.url.includes('.m3u8') || duration === 0 || isNaN(duration) || !isFinite(duration);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      {/* Quick Direct Link Input Bar (Immediate play when entering channel link) */}
      <form onSubmit={(e) => {
        e.preventDefault();
        if (quickUrl.trim()) {
          onSelectMedia({
            id: `direct-${Date.now()}`,
            title: `رابط قناة مباشر (${detectMediaType(quickUrl).toUpperCase()})`,
            url: quickUrl.trim(),
            type: detectMediaType(quickUrl),
            category: 'بث مباشر',
            addedAt: Date.now(),
          });
          setQuickUrl('');
        }
      }} className="flex items-center gap-2 mb-4 bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-lg">
        <div className="flex-1 flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
          <Link className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="url"
            placeholder="الصق رابط القناة أو البث مباشرة هنا (.ts, .m3u8, .mp4) واضغط تشغيل فوري..."
            value={quickUrl}
            onChange={(e) => setQuickUrl(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>تشغيل فوري</span>
        </button>
      </form>

      {/* Top Banner / Current Stream Header */}
      <div className="flex items-center justify-between mb-4 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            {isLiveStream ? <Radio className="w-5 h-5 animate-pulse text-red-400" /> : <Play className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-base sm:text-lg line-clamp-1">{currentMedia.title}</h1>
              {isLiveStream && (
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/40 font-mono uppercase tracking-wider">
                  بث مباشر / LIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>الصيغة: <strong className="uppercase text-cyan-400">{currentMedia.type}</strong></span>
              {currentMedia.category && <span>• التصنيف: {currentMedia.category}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyUrl}
            title="نسخ رابط البث"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
          </button>
          
          {playlist.length > 0 && (
            <button
              onClick={() => setShowPlaylistDrawer(!showPlaylistDrawer)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border border-slate-700"
            >
              <ListVideo className="w-4 h-4" />
              <span>القائمة ({playlist.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Video Player Container */}
      <div
        ref={playerContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 aspect-video flex items-center justify-center group"
      >
        <video
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
          className={`w-full h-full object-${aspectRatio} cursor-pointer`}
          playsInline
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white pointer-events-none z-20">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-300">جاري الاتصال بالبث والتحميل...</p>
          </div>
        )}

        {/* Error Overlay */}
        {errorState && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center p-6 z-30">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">تعذر التشغيل</h3>
            <p className="text-sm text-slate-400 max-w-md mb-6">{errorState}</p>
            <button
              onClick={() => {
                if (currentMedia) {
                  onSelectMedia({ ...currentMedia });
                }
              }}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Custom On-Screen Video Controls Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4 transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top overlay controls in fullscreen / hover */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>{currentMedia.title}</span>
            </div>
          </div>

          {/* Center Play/Pause big button on pause */}
          {!isPlaying && !isLoading && !errorState && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-2xl transition-transform transform hover:scale-110 pointer-events-auto"
              >
                <Play className="w-8 h-8 fill-current ml-1" />
              </button>
            </div>
          )}

          {/* Seekbar (for non-live or seekable streams) */}
          {!isLiveStream && duration > 0 && (
            <div className="mb-3 flex items-center gap-3">
              <span className="text-xs font-mono text-slate-300 w-12 text-left">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:h-2 transition-all"
              />
              <span className="text-xs font-mono text-slate-400 w-12 text-right">{formatTime(duration)}</span>
            </div>
          )}

          {/* Bottom Control Bar */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-slate-950 flex items-center justify-center transition-all"
                title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              {!isLiveStream && (
                <>
                  <button
                    onClick={() => skipTime(-10)}
                    className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-all hidden sm:flex items-center gap-1 text-xs"
                    title="رجوع 10 ثواني"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>-10ث</span>
                  </button>
                  <button
                    onClick={() => skipTime(10)}
                    className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-all hidden sm:flex items-center gap-1 text-xs"
                    title="تقدم 10 ثواني"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>+10ث</span>
                  </button>
                </>
              )}

              {/* Volume */}
              <div className="flex items-center gap-2 group/vol">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-all"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {isLiveStream && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>بث حي مباشر</span>
                </div>
              )}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
              
              {/* Playback Speed Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSpeedMenu(!showSpeedMenu);
                    setShowAspectMenu(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono font-bold transition-all"
                >
                  {playbackRate}x
                </button>
                {showSpeedMenu && (
                  <div className="absolute bottom-full mb-2 right-0 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-40 py-1 min-w-[100px]">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changeSpeed(rate)}
                        className={`w-full text-right px-4 py-1.5 text-xs font-mono hover:bg-cyan-500 hover:text-slate-950 transition-all ${
                          playbackRate === rate ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-200'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Aspect Ratio Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowAspectMenu(!showAspectMenu);
                    setShowSpeedMenu(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs transition-all uppercase font-mono"
                  title="تغيير مقاس العرض"
                >
                  {aspectRatio === 'contain' ? 'احتواء' : aspectRatio === 'cover' ? 'تغطية' : 'ملء'}
                </button>
                {showAspectMenu && (
                  <div className="absolute bottom-full mb-2 right-0 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-40 py-1 min-w-[110px]">
                    {(['contain', 'cover', 'fill'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          setAspectRatio(mode);
                          setShowAspectMenu(false);
                        }}
                        className={`w-full text-right px-4 py-1.5 text-xs hover:bg-cyan-500 hover:text-slate-950 transition-all ${
                          aspectRatio === mode ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-200'
                        }`}
                      >
                        {mode === 'contain' ? 'احتواء (Contain)' : mode === 'cover' ? 'تغطية (Cover)' : 'ملء الشاشة (Fill)'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-all"
                title="ملء الشاشة"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Drawer (if toggled) */}
      {showPlaylistDrawer && playlist.length > 0 && (
        <div className="mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ListVideo className="w-4 h-4 text-cyan-400" />
              <span>قائمة التشغيل الحالية ({playlist.length})</span>
            </h3>
            <button
              onClick={() => setShowPlaylistDrawer(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              إغلاق
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
            {playlist.map((item) => {
              const isSelected = currentMedia.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectMedia(item)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl text-right transition-all border ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    {isSelected ? <Play className="w-4 h-4 text-cyan-400 fill-current" /> : <Radio className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs truncate font-medium">{item.title}</p>
                    <p className="text-[10px] text-slate-400 uppercase">{item.type}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
