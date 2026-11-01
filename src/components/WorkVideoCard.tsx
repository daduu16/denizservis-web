"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function WorkVideoCard({ videoId, title }: { videoId: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [posterUnavailable, setPosterUnavailable] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const wasPlaying = useRef(false);

  useEffect(() => {
    if (isPlaying) iframeRef.current?.focus();
    else if (wasPlaying.current) playRef.current?.focus();
    wasPlaying.current = isPlaying;
  }, [isPlaying]);

  return (
    <article className={`work-video-card${isPlaying ? " is-playing" : ""}`}>
      {isPlaying ? (
        <>
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={0}
          />
          <button type="button" className="work-video-close" aria-label={`${title} — videonu bağla`} onClick={() => setIsPlaying(false)}>
            <X aria-hidden="true" size={20} />
          </button>
        </>
      ) : (
        <button ref={playRef} type="button" className="work-video-preview" aria-label={`${title} — videonu izlə`} onClick={() => setIsPlaying(true)}>
          {!posterUnavailable && <Image
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="work-video-poster"
            onError={() => setPosterUnavailable(true)}
          />}
          <span className="work-video-caption"><span className="work-video-title">{title}</span><span className="work-video-source">YouTube</span></span>
          <span className="work-video-play" aria-hidden="true"><svg viewBox="0 0 68 48"><rect width="68" height="48" rx="13" fill="currentColor" /><path d="M28 14v20l18-10z" fill="white" /></svg></span>
        </button>
      )}
    </article>
  );
}
