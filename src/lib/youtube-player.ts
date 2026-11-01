export type YouTubePlayer = {
  getPlaylist(): string[] | undefined;
  cuePlaylist(options: { listType: "playlist"; list: string; index: number }): void;
  pauseVideo(): void;
  destroy(): void;
};

export type YouTubePlayerEvent = { target: YouTubePlayer; data: number };

type YouTubePlayerApi = {
  Player: new (element: HTMLElement, options: {
    events: {
      onReady(event: YouTubePlayerEvent): void;
      onStateChange(event: YouTubePlayerEvent): void;
      onError(event: YouTubePlayerEvent): void;
    };
  }) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubePlayerApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let playerApiPromise: Promise<YouTubePlayerApi> | undefined;

/** The official keyless IFrame Player library, not YouTube Data API. */
export function loadYouTubePlayer(): Promise<YouTubePlayerApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (playerApiPromise) return playerApiPromise;

  playerApiPromise = new Promise<YouTubePlayerApi>((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    const timer = window.setTimeout(() => fail(), 15_000);
    let script = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');

    function fail() {
      window.clearTimeout(timer);
      playerApiPromise = undefined;
      reject(new Error("YouTube pleyer kitabxanası yüklənmədi."));
    }

    window.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timer);
      previousReady?.();
      if (window.YT?.Player) resolve(window.YT);
      else fail();
    };

    if (!script) {
      script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.addEventListener("error", fail, { once: true });
      document.head.appendChild(script);
    }
  });

  return playerApiPromise;
}

/** Accept only real-shaped IDs returned by the official playlist player. */
export function normalizePlaylistVideoIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === "string" && /^[A-Za-z0-9_-]{11}$/.test(id)))];
}

export function isUnavailableVideoError(code: number): boolean {
  // 100: removed/private; 101 and 150: embedding disabled by the owner.
  // Network/identity errors must not remove otherwise valid videos.
  return code === 100 || code === 101 || code === 150;
}
