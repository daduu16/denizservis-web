import Link from "next/link";
import { ArrowRight, ArrowUpRight, Info, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { LocalizedImage, LocalizedNav } from "@/components/LocalizedElements";
import { T } from "@/components/LanguageProvider";
import { blogPath, blogPosts, readingMinutes, type BlogPost } from "@/data/blog";
import { normalizePhone, siteConfig, whatsappHref } from "@/config/site";
import styles from "./Blog.module.css";

export function BlogArticle({ post }: { post: BlogPost }) {
  const related = blogPosts.filter(item => item.slug !== post.slug).slice(0, 2);
  const sources = post.sources ?? (post.source ? [post.source] : []);
  const serviceTitle = post.appliance === "Qabyuyan" ? "Qabyuyan təmiri" : "Paltaryuyan təmiri";
  const servicePath = post.appliance === "Qabyuyan" ? "/xidmetler/qabyuyan-temiri" : "/xidmetler/paltaryuyan-temiri";
  return <div className={styles.blog}>
    <div className={`container ${styles.articleWrap}`}>
      <header className={styles.articleHeader}>
        <h1><T>{post.title}</T></h1><p><T>{post.excerpt}</T></p>
      </header>
      <div className={styles.articleLayout}>
        <article className={styles.articleBody}>
          <div className={`${styles.articleVisual} ${post.imageKind === "editorial" ? styles.editorialVisual : ""}`}><LocalizedImage src={post.image} alt={post.alt} fill sizes="(min-width: 1024px) 800px, 92vw" priority /></div>
          <p className={styles.articleIntro}><T>{post.intro}</T></p>
          <details className={styles.mobileContents}><summary><T>Bu məqalədə</T></summary><ol>{post.sections.map(section => <li key={section.id}><a href={`#${section.id}`}><T>{section.title}</T></a></li>)}</ol></details>
          {post.sections.map((section, index) => <section id={section.id} key={section.id} className={styles.articleSection}>
            <span className={styles.sectionNumber}>{String(index + 1).padStart(2, "0")}</span><h2><T>{section.title}</T></h2><p><T>{section.text}</T></p>
            {section.points && <ul>{section.points.map(point => <li key={point}><T>{point}</T></li>)}</ul>}
            {section.codes && <dl className={styles.codeList}>{section.codes.map(item => <div key={item.code}>
              <dt><code>{item.code}</code></dt><dd><p><T>{item.meaning}</T></p><div><span><T>Növbəti addım</T></span><p><T>{item.action}</T></p></div></dd>
            </div>)}</dl>}
          </section>)}
          <aside className={styles.safetyNote}><ShieldCheck size={22} aria-hidden="true" /><div><h2><T>Yadda saxlayaq</T></h2><p><T>{post.note}</T></p></div></aside>
          {sources.map(source => <div key={source.url} className={styles.source}><Info size={17} aria-hidden="true" /><div><span><T>Əlavə oxu · Rəsmi mənbə</T></span><a href={source.url} target="_blank" rel="noopener noreferrer"><T>{source.label}</T><ArrowUpRight size={15} aria-hidden="true" /></a></div></div>)}
          <div className={styles.serviceLink}><span><T>Xidmət haqqında ətraflı</T></span><Link href={servicePath}><T>{serviceTitle}</T><ArrowRight size={18} aria-hidden="true" /></Link></div>
        </article>
        <aside className={styles.articleSidebar}>
          <LocalizedNav className={styles.contents} aria-label="Məqalənin bölmələri"><p className={styles.eyebrow}><T>Bu məqalədə</T></p><ol>{post.sections.map((section, i) => <li key={section.id}><a href={`#${section.id}`}><span>{String(i + 1).padStart(2, "0")}</span><T>{section.title}</T></a></li>)}</ol></LocalizedNav>
          <div className={styles.helpCard}><MessageCircle size={28} aria-hidden="true" /><h2><T>Birlikdə dəqiqləşdirək.</T></h2><p><T>Cihazınızın markasını və əlamətini bizə yazın.</T></p><a href={whatsappHref(siteConfig.whatsapp) ?? "/elaqe"} target="_blank" rel="noopener noreferrer" className={styles.lightButton}><T>WhatsApp-da yazın</T><ArrowUpRight size={18} aria-hidden="true" /></a><a className={styles.sidebarPhone} href={`tel:${normalizePhone(siteConfig.phone)}`}><Phone size={15} aria-hidden="true" />{siteConfig.phone}</a></div>
        </aside>
      </div>
      <section className={styles.related} aria-labelledby="related-title"><div className={styles.relatedHeading}><h2 id="related-title"><T>Oxumağa davam edin</T></h2><Link href="/blog"><T>Bütün məqalələr</T><ArrowRight size={17} aria-hidden="true" /></Link></div><div className={styles.relatedGrid}>{related.map(item => <Link key={item.slug} href={blogPath(item)}><span className={styles.tag}><T>{item.category}</T></span><h3><T>{item.title}</T></h3><span className={styles.relatedBottom}>{readingMinutes(item)} <T>dəq. oxu</T><ArrowUpRight aria-hidden="true" size={21} /></span></Link>)}</div></section>
    </div>
  </div>;
}
