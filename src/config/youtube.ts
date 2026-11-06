// The channel's public, YouTube-generated Shorts playlist is newest first.
// Verified against @denizservis1/shorts; resolved by the player at runtime, not build time.
// No API key, scraping proxy, or manually maintained video IDs are needed.
const shortsPlaylistId = "UUSHVsiP_P9SZohnAEy6vtdzyg";
export const youtubePlaylist = {
  id: shortsPlaylistId,
  previewLimit: 4,
  title: "Gördüyümüz İşlər | DənizServis",
  url: `https://www.youtube.com/playlist?list=${shortsPlaylistId}`,
  embedUrl: `https://www.youtube.com/embed?listType=playlist&list=${shortsPlaylistId}&playsinline=1&autoplay=0&rel=0`,
} as const;
