import React, { useState, useEffect } from 'react';
import { AppTab, MediaItem, PlayHistoryItem } from './types';
import { SAMPLE_STREAMS } from './data/presetStreams';
import { Navbar } from './components/Navbar';
import { VideoPlayer } from './components/VideoPlayer';
import { HistoryView } from './components/HistoryView';
import { AddStreamModal } from './components/AddStreamModal';
import { SettingsView } from './components/SettingsView';
import { detectMediaType } from './utils/m3uParser';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('player');

  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(() => {
    // Check URL parameters for external intent / stream link (?url=... or ?stream=...)
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('url') || params.get('stream');
    const titleParam = params.get('title') || 'بث قناة مباشر';

    if (urlParam) {
      return {
        id: `external-${Date.now()}`,
        title: decodeURIComponent(titleParam),
        url: decodeURIComponent(urlParam),
        type: detectMediaType(urlParam),
        category: 'قناة مباشرة',
        addedAt: Date.now(),
      };
    }
    // Default to first sample stream
    return SAMPLE_STREAMS[0] || null;
  });

  const [history, setHistory] = useState<PlayHistoryItem[]>(() => {
    const saved = localStorage.getItem('omniplayer_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [];
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('omniplayer_history', JSON.stringify(history));
  }, [history]);

  const handlePlayMedia = (item: MediaItem) => {
    setCurrentMedia(item);
    setCurrentTab('player');

    // Add to history
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.url !== item.url);
      const newHistoryItem: PlayHistoryItem = {
        id: item.id || `history-${Date.now()}`,
        title: item.title,
        url: item.url,
        type: item.type,
        logo: item.logo,
        lastPlayed: Date.now(),
        progress: 0,
        duration: item.duration || 0,
      };
      return [newHistoryItem, ...filtered].slice(0, 50); // Keep last 50
    });
  };

  const handleAddToHistoryProgress = (item: MediaItem, progress: number, duration: number) => {
    setHistory((prev) => {
      const existingIndex = prev.findIndex((h) => h.url === item.url);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          progress,
          duration,
          lastPlayed: Date.now(),
        };
        return updated;
      } else {
        const newItem: PlayHistoryItem = {
          id: item.id || `history-${Date.now()}`,
          title: item.title,
          url: item.url,
          type: item.type,
          logo: item.logo,
          lastPlayed: Date.now(),
          progress,
          duration,
        };
        return [newItem, ...prev].slice(0, 50);
      }
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleResetData = () => {
    localStorage.removeItem('omniplayer_history');
    setHistory([]);
    setCurrentMedia(SAMPLE_STREAMS[0]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'player' && (
          <VideoPlayer
            currentMedia={currentMedia}
            playlist={SAMPLE_STREAMS}
            onSelectMedia={handlePlayMedia}
            onAddToHistory={handleAddToHistoryProgress}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            history={history}
            onPlayItem={(item) => handlePlayMedia(item)}
            onClearHistory={handleClearHistory}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView onResetData={handleResetData} />
        )}
      </main>

      {/* Add Stream / Open Link Modal */}
      <AddStreamModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPlayStream={(item) => handlePlayMedia(item)}
      />
    </div>
  );
}

