import { getBlogById } from "@/app/api/blogApi";
import { NotPublishedPage } from "./NotPublishedPage";
import BlogDetail from "./BlogDetail";
import type { Metadata } from "next";


// cache 
const getPostBySlug = async (slug: string) => {
  return await getBlogById(slug);
};

export interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({params}: BlogDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "게시글을 찾을 수 없습니다",
      description: "존재하지 않는 글입니다.",
    };
  }

  return {
    title: post.title || 'title',
    description:
      post.summary || post.content?.blocks?.toString()?.slice(0, 100),
    openGraph: {
      title: post.title,
      description: post.summary || post.title,
      url: `https://www.owl-dev.me/blog/${resolvedParams.slug}`,
      images: [
        {
          url:
            post.thumbnailUrl || "https://www.owl-dev.me/img/owl.svg",
          width: 800,
          height: 600,
        },
      ],
    },
  };
}

export default async function BlogDetailPage({params}: BlogDetailPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return <NotPublishedPage />;
  }

  return <BlogDetail post={post} />;
}
