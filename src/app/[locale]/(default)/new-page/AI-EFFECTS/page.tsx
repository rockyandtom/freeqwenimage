import { Metadata } from "next";
import HeroBg from "@/components/blocks/hero/bg";
import { Badge } from "@/components/ui/badge";
import { ImageToVideoTool } from "@/components/ImageToVideoTool";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  // 使用规范域名
  let canonicalUrl = `https://freeqwenimage.com/new-page/AI-EFFECTS`;

  if (locale !== "en") {
    canonicalUrl = `https://freeqwenimage.com/${locale}/new-page/AI-EFFECTS`;
  }

  return {
    title: "AI Kissing Video Generator Free - free qwen image",
    description: "Create stunning AI kissing videos for free with free qwen image. Our AI Kissing Video Generator Free uses advanced AI to add AI video effects to your clips.",
    keywords: "AI Kissing Video Generator Free, AI video effects, free video generator, AI kissing videos, romantic video effects",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "AI Kissing Video Generator Free - free qwen image",
      description: "Create stunning AI kissing videos for free with free qwen image. Our AI Kissing Video Generator Free uses advanced AI to add AI video effects to your clips.",
      url: canonicalUrl,
      siteName: "Free Qwen Image",
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Kissing Video Generator Free - free qwen image",
      description: "Create stunning AI kissing videos for free with free qwen image. Our AI Kissing Video Generator Free uses advanced AI to add AI video effects to your clips.",
    },
  };
}

