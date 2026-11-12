"use client";

import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { useRef, useState } from "react";
import { T } from "@/components/LanguageProvider";
import { LocalizedGroup, LocalizedNav } from "@/components/LocalizedElements";
import { paginateBlog } from "@/lib/blog-pagination";
import { blogCategories, blogPosts, type BlogCategory } from "@/data/blog";
import { siteConfig, whatsappHref } from "@/config/site";
import { BlogCard } from "./BlogCard";
import styles from "./Blog.module.css";

export function BlogIndex() {
  const [category, setCategory] = useState<BlogCategory | "Hamısı">("Hamısı");
  const [page, setPage] = useState(1);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const visible = blogPosts.filter(post => category === "Hamısı" || post.category === category);
  const pagination = paginateBlog(visible, page);
  const changePage = (next: number) => {
    setPage(paginateBlog(visible, next).page);
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    });
  };
  return <div className={styles.blog}>
    <div className={`container ${styles.wrap}`}>
      <header className={styles.hero}>
        <div>
          <h1><T>Texnikanı anlayın.</T><br /><span><T>Daha rahat qərar verin.</T></span></h1>
          <p className={styles.lead}><T>Gündəlik suallara aydın cavablar. Cihazınıza qulluqdan usta çağırışına qədər, lazım olan məlumat bir yerdə.</T></p>
        </div>
      </header>

      <section aria-labelledby="articles-title" className={styles.library}>
        <div className={styles.libraryHeader}><h2 id="articles-title" ref={headingRef} tabIndex={-1}><T>Faydalı oxu</T></h2></div>
        <LocalizedGroup className={styles.filters} role="group" aria-label="Mövzu filtrləri">
          {(["Hamısı", ...blogCategories] as const).map(item => <button key={item} type="button" onClick={() => { setCategory(item); setPage(1); }} aria-pressed={category === item} className={category === item ? styles.filterActive : ""}><T>{item}</T><span>{item === "Hamısı" ? blogPosts.length : blogPosts.filter(p => p.category === item).length}</span></button>)}
        </LocalizedGroup>
        <p className={styles.srOnly} role="status" aria-live="polite"><T>Səhifə</T> {pagination.page} / {pagination.pageCount}. {pagination.items.length} <T>məqalə göstərilir</T></p>
        <div id="blog-feed" className={`${styles.feed} ${category !== "Hamısı" ? styles.filteredFeed : ""}`}>
          {pagination.items.map((post, i) => <BlogCard key={post.slug} post={post} featured={category === "Hamısı" && i === 0} />)}
        </div>
        {pagination.pageCount > 1 && <LocalizedNav className={styles.pagination} aria-label="Məqalə səhifələri">
          <div className={styles.pageControls}>
            <button className={styles.pageArrow} type="button" disabled={pagination.page === 1} onClick={() => changePage(pagination.page - 1)} aria-controls="blog-feed"><ArrowLeft size={18} aria-hidden="true" /><span className={styles.srOnly}><T>Əvvəlki</T></span></button>
            <div className={styles.pageNumbers}>{Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map(number => <button type="button" key={number} aria-current={pagination.page === number ? "page" : undefined} aria-controls="blog-feed" onClick={() => changePage(number)}><span className={styles.srOnly}><T>Səhifə</T> </span>{number}</button>)}</div>
            <button className={styles.pageArrow} type="button" disabled={pagination.page === pagination.pageCount} onClick={() => changePage(pagination.page + 1)} aria-controls="blog-feed"><span className={styles.srOnly}><T>Növbəti</T></span><ArrowRight size={18} aria-hidden="true" /></button>
          </div>
        </LocalizedNav>}
      </section>

      <section className={styles.contactBand} aria-labelledby="blog-contact-title">
        <div className={styles.contactSymbol}><MessageCircle size={29} aria-hidden="true" /></div>
        <div><p className={styles.eyebrow}><T>Oxumaqdan həllə</T></p><h2 id="blog-contact-title"><T>Sizin cihazda nə baş verir?</T></h2><p><T>Markanı və gördüyünüz əlaməti yazın, növbəti addımı birlikdə dəqiqləşdirək.</T></p></div>
        <a className={styles.lightButton} href={whatsappHref(siteConfig.whatsapp) ?? "/elaqe"} target="_blank" rel="noopener noreferrer"><T>WhatsApp-da yazaq</T><ArrowRight size={18} aria-hidden="true" /></a>
      </section>
    </div>
  </div>;
}
