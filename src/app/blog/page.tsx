import { BlogIndex } from "@/components/blog/BlogIndex";
import { metadataForPage, serializeJsonLd } from "@/lib/seo";
import { blogPreviewJsonLd } from "@/lib/blog-seo";

export const metadata = metadataForPage("/blog", "Qabyuyan Xəta Kodları və Faydalı Məsləhətlər | DənizServis", "Qabyuyan xəta kodları, su boşaltma problemləri və paltaryuyan təmiri haqqında aydın bələdçilər. Cihazınıza qulluq və təhlükəsiz növbəti addımlar.", "/images/blog-dishwasher-editorial.webp");

export default function BlogPage() { return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogPreviewJsonLd()) }} /><BlogIndex /></>; }
