import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { blogPost, blogPosts, blogPath } from "@/data/blog";
import { metadataForPage, serializeJsonLd } from "@/lib/seo";
import { blogPreviewJsonLd } from "@/lib/blog-seo";

export const dynamicParams = false;
export function generateStaticParams() { return blogPosts.map(post => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const post = blogPost((await params).slug);
  if (!post) return {};
  return metadataForPage(blogPath(post), `${post.title} | DənizServis`, post.excerpt, post.image, true);
}
export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const post = blogPost((await params).slug);
  if (!post) notFound();
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogPreviewJsonLd(post)) }} /><BlogArticle post={post} /></>;
}
