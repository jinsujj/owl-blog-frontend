import { getBlogById } from "@/app/api/blogApi";
import BlogDetailClient from "./BlogDetailClient";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({params}: BlogDetailPageProps) {
	const { slug } = await params;
  const post = await getBlogById(slug);

	if (!post) {
    return <div>Post not published</div>;
  }

  return <BlogDetailClient post={post} />;
}