import { LocalizedAnchor } from "./LocalizedElements";
import { T } from "@/components/LanguageProvider";
import { ArrowUpRight } from "lucide-react";
import { youtubePlaylist } from "@/config/youtube";
import { YouTubePlaylistGrid } from "./YouTubePlaylistGrid";

export function Works() {
  return (
    <section className="works-section" id="islerimiz" aria-labelledby="works-title">
      <div className="container">
        <h2 id="works-title" className="works-heading"><T>İşlərimiz</T></h2>
        <YouTubePlaylistGrid />
        <div className="works-playlist-actions">
          <LocalizedAnchor className="button" href={youtubePlaylist.url} target="_blank" rel="noopener noreferrer" aria-label="Daha çox göstər — YouTube playlisti yeni pəncərədə açılır"><T>
            Daha çox göstər </T><ArrowUpRight aria-hidden="true" size={19} />
          </LocalizedAnchor>
        </div>
      </div>
    </section>
  );
}