export default async function AIEffectsPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <HeroBg />
      <section className="py-24">
        <div className="container">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
              AI Kissing Video Generator Free: Your Ultimate Tool for Romantic Videos
            </h1>
            <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
              Create stunning AI kissing videos for free with free qwen image. Our AI Kissing Video Generator Free uses advanced AI to add AI video effects to your clips.
            </p>
          </div>

          {/* Image to Video Tool */}
          <section id="image-to-video-tool" className="py-16">
            <div className="container">
              <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl text-center">
                Try Our AI Kissing Video Generator Free
              </h2>
              <div className="max-w-4xl mx-auto">
                <ImageToVideoTool />
              </div>
            </div>
          </section>

          {/* Content Sections */}
          <div className="space-y-16">
            {/* Section 1 */}
            <section id="unleash-creativity" className="py-16">
              <div className="container">
                <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                  Unleash Your Creativity with Our AI Kissing Video Generator Free
                </h2>
                <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6">
                  <p>
                    Welcome to free qwen image, the leading platform for generating captivating videos with our <strong>AI Kissing Video Generator Free</strong>. Our mission is to empower you to create beautiful, heartfelt content without any technical hassle. With just a few clicks, you can transform ordinary videos into romantic masterpieces.
                  </p>
                  <p>
                    Our <strong>AI Kissing Video Generator Free</strong> leverages cutting-edge artificial intelligence to add stunning AI video effects that will leave your viewers in awe. Imagine bringing your favorite characters to life or making your own romantic stories a reality.
                  </p>
                  <p>
                    Our tool is designed for everyone, from seasoned content creators to beginners who are just starting their journey. You don't need any special skills or expensive software. The process is simple, intuitive, and, best of all, completely free.
                  </p>
                  <p>
                    Join the millions of users who trust free qwen image to bring their creative visions to life with our <strong>AI Kissing Video Generator Free</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="how-it-works" className="py-16">
              <div className="container">
                <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                  How Our AI Kissing Video Generator Free Works: Simple and Intuitive
                </h2>
                <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6">
                  <p>
                    Our <strong>AI Kissing Video Generator Free</strong> is designed with a user-friendly interface to ensure a seamless experience. You start by uploading the video clip you wish to edit. Our AI then analyzes the video to understand its context and identify the subjects.
                  </p>
                  <p>
                    Next, you can choose from a wide range of <strong>AI video effects</strong> specifically designed for romantic themes. These effects include various styles, animations, and transitions that can enhance the emotional impact of your video.
                  </p>
                  <p>
                    The entire process is automated, so you don't have to worry about complex settings or manual adjustments. Whether you want to create a short, sweet clip or a longer, more elaborate video, our <strong>AI Kissing Video Generator Free</strong> can handle it all.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="why-choose-us" className="py-16">
              <div className="container">
                <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                  Why Choose Our AI Kissing Video Generator Free Over Others?
                </h2>
                <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6">
                  <p>
                    The market is flooded with video editing tools, but none offer the unique combination of features and quality that free qwen image does with its <strong>AI Kissing Video Generator Free</strong>. Our platform stands out for several key reasons:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">1</span>
                      <div><strong>Completely Free:</strong> No hidden fees, subscriptions, or watermarks on your final videos.</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">2</span>
                      <div><strong>Top-of-the-line AI Technology:</strong> State-of-the-art deep learning models ensure realistic and visually stunning effects.</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">3</span>
                      <div><strong>Unparalleled Ease of Use:</strong> Intuitive interface that requires no prior video editing experience.</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">4</span>
                      <div><strong>Wide Variety of Effects:</strong> Extensive library of AI video effects for different romantic themes.</div>
                    </li>
                  </ul>
                  <p>
                    Our <strong>AI Kissing Video Generator Free</strong> is not just a tool; it's a creative partner that helps you bring your romantic stories to life.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="viral-content" className="py-16">
              <div className="container">
                <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                  Creating Viral Content with Our AI Kissing Video Generator Free
                </h2>
                <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6">
                  <p>
                    Want to create content that captures attention and goes viral? Our <strong>AI Kissing Video Generator Free</strong> is your secret weapon. The unique and eye-catching <strong>AI video effects</strong> generated by our tool can make your videos stand out from the crowd.
                  </p>
                  <p>
                    Social media platforms like TikTok, Instagram Reels, and YouTube Shorts are dominated by short, engaging clips. By using our <strong>AI Kissing Video Generator Free</strong>, you can create visually striking videos that are perfect for these platforms.
                  </p>
                  <p>
                    The emotional appeal of romantic videos is universal, and our AI enhances this appeal with beautiful and realistic effects. Start using our <strong>AI Kissing Video Generator Free</strong> today and watch your content soar to new heights.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="technology" className="py-16">
              <div className="container">
                <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                  The Technology Behind Our AI Kissing Video Generator Free
                </h2>
                <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6">
                  <p>
                    At the heart of free qwen image is a powerful AI engine that drives our <strong>AI Kissing Video Generator Free</strong>. Our technology is built on a foundation of advanced machine learning and computer vision.
                  </p>
                  <p>
                    We use deep neural networks to analyze video frames, identify human subjects, and understand their interactions. The AI then synthesizes new visual elements, such as animated effects, transitions, and filters, to create the final video.
                  </p>
                  <p>
                    Our cloud-based infrastructure allows us to process videos quickly, so you don't have to wait long to see your creations. The technology behind our <strong>AI Kissing Video Generator Free</strong> is a testament to our commitment to innovation and excellence.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="advanced-features" className="py-16">
              <div className="container">
                <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                  Advanced Features and Customization with Our AI Kissing Video Generator Free
                </h2>
                <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6">
                  <p>
                    While our <strong>AI Kissing Video Generator Free</strong> is incredibly easy to use, it also offers a range of advanced features for those who want more control. You can customize various aspects of the AI video effects, such as their intensity, duration, and placement.
                  </p>
                  <p>
                    Our platform provides intuitive sliders and controls that allow you to fine-tune the effects to your liking. This level of customization gives you the freedom to create truly unique videos that reflect your personal style.
                  </p>
                  <p>
                    The <strong>AI Kissing Video Generator Free</strong> is a versatile tool that can be used for a variety of purposes, from creating romantic tributes to making playful and humorous clips.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="future" className="py-16">
              <div className="container">
                <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                  The Future of Video Creation: AI Kissing Video Generator Free
                </h2>
                <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6">
                  <p>
                    The landscape of content creation is rapidly evolving, and AI is at the forefront of this revolution. Tools like our <strong>AI Kissing Video Generator Free</strong> are not just a passing trend; they are the future.
                  </p>
                  <p>
                    AI empowers creators to produce high-quality, professional-looking content without the need for extensive technical skills or expensive software. It democratizes the creative process, making it accessible to everyone.
                  </p>
                  <p>
                    Join us on this exciting journey and be a part of the future of content creation with free qwen image and our <strong>AI Kissing Video Generator Free</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16">
              <div className="container">
                <div className="text-center">
                  <Badge className="text-xs font-medium">FAQ</Badge>
                  <h2 className="mt-4 text-4xl font-semibold">Your Questions About Our AI Kissing Video Generator Free Answered</h2>
                  <p className="mt-6 font-medium text-muted-foreground">
                    Everything you need to know about creating AI kissing videos with our generator.
                  </p>
                </div>
                <div className="mx-auto mt-14 grid gap-8 md:grid-cols-2 md:gap-12">
                  <div className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">1</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">What is the free qwen image AI Kissing Video Generator Free?</h3>
                      </div>
                      <p className="text-md text-muted-foreground">
                        Our <strong>AI Kissing Video Generator Free</strong> is a web-based tool that uses artificial intelligence to add romantic and creative effects to your videos, specifically focusing on kissing scenes and similar themes.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">2</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">Is the AI Kissing Video Generator Free really free?</h3>
                      </div>
                      <p className="text-md text-muted-foreground">
                        Yes, our <strong>AI Kissing Video Generator Free</strong> is completely free to use. There are no hidden charges, subscriptions, or watermarks on your final videos.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">3</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">How long does it take to generate a video?</h3>
                      </div>
                      <p className="text-md text-muted-foreground">
                        The generation time depends on the length of your video and the complexity of the effects you choose. However, thanks to our optimized servers, most videos are processed within minutes.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">4</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">Can I use the AI Kissing Video Generator Free on my phone?</h3>
                      </div>
                      <p className="text-md text-muted-foreground">
                        Yes, our website is fully responsive and works on both desktop and mobile devices. You can easily access and use the <strong>AI Kissing Video Generator Free</strong> from your smartphone or tablet.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">5</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">What kind of AI video effects are available?</h3>
                      </div>
                      <p className="text-md text-muted-foreground">
                        We offer a wide variety of <strong>AI video effects</strong>, including romantic filters, animated overlays, heart-shaped transitions, and more. We are constantly adding new effects to our library.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">6</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">Do I need any special software to use the AI Kissing Video Generator Free?</h3>
                      </div>
                      <p className="text-md text-muted-foreground">
                        No, you don't need to download or install any software. Our tool is entirely browser-based, so you only need an internet connection to use it.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">7</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">Are my uploaded videos private and secure?</h3>
                      </div>
                      <p className="text-md text-muted-foreground">
                        Yes, we take user privacy very seriously. Your uploaded videos are securely processed and are not shared with any third parties. They are automatically deleted from our servers after a short period.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">8</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">Can I use the videos for commercial purposes?</h3>
                      </div>
                      <p className="text-md text-muted-foreground">
                        Yes, you have full ownership of the videos you create with our <strong>AI Kissing Video Generator Free</strong>. You are free to use them for personal or commercial purposes without any restrictions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
              <div className="px-8">
                <div className='flex items-center justify-center rounded-2xl bg-[url("/imgs/masks/circle.svg")] bg-cover bg-center px-8 py-12 text-center md:p-16'>
                  <div className="mx-auto max-w-(--breakpoint-md)">
                    <h2 className="mb-4 text-balance text-3xl font-semibold md:text-5xl">
                      Ready to Create Amazing AI Kissing Videos?
                    </h2>
                    <p className="text-muted-foreground md:text-lg">
                      Join millions of users who trust our AI Kissing Video Generator Free to bring their romantic stories to life.
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                      <a href="/#ai_generator" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        Start Creating Now - It's Free!
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
