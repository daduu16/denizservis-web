"use client";

import { T, useLanguage } from "@/components/LanguageProvider";

import { useCallback, useEffect, useRef, useState } from "react";
import { youtubePlaylist } from "@/config/youtube";
import { isUnavailableVideoError, loadYouTubePlayer, normalizePlaylistVideoIds, type YouTubePlayer } from "@/lib/youtube-player";

type PlayerCardProps = {
  videoId?: string;
  index?: number;
  onPlaylist?: (ids: string[]) => void;
  onFallback?: () => void;
  onUnavailable?: (id: string) => void;
  onPlaying?: (player: YouTubePlayer) => void;
  onRegister?: (player: YouTubePlayer, present: boolean) => void;
};

function PlayerCard({ videoId, index = 0, onPlaylist, onFallback, onUnavailable, onPlaying, onRegister }: PlayerCardProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const localeRef = useRef({ t, language });

  useEffect(() => {
    localeRef.current = { t, language };
    const iframe = hostRef.current?.querySelector("iframe");
    if (iframe) iframe.title = videoId ? `${t("DənizServis — görülən iş")} ${index + 1}` : t(youtubePlaylist.title);
  }, [t, language, videoId, index]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let initialized = false;
    let player: YouTubePlayer | undefined;
    let poll: number | undefined;
    let timeout: number | undefined;
    let queueFound = false;

    const readQueue = (target: YouTubePlayer) => {
      if (disposed || videoId || queueFound) return;
      const ids = normalizePlaylistVideoIds(target.getPlaylist());
      if (ids.length) {
        queueFound = true;
        window.clearInterval(poll);
        window.clearTimeout(timeout);
        onPlaylist?.(ids);
      }
    };

    const initialize = async () => {
      if (initialized || disposed) return;
      initialized = true;
      const iframe = document.createElement("iframe");
      const url = new URL(videoId ? `https://www.youtube.com/embed/${videoId}` : youtubePlaylist.embedUrl);
      url.searchParams.set("enablejsapi", "1");
      url.searchParams.set("origin", window.location.origin);
      url.searchParams.set("playsinline", "1");
      url.searchParams.set("autoplay", "0");
      url.searchParams.set("rel", "0");
      url.searchParams.set("hl", localeRef.current.language);
      iframe.src = url.toString();
      iframe.title = videoId ? `${localeRef.current.t("DənizServis — görülən iş")} ${index + 1}` : localeRef.current.t(youtubePlaylist.title);
      iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      host.appendChild(iframe);
      if (!videoId) {
        timeout = window.setTimeout(() => {
          window.clearInterval(poll);
          if (!disposed && !queueFound) onFallback?.();
        }, 20_000);
      }

      try {
        const api = await loadYouTubePlayer();
        if (disposed) return;
        player = new api.Player(iframe, {
          events: {
            onReady: ({ target }) => {
              if (disposed) return;
              onRegister?.(target, true);
              if (!videoId) {
                window.clearTimeout(timeout);
                readQueue(target);
                if (!queueFound) target.cuePlaylist({ listType: "playlist", list: youtubePlaylist.id, index: 0 });
                if (!queueFound) {
                  poll = window.setInterval(() => readQueue(target), 400);
                  timeout = window.setTimeout(() => {
                    window.clearInterval(poll);
                    if (!disposed && !queueFound) onFallback?.();
                  }, 12_000);
                }
              }
            },
            onStateChange: ({ target, data }) => {
              if (disposed) return;
              readQueue(target);
              if (data === 1) onPlaying?.(target);
            },
            onError: ({ target, data }) => {
              if (disposed) return;
              if (videoId && isUnavailableVideoError(data)) onUnavailable?.(videoId);
              else if (!videoId) {
                readQueue(target);
                if (!queueFound) onFallback?.();
              }
            },
          },
        });
      } catch {
        // The native iframe still works if the optional player script is blocked.
        window.clearTimeout(timeout);
        if (!disposed) onFallback?.();
      }
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        void initialize();
      }
    }, { rootMargin: "100px" });
    observer.observe(host);

    return () => {
      disposed = true;
      observer.disconnect();
      window.clearInterval(poll);
      window.clearTimeout(timeout);
      if (player) {
        onRegister?.(player, false);
        player.destroy();
      }
      host.replaceChildren();
    };
  }, [videoId, index, onPlaylist, onFallback, onUnavailable, onPlaying, onRegister]);

  return (
    <article className="work-video-card" data-video-id={videoId}>
      <div ref={hostRef} className="work-video-player-host" />
    </article>
  );
}

export function YouTubePlaylistGrid() {
  const [ids, setIds] = useState<string[]>([]);
  const [unavailableIds, setUnavailableIds] = useState<string[]>([]);
  const [fallback, setFallback] = useState(false);
  const players = useRef(new Set<YouTubePlayer>());

  const handlePlaylist = useCallback((nextIds: string[]) => {
    setIds(nextIds);
    setFallback(false);
  }, []);
  const handleFallback = useCallback(() => setFallback(true), []);
  const handleUnavailable = useCallback((id: string) => {
    setUnavailableIds((previous) => previous.includes(id) ? previous : [...previous, id]);
  }, []);
  const handleRegister = useCallback((player: YouTubePlayer, present: boolean) => {
    if (present) players.current.add(player);
    else players.current.delete(player);
  }, []);
  const handlePlaying = useCallback((active: YouTubePlayer) => {
    for (const player of players.current) if (player !== active) player.pauseVideo();
  }, []);

  const visibleIds = ids.filter((id) => !unavailableIds.includes(id)).slice(0, youtubePlaylist.previewLimit);

  return (
    <>
      <div className="works-grid" data-playlist-loaded={ids.length > 0}>
        {ids.length ? visibleIds.map((id, index) => (
          <PlayerCard key={id} videoId={id} index={index} onUnavailable={handleUnavailable} onPlaying={handlePlaying} onRegister={handleRegister} />
        )) : (
          <>
            <PlayerCard onPlaylist={handlePlaylist} onFallback={handleFallback} />
            {!fallback && Array.from({ length: youtubePlaylist.previewLimit - 1 }, (_, index) => (
              <div className="work-video-card work-video-card--loading" aria-hidden="true" key={index}><span className="work-video-loading-mark" /></div>
            ))}
          </>
        )}
      </div>
      {(fallback || (ids.length > 0 && visibleIds.length === 0)) && <p className="works-player-note"><T>Digər videoları YouTube playlistində izləyə bilərsiniz.</T></p>}
    </>
  );
}
