import { LocalizedGroup } from "./LocalizedElements";
import { T } from "@/components/LanguageProvider";
import { LocalizedImage as Image } from "./LocalizedElements";
import { brandRows } from "../data/brands";
import styles from "./BrandMarquee.module.css";

type Brand = { readonly name: string; readonly slug: string };

export function BrandMarquee({ rows = brandRows, title = "Biz təmir edirik", description }: { rows?: readonly (readonly Brand[])[]; title?: string; description?: string }) {
  return (
    <section className={styles.section} aria-labelledby="brands-title">
      <div className="container">
        <h2 id="brands-title" className={styles.heading}><T>{title}</T></h2>
        {description && <p className={styles.description}><T>{description}</T></p>}
        <div className={styles.rows}>
          {rows.map((brands, row) => (
            <LocalizedGroup className={styles.viewport} key={row} tabIndex={0} role="group" aria-label={`Təmir olunan brendlər — ${row + 1}-ci sətir`}>
              <div className={`${styles.track} ${row === 1 ? styles.reverse : ""}`}>
                {/* Each equal-width group includes its trailing gap, so -50% is exact. */}
                {[false, true].map((duplicate) => (
                  <div className={styles.group} role="list" aria-hidden={duplicate || undefined} key={String(duplicate)}>
                    {Array.from({ length: Math.max(1, Math.ceil(7 / brands.length)) }, (_, repeat) => brands.map((brand) => (
                      <div className={styles.logo} role="listitem" aria-hidden={repeat > 0 || undefined} key={`${repeat}-${brand.slug}`}>
                        <Image src={`/images/brands/${brand.slug}.webp`} alt={duplicate || repeat > 0 ? "" : brand.name} width={640} height={180} unoptimized loading="lazy" className={`${styles.image} ${brand.slug === "beko" || brand.slug === "lg" || brand.slug === "aeg" || brand.slug === "whirlpool" ? styles.compact : ""}`} />
                      </div>
                    )))}
                  </div>
                ))}
              </div>
            </LocalizedGroup>
          ))}
        </div>
      </div>
    </section>
  );
}
