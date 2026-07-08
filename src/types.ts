export type MediaType = 'mp4' | 'm3u8' | 'ts' | 'm4v' | 'webm' | 'mkv' | 'auto';

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: MediaType;
  category?: string;
  logo?: string;
  groupTitle?: string;
  duration?: number;
  addedAt?: number;
  isFavorite?: boolean;
}

export interface PlayHistoryItem {
  id: string;
  title: string;
  url: string;
  type: MediaType;
  logo?: string;
  lastPlayed: number;
  progress: number;
  duration: number;
}

export type AppTab = 'player' | 'history' | 'settings';

