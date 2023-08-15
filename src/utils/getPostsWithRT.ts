import type { BlogFrontmatter } from "@content/_schemas";
import type { MarkdownInstance } from "astro";
import slugify from "./slugify";
import type { CollectionEntry } from "astro:content";

export const readingTime = async () => {
  const globPosts = import.meta.glob<MarkdownInstance<BlogFrontmatter>>(
    "../content/blog/*.md"
  );

  const mapFrontMatter = new Map();
  const globValues = Object.values(globPosts);
  await Promise.all(
    globValues.map(async globPost => {
      const { frontmatter } = await globPost();
      mapFrontMatter.set(slugify(frontmatter), frontmatter.readingTime);
    })
  );

  return mapFrontMatter;
};

const getPostsWithRT = async (posts: CollectionEntry<"blog">[]) => {
  const mapFrontMatter = await readingTime();
  return posts.map(post => {
    post.data.readingTime = mapFrontMatter.get(slugify(post.data));
    return post;
  });
};

export default getPostsWithRT;
