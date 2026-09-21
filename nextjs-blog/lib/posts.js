// Helpers that load blog posts from /posts/*.md (markdown + front matter)
import { remark } from 'remark'; // Markdown processor
import html from 'remark-html'; // remark plugin: markdown → HTML
import fs from 'fs'; // Node built-in: read files from disk
import path from 'path'; // Node built-in: build file paths safely across OSes
import matter from 'gray-matter'; // Parses YAML front matter from markdown files

// Absolute path to the /posts folder (process.cwd() = project root when Next runs)
const postsDirectory = path.join(process.cwd(), 'posts');

// Returns all posts for the home page list, sorted newest-first by date
export function getSortedPostsData() {
  // Get file names under /posts (e.g. ['ssg-ssr.md', 'colts.md', ...])
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id (used in /posts/[id] URLs)
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section (title, date, etc.)
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date (newer dates first)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Returns path objects for getStaticPaths — one entry per markdown file
// Shape: [{ params: { id: 'ssg-ssr' } }, ...]
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        // Strip .md so the URL id matches the filename without extension
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

// Returns one full post (metadata + HTML body) by id
export async function getPostData(id) {
  // Build path like posts/ssg-ssr.md from the URL id
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown body into an HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml for the page component
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}