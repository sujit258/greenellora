export type VideoItem = {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: string;
  thumbnail: string;
};

export function extractYoutubeId(value: string): string {
  if (!value) return "";

  const trimmed = value.trim();

  if (/^[\w-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const patterns = [
    /[?&]v=([^&]+)/,
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtube\.com\/shorts\/([^?&/]+)/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return trimmed;
}

export function getYoutubeThumbnail(youtubeId: string): string {
  const id = extractYoutubeId(youtubeId);
  if (!id) return "";
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function normalizeVideo(raw: Record<string, unknown>): VideoItem {
  const youtubeId = extractYoutubeId(String(raw.youtubeId ?? ""));
  const thumbnailInput = String(raw.thumbnail ?? "").trim();

  return {
    id: String(raw.id ?? raw._id ?? ""),
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    youtubeId,
    category: String(raw.category ?? ""),
    thumbnail: thumbnailInput || getYoutubeThumbnail(youtubeId),
  };
}

export function normalizeVideos(rawVideos: unknown[]): VideoItem[] {
  return rawVideos
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map(normalizeVideo)
    .filter((video) => video.youtubeId && video.title);
}
