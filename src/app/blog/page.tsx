import { BlogIndex } from "@/components/blog/BlogIndex";
import { metadataForPage, serializeJsonLd } from "@/lib/seo";
import { blogPreviewJsonLd } from "@/lib/blog-seo";

export const metadata = metadataForPage("/blog", "Faydalı Məsləhətlər və Məişət Texnikası Bloqu | DənizServis", "Paltaryuyan nasazlıqları, təmir qiyməti və usta çağırışı haqqında aydın bələdçilər. DənizServis bloqunun redaksiya önizləməsi.", undefined, true);

export default function BlogPage() { return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogPreviewJsonLd()) }} /><BlogIndex /></>; }
