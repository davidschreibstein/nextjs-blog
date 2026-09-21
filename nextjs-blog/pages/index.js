// Home page — rendered at the site root URL (/)
import Link from 'next/link'; // Client-side links (no full page reload)
import Date from '../components/date'; // Turns ISO dates into readable text
import Head from 'next/head'; // Edits the document <head> (tab title, meta, etc.)
import Layout, { siteTitle } from '../components/layout'; // Shared layout + exported site title string
import utilStyles from '../styles/utils.module.css'; // Reusable CSS module class names

// Reads /posts/*.md, parses front matter, returns posts sorted by date
import { getSortedPostsData } from '../lib/posts';

// Static Generation: runs once at build time on the server (not in the browser).
// Whatever you return in props is passed into the page component below.
export async function getStaticProps() {
  const allPostsData = getSortedPostsData(); // Array of { id, title, date, ... }
  return {
    props: {
      allPostsData, // Becomes the allPostsData argument on Home(...)
    },
  };
}

// React page component for "/".
// allPostsData comes from getStaticProps above.
export default function Home({ allPostsData }) {
  return (
    // home={true} → Layout shows the large homepage header (bigger photo + name)
    <Layout home>
      <Head>
        {/* Text shown in the browser tab */}
        <title>{siteTitle}</title>
      </Head>

      {/* Blog listing: heading + unordered list of posts */}
      {/* Template literal combines two CSS module classes into one className string */}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {/* .map() builds one <li> per post; destructure only the fields we need */}
          {allPostsData.map(({ id, date, title }) => (
            // key helps React track each list item; use a stable unique value (id)
            <li className={utilStyles.listItem} key={id}>
              {/* Dynamic route: /posts/ssg-ssr, /posts/lakers, etc. */}
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              {/* <small> + lightText = secondary, quieter date styling */}
              <small className={utilStyles.lightText}>
                {/* dateString is the markdown front-matter date, e.g. '2020-01-01' */}
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
