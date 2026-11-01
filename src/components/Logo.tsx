import Image from "next/image";

/** Display the supplied PNG without its outer margins; preserve the original pixels. */
export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={`site-logo${className ? ` ${className}` : ""}`}>
      <Image
        src="/images/denizservis-logo-v5.png"
        alt="DənizServis"
        width={1672}
        height={941}
        sizes="(min-width: 1024px) 223px, 186px"
        preload={priority}
        className="site-logo-image"
      />
    </span>
  );
}
