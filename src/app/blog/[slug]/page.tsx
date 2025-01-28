import { getBlogById } from "@/app/api/blogApi";
import { NotPublishedPage } from "./NotPublishedPage";
import BlogDetail from "./BlogDetail";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({params}: BlogDetailPageProps) {
	const { slug } = await params;
  const post = await getBlogById(slug);

	if (post == null) {
    return <NotPublishedPage/>;
  }

  return <BlogDetail post={post} />;
}