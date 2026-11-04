import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { T } from "@/components/LanguageProvider";
import { LocalizedImage } from "@/components/LocalizedElements";
import { blogPath, readingMinutes, type BlogPost } from "@/data/blog";
import styles from "./Blog.module.css";

export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return <Link href={blogPath(post)} className={`${styles.card} ${featured ? styles.featured : ""}`}>
    <div className={styles.cardVisual}>
      {featured && <span className={styles.visualLabel}><span /><T>Önə çıxan məqalə</T></span>}
      <LocalizedImage src={post.image} alt={post.alt} fill sizes={featured ? "(min-width: 900px) 700px, 92vw" : "(min-width: 900px) 160px, (min-width: 600px) 30vw, 92vw"} className={styles.cardImage} priority={featured} />
      <span className={styles.visualNumber} aria-hidden="true">{featured ? "01" : post.category === "Qiymət" ? "02" : "03"}</span>
    </div>
    <div className={styles.cardCopy}>
      <div className={styles.cardMeta}><span className={styles.tag}><T>{post.category}</T></span><span><Clock3 size={13} aria-hidden="true" />{readingMinutes(post)} <T>dəq. oxu</T></span></div>
      <h2><T>{post.title}</T></h2>
      <p><T>{post.excerpt}</T></p>
      <div className={styles.cardBottom}><span><T>Məqaləni oxu</T></span><ArrowUpRight aria-hidden="true" size={21} /></div>
    </div>
  </Link>;
}
