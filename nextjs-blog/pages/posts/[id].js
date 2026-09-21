// Dynamic post page — URL shape is /posts/[id]
// Example: posts/ssg-ssr.md → http://localhost:3000/posts/ssg-ssr
import Layout from '../../components/layout'; // Shared page chrome (header, back link, etc.)
import { getAllPostIds, getPostData } from '../../lib/posts'; // All post IDs + one full post by id
import utilStyles from '../../styles/utils.module.css'; // Reusable CSS module class names
import Head from 'next/head'; // Edits the document <head> (tab title, meta, etc.)
import Date from '../../components/date'; // Turns ISO dates into readable text

// React page component for "/posts/[id]".
// postData comes from getStaticProps below: { id, title, date, contentHtml, ... }
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
          {/* date comes from the markdown front matter, e.g. '2020-01-01' */}
          <Date dateString={postData.date} />
        </div>

        {/*
          Renders the markdown body as HTML.
          contentHtml is created in getPostData() with remark + remark-html.
          dangerouslySetInnerHTML is required because React escapes HTML by default.
        */}
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

// Static Generation for dynamic routes:
// tells Next.js which [id] values to pre-build (one page per markdown file).
// Example return: [{ params: { id: 'ssg-ssr' } }, { params: { id: 'lakers' } }, ...]
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    // false = unknown ids (not in paths) show a 404 page
    fallback: false,
  };
}

// Runs at build time once per path from getStaticPaths.
// params.id is the dynamic segment from the URL / filename (without .md).
export async function getStaticProps({ params }) {
  // await is required because getPostData is async (markdown → HTML via remark)
  const postData = await getPostData(params.id);

  return {
    props: {
      postData, // Becomes the postData argument on Post(...)
    },
  };
}
