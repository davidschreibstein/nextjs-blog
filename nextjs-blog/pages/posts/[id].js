// Dynamic post page — URL shape is /posts/[id]
// Example: id 1 → http://localhost:3000/posts/1
import Layout from '../../components/layout'; // Shared page chrome (header, back link, etc.)
import { getAllPostIds, getPostData } from '../../lib/posts-json'; // JSON-based post helpers
import Head from 'next/head'; // Edits the document <head> (tab title, meta, etc.)
import Date from '../../components/date'; // Turns ISO dates into readable text
import utilStyles from '../../styles/utils.module.css'; // Reusable CSS module class names

// React page component for "/posts/[id]".
// postData comes from getStaticProps below: { id, title, date, contentHtml, tags, ... }
export default function Post({ postData }) {
  return (
    // No home prop → Layout shows the smaller header used on non-home pages
    <Layout>
      <Head>
        {/* Browser tab title matches this post's title */}
        <title>{postData.title}</title>
      </Head>

      {/* Semantic wrapper for a single blog post */}
      <article>
        {/* Large post heading */}
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>

        {/* Quieter secondary text for the publish date */}
        <div className={utilStyles.lightText}>
          {/* date comes from posts.json, e.g. '2026-09-14' */}
          <Date dateString={postData.date} />
        </div>

        {/* Optional tags array from JSON, joined into a comma-separated line */}
        {postData.tags?.length > 0 && (
          <div className={utilStyles.lightText}>
            Tags: {postData.tags.join(', ')}
          </div>
        )}

        {/*
          Renders HTML stored in contentHtml from posts.json.
          dangerouslySetInnerHTML is required because React escapes HTML by default.
        */}
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

// Static Generation for dynamic routes:
// tells Next.js which [id] values to pre-build (one page per JSON post).
// Example return: [{ params: { id: '1' } }, { params: { id: '2' } }, ...]
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    // false = unknown ids (not in paths) show a 404 page
    fallback: false,
  };
}

// Runs at build time once per path from getStaticPaths.
// params.id is the dynamic segment from the URL (e.g. "1" from /posts/1).
export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);

  return {
    props: {
      postData, // Becomes the postData argument on Post(...)
    },
  };
}
