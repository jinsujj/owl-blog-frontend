import { getBlogById } from "@/app/api/blogApi";
import { NotPublishedPage } from "./NotPublishedPage";
import BlogDetail from "./BlogDetail";
import { NextSeo } from "next-seo";

export interface BlogDetailPageProps {
  params: { slug: string };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = await getBlogById(params.slug);

  if (!post) {
    return <NotPublishedPage />;
  }

  return (
    <>
      <NextSeo
        title={post.title}
        description={post.summary || post.content?.blocks?.toString().slice(0, 150)}
        canonical={`https://www.owl-dev.me/blog/${params.slug}`}
        openGraph={{
          url: `https://www.owl-dev.me/blog/${params.slug}`,
          title: post.title,
          description: post.summary || post.content?.blocks?.toString().slice(0, 150),
          images: [
            {
              url:
                post.thumbnailUrl ||
                "https://www.owl-dev.me/img/owl.svg",
              width: 800,
              height: 600,
              alt: post.title,
            },
          ],
        }}
      />
      <BlogDetail post={post} />
    </>
  );
}
