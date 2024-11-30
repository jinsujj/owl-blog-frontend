import { wrapper } from "./store";

export const metadata = {
  title: "부엉이 개발자 블로그",
  description: "CTO가 되고픈 부엉이 블로그 입니다",
  openGraph: {
    url: "https://www.owl-dev.me",
    title: "부엉이 개발자 블로그",
    description: "CTO가 되고픈 부엉이 블로그 입니다",
    images: [
      {
        url: "https://www.owl-dev.me/img/owl.svg",
        width: 800,
        height: 600,
      },
    ],
  },
  verification: {
    google: "sxi1RDD-x-R6U-lHMRiV2kEtt-m7NVfNAaK-JoPyzTA",
    naver: "857ab4a6de4aa0b0ddd2df29bcd1fb3129fe9198",
  },
};

const RootLayout =({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html lang="en">
      <body>
        <main>
          {children}
          <div id="root-modal" />
        </main>
      </body>
    </html>
  );
}


export default wrapper.withRedux(RootLayout);