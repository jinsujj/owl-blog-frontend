import { getBlogById } from "@/app/api/blogApi";
import BlogDetailClient from "./BlogDetailClient";

export default async function BlogDetailPage({params}: {params: { slug: string }}) {
  const { slug } = params;
  const post = await getBlogById(slug); 

	if (!post) {
    return <div>Post not published</div>;
  }

  return <BlogDetailClient post={post} />;
}