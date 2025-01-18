import { getBlogById } from "@/app/api/blogApi";
import BlogDetailClient from "./BlogDetailClient";
import { NotPublishedPage } from "./NotPublishedPage";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({params}: BlogDetailPageProps) {
	const { slug } = await params;
  const post = await getBlogById(slug);

	if (!post) {
    return <NotPublishedPage/>;
  }

  return <BlogDetailClient post={post} />;
}