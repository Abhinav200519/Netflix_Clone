const YOUTUBE_API_KEY = 'ENTER_YOUR_YOUTUBE_API_KEY';
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
}

class YouTubeService {
  async searchTrailer(movieTitle: string): Promise<string | null> {
    try {
      const query = `${movieTitle} official trailer`;
      const response = await fetch(
        `${YOUTUBE_BASE_URL}/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        return data.items[0].id.videoId;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching YouTube trailer:', error);
      return null;
    }
  }

  getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  }
}

export const youtubeService = new YouTubeService();
