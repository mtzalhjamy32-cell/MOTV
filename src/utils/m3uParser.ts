import { MediaItem, MediaType } from '../types';

export function parseM3U(content: string, playlistName: string = 'قائمة تشغيل مخصصة'): MediaItem[] {
  const lines = content.split(/\r?\n/);
  const items: MediaItem[] = [];
  
  let currentTitle = '';
  let currentLogo = '';
  let currentGroup = 'عام';
  let currentDuration = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('#EXTINF:')) {
      // Parse metadata
      const extinf = line.substring(8);
      
      // Extract duration (first part before comma or space)
      const commaIndex = extinf.indexOf(',');
      if (commaIndex !== -1) {
        const infoPart = extinf.substring(0, commaIndex);
        currentTitle = extinf.substring(commaIndex + 1).trim();
        
        // Parse attributes like tvg-logo="..." and group-title="..."
        const logoMatch = infoPart.match(/tvg-logo="([^"]*)"/i) || infoPart.match(/tvg-logo=([^\s]+)/i);
        if (logoMatch) {
          currentLogo = logoMatch[1].replace(/["']/g, '');
        }

        const groupMatch = infoPart.match(/group-title="([^"]*)"/i) || infoPart.match(/group-title=([^\s]+)/i);
        if (groupMatch) {
          currentGroup = groupMatch[1].replace(/["']/g, '');
        }

        const durPart = infoPart.split(' ')[0];
        const parsedDur = parseFloat(durPart);
        if (!isNaN(parsedDur)) {
          currentDuration = parsedDur;
        }
      } else {
        currentTitle = extinf;
      }
    } else if (line.startsWith('#EXTM3U') || line.startsWith('#') || line.startsWith('//')) {
      // Skip other metadata/comments
      continue;
    } else {
      // This is either a URL line or plain stream link
      const url = line;
      if (url && (url.includes('://') || url.startsWith('http') || url.includes('.') || url.length > 5)) {
        
        // Determine type
        let type: MediaType = 'auto';
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes('.m3u8') || lowerUrl.includes('playlist.m3u8') || lowerUrl.includes('/live/') || lowerUrl.includes('/hls/')) {
          type = 'm3u8';
        } else if (lowerUrl.includes('.ts') || lowerUrl.includes('ts?')) {
          type = 'ts';
        } else if (lowerUrl.includes('.mp4')) {
          type = 'mp4';
        } else if (lowerUrl.includes('.m4v') || lowerUrl.includes('.m4a')) {
          type = 'm4v';
        } else if (lowerUrl.includes('.webm')) {
          type = 'webm';
        } else if (lowerUrl.includes('.mkv')) {
          type = 'mkv';
        } else {
          type = 'm3u8'; // Default stream type for IPTV / M3U
        }

        items.push({
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          title: currentTitle || `قناة أو بث ${items.length + 1}`,
          url,
          type,
          category: currentGroup,
          logo: currentLogo || undefined,
          groupTitle: currentGroup,
          duration: currentDuration > 0 ? currentDuration : undefined,
          addedAt: Date.now(),
        });
      }

      // Reset for next
      currentTitle = '';
      currentLogo = '';
      currentGroup = 'عام';
      currentDuration = -1;
    }
  }

  // If no items were parsed using standard #EXTINF, try parsing every non-empty line as a direct stream URL
  if (items.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;
      
      let type: MediaType = 'm3u8';
      const lower = line.toLowerCase();
      if (lower.includes('.mp4')) type = 'mp4';
      else if (lower.includes('.ts')) type = 'ts';
      else if (lower.includes('.mkv')) type = 'mkv';

      items.push({
        id: `item-fallback-${Date.now()}-${i}`,
        title: `رابط بث ${items.length + 1}`,
        url: line,
        type,
        category: 'قوائم مخصصة',
        addedAt: Date.now(),
      });
    }
  }

  return items;
}

export function detectMediaType(url: string): MediaType {
  const lower = url.toLowerCase();
  if (lower.includes('.m3u8') || lower.includes('/live/') || lower.includes('/hls/')) return 'm3u8';
  if (lower.includes('.ts') || lower.includes('ts?')) return 'ts';
  if (lower.includes('.mp4')) return 'mp4';
  if (lower.includes('.m4v') || lower.includes('.m4a')) return 'm4v';
  if (lower.includes('.webm')) return 'webm';
  if (lower.includes('.mkv')) return 'mkv';
  return 'm3u8';
}

