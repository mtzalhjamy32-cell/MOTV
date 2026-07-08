import { MediaItem } from '../types';

export const SAMPLE_STREAMS: MediaItem[] = [
  {
    id: 'sample-1',
    title: 'NASA TV Live (HLS / M3U8)',
    url: 'https://ntv1.akamaized.net/hls/live/2014756/NASA-TV-HD-1/master.m3u8',
    type: 'm3u8',
    category: 'بث مباشر',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&auto=format&fit=crop&q=80',
    groupTitle: 'قنوات فضائية'
  },
  {
    id: 'sample-2',
    title: 'Big Buck Bunny (MP4 فيديو تجريبي)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'mp4',
    category: 'أفلام وترفيه',
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=100&auto=format&fit=crop&q=80',
    groupTitle: 'فيديوهات مسجلة',
    duration: 596
  },
  {
    id: 'sample-3',
    title: 'Tears of Steel (مقطع عالي الدقة MP4)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    type: 'mp4',
    category: 'أفلام وترفيه',
    logo: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&auto=format&fit=crop&q=80',
    groupTitle: 'فيديوهات مسجلة',
    duration: 734
  },
  {
    id: 'sample-4',
    title: 'Sintel Open Movie (MP4 1080p)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    type: 'mp4',
    category: 'أفلام وترفيه',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    groupTitle: 'فيديوهات مسجلة',
    duration: 888
  },
  {
    id: 'sample-5',
    title: 'Elephants Dream (M3U8 / HLS Stream)',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    type: 'm3u8',
    category: 'وثائقي',
    logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&auto=format&fit=crop&q=80',
    groupTitle: 'بث تجريبي'
  }
];

