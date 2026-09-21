// Helpers that load blog posts from data/posts.json (instead of markdown files)
import fs from 'fs'; // Node built-in: read files from disk
import path from 'path'; // Node built-in: build file paths safely across OSes

// Absolute path to the /data folder (process.cwd() = project root when Next runs)
const dataDir = path.join(process.cwd(), 'data');

// Returns all posts for the home page list, sorted A–Z by title
export function getSortedPostsData() {
  // Build path to posts.json and read it as a UTF-8 string
  const filePath = path.join(dataDir, 'posts.json');
  const jsonString = fs.readFileSync(filePath, 'utf8');
  // Turn the JSON text into a JavaScript array of post objects
  const jsonObj = JSON.parse(jsonString);

  // Sort in place by title (localeCompare handles alphabetical order)
  jsonObj.sort(function (a, b) {
    return a.title.localeCompare(b.title);
  });

  // Keep only the fields the listing needs; id must be a string for URLs
  return jsonObj.map((item) => {
    return {
      id: item.id.toString(),
      title: item.title,
      date: item.date,
      tags: item.tags || [], // Fallback to [] if a post has no tags
    };
  });
}

// Returns path objects for getStaticPaths — one entry per post id
// Shape: [{ params: { id: '1' } }, { params: { id: '2' } }, ...]
export function getAllPostIds() {
  const filePath = path.join(dataDir, 'posts.json');
  const jsonString = fs.readFileSync(filePath, 'utf8');
  const jsonObj = JSON.parse(jsonString);

  // Next.js expects each path under params with the dynamic [id] value
  return jsonObj.map((item) => {
    return {
      params: {
        id: item.id.toString(),
      },
    };
  });
}

// Returns one full post object by id (used by the /posts/[id] page)
export function getPostData(id) {
  const filePath = path.join(dataDir, 'posts.json');
  const jsonString = fs.readFileSync(filePath, 'utf8');
  const jsonObj = JSON.parse(jsonString);

  // filter keeps matching items; compare as strings so "1" matches 1
  const objReturned = jsonObj.filter((obj) => {
    return obj.id.toString() === id;
  });

  // No match → return a placeholder so the page still renders
  if (objReturned.length === 0) {
    return {
      id: id,
      title: 'Not found',
      date: '',
      contentHtml: 'Not found',
      tags: [],
    };
  } else {
    // filter returns an array; take the first (and only) match
    return objReturned[0];
  }
}
