// Shared Layout component used by multiple pages
import Head from 'next/head'; // Document head metadata
import Image from 'next/image'; // Optimized Next.js image component
import styles from './layout.module.css'; // Styles specific to this layout
import utilStyles from '../styles/utils.module.css'; // Shared utility styles
import Link from 'next/link'; // Client-side page links

// Display name shown in the page header
const name = 'David';
// Exported so other pages (like index.js) can reuse the site title
export const siteTitle = 'Next.js Sample Website';

// children = page content; home = true on the homepage for a larger header
export default function Layout({ children, home }) {
  return (
    // Centered content container
    <div className={styles.container}>
      <Head>
        {/* Favicon in the browser tab */}
        <link rel="icon" href="/favicon.ico" />
        {/* SEO / social sharing metadata */}
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle,
          )}.png?theme=light&md=0&fontSize=75px&images=${encodeURIComponent(
            'https://nextjs.org/static/nextjs-logo.svg',
          )}`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* Site header: profile photo + name */}
      <header className={styles.header}>
        {home ? (
          // Homepage: larger photo and h1 name
          <>
            <Image
              priority // Load this image right away (above the fold)
              src="/images/profile.jpg"
              className={utilStyles.borderCircle}
              height={144}
              width={144}
              alt=""
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          // Other pages: smaller photo + name linking back home
          <>
            <Link href="/">
              <Image
                priority
                src="/images/profile.jpg"
                className={utilStyles.borderCircle}
                height={108}
                width={108}
                alt=""
              />
            </Link>
            <h2 className={utilStyles.headingLg}>
              <Link href="/" className={utilStyles.colorInherit}>
                {name}
              </Link>
            </h2>
          </>
        )}
      </header>

      {/* Page-specific content goes here */}
      <main>{children}</main>

      {/* Show "Back to home" only on non-home pages */}
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      )}
    </div>
  );
}
