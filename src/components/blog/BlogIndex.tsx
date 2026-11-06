"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { useState } from "react";
import { T } from "@/components/LanguageProvider";
import { LocalizedGroup } from "@/components/LocalizedElements";
import { blogCategories, blogPosts, type BlogCategory } from "@/data/blog";
import { siteConfig, whatsappHref } from "@/config/site";
import { BlogCard } from "./BlogCard";
import styles from "./Blog.module.css";

export function BlogIndex() {
  const [category, setCategory] = useState<BlogCategory | "Hamısı">("Hamısı");
  const visible = blogPosts.filter(post => category === "Hamısı" || post.category === category);
  return <div className={styles.blog}>
    <div className={`container ${styles.wrap}`}>
      <header className={styles.hero}>
        <div>
          <h1><T>Texnikanı anlayın.</T><br /><span><T>Daha rahat qərar verin.</T></span></h1>
          <p className={styles.lead}><T>Gündəlik suallara aydın cavablar. Cihazınıza qulluqdan usta çağırışına qədər, lazım olan məlumat bir yerdə.</T></p>
        </div>
      </header>

      <section aria-labelledby="articles-title" className={styles.library}>
        <div className={styles.libraryHeader}><h2 id="articles-title"><T>Faydalı oxu</T></h2></div>
        <LocalizedGroup className={styles.filters} role="group" aria-label="Mövzu filtrləri">
          {(["Hamısı", ...blogCategories] as const).map(item => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={category === item ? styles.filterActive : ""}><T>{item}</T><span>{item === "Hamısı" ? blogPosts.length : blogPosts.filter(p => p.category === item).length}</span></button>)}
        </LocalizedGroup>
        <p className={styles.srOnly} role="status" aria-live="polite">{visible.length} <T>məqalə göstərilir</T></p>
        <div className={`${styles.feed} ${category !== "Hamısı" ? styles.filteredFeed : ""}`}>
          {visible.map((post, i) => <BlogCard key={post.slug} post={post} featured={category === "Hamısı" && i === 0} />)}
        </div>
      </section>

      <section className={styles.contactBand} aria-labelledby="blog-contact-title">
        <div className={styles.contactSymbol}><MessageCircle size={29} aria-hidden="true" /></div>
        <div><p className={styles.eyebrow}><T>Oxumaqdan həllə</T></p><h2 id="blog-contact-title"><T>Sizin cihazda nə baş verir?</T></h2><p><T>Markanı və gördüyünüz əlaməti yazın, növbəti addımı birlikdə dəqiqləşdirək.</T></p></div>
        <a className={styles.lightButton} href={whatsappHref(siteConfig.whatsapp) ?? "/elaqe"} target="_blank" rel="noopener noreferrer"><T>WhatsApp-da yazaq</T><ArrowRight size={18} aria-hidden="true" /></a>
      </section>
    </div>
  </div>;
}
