export interface BlogPost {
  _id?: string;
  slug: string;
  title: string;
  date: string;
  readTime: string;
  image: string;
  summary: string;
  content: string[];
}

// Dummy data removed. All blogs are now dynamically managed via CMS & database.
export const BLOG_POSTS: BlogPost[] = [];

export function getAllBlogs(): BlogPost[] {
  return BLOG_POSTS;
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((b) => b.slug === slug);
}
