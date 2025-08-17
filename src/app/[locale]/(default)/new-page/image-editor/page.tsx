import { Metadata } from "next";
import HeroBg from "@/components/blocks/hero/bg";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  // 使用规范域名
  let canonicalUrl = `https://freeqwenimage.com/new-page/image-editor`;

  if (locale !== "en") {
    canonicalUrl = `https://freeqwenimage.com/${locale}/new-page/image-editor`;
  }

  return {
    title: "Free AI Watermark Remover - Freeqwenimage",
    description: "Effortlessly remove watermarks with our free AI watermark remover tool. Freeqwenimage offers a fast and simple solution for clean, watermark-free images.",
    keywords: "AI watermark remover, free watermark remover, watermark removal tool, AI image editing, clean images",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Free AI Watermark Remover - Freeqwenimage",
      description: "Effortlessly remove watermarks with our free AI watermark remover tool. Freeqwenimage offers a fast and simple solution for clean, watermark-free images.",
      url: canonicalUrl,
      siteName: "Free Qwen Image",
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Free AI Watermark Remover - Freeqwenimage",
      description: "Effortlessly remove watermarks with our free AI watermark remover tool. Freeqwenimage offers a fast and simple solution for clean, watermark-free images.",
    },
  };
}

export default async function ImageEditorPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <HeroBg />
      <section className="py-24">
        <div className="container">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
              Freeqwenimage: The Ultimate AI Watermark Remover for Your Images
            </h1>
            <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
              Effortlessly remove watermarks with our free AI watermark remover tool. Freeqwenimage offers a fast and simple solution for clean, watermark-free images.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-16">
            {/* Section 1 */}
            <section id="introduction" className="py-16">
              <div className="container">
                <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6 mb-8">
                  <p>
                    Welcome to Freeqwenimage, where we believe in the power of pristine images. Our advanced <strong>AI watermark remover</strong> is designed to help you effortlessly remove watermarks from any picture. Whether you're a professional designer, a social media enthusiast, or just someone looking to clean up a personal photo, our tool provides a seamless and effective solution.
                  </p>
                  <p>
                    Gone are the days of manually cloning and healing pixels; our <strong>watermark remover</strong> uses state-of-the-art artificial intelligence to detect and erase watermarks, leaving your images looking flawless and natural. With Freeqwenimage, you're not just removing a watermark; you're restoring the original beauty of your photo.
                  </p>
                </div>

                <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                  Why Choose Our AI Watermark Remover?
                </h2>
                <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6">
                  <p>
                    Our AI-powered <strong>watermark remover</strong> stands out in a crowded market for several reasons. Unlike traditional photo editing software that requires a steep learning curve, Freeqwenimage is intuitive and easy to use.
                  </p>
                  <p>
                    Our technology is built on a robust foundation of machine learning, allowing it to analyze the surrounding pixels and intelligently fill in the removed area. This means no blurry patches or distorted backgrounds. The result is an image that looks as if the watermark was never there.
                  </p>
                  <p>
                    Furthermore, our platform is completely free, with no hidden fees or subscriptions. We are dedicated to providing a high-quality, accessible solution for everyone who needs a powerful <strong>watermark remover</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="how-it-works" className="py-16">
              <div className="container">
                <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                  How Our Free Watermark Remover Works Its Magic
                </h2>
                <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6">
                  <p>
                    The process of using our <strong>watermark remover</strong> is incredibly simple. All you need to do is upload your image to our platform. Our AI engine then takes over, automatically identifying the watermark. You can also manually select the area you want to clean up for more precise control.
                  </p>
                  <p>
                    Once you've made your selection, our <strong>watermark remover</strong> algorithms get to work. They analyze the surrounding textures, colors, and patterns, then intelligently reconstruct the underlying image. This process is lightning-fast, and within seconds, you'll have a clean, watermark-free version of your image ready for download.
                  </p>
                  <p>
                    This smart and efficient approach ensures that you get the best possible results every time you use our <strong>watermark remover</strong>. We've optimized our system for speed and accuracy, making it the go-to choice for anyone in need of a reliable <strong>watermark remover</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="ai-image-generation" className="py-16">
              <div className="container">
                <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                  Beyond the Watermark Remover: The Power of AI Image Generation
                </h2>
                <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6">
                  <p>
                    While our <strong>watermark remover</strong> is a flagship feature, Freeqwenimage is so much more than just a single-purpose tool. Our platform is built around the innovative capabilities of <strong>AI image generation</strong>.
                  </p>
                  <p>
                    This powerful feature allows you to create stunning, original images from simple text descriptions. Imagine being able to bring your wildest ideas to life with just a few words. This synergy of tools—from removing imperfections with our <strong>watermark remover</strong> to creating something entirely new with our AI generator—makes Freeqwenimage a comprehensive creative suite.
                  </p>
                  <p>
                    The combination of our free <strong>watermark remover</strong> and powerful image generation capabilities provides an all-in-one solution for your visual needs.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="image-types" className="py-16">
              <div className="container">
                <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                  Watermark Remover for Different Image Types
                </h2>
                <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6">
                  <p>
                    No matter what type of image you're working with, our <strong>watermark remover</strong> is up to the task. We've fine-tuned our AI to handle a wide range of images, including photographs, illustrations, and graphic designs.
                  </p>
                  <p>
                    Our tool is effective on both transparent and opaque watermarks, as well as text and logo-based marks. Whether the watermark is in a corner, across the center, or subtly integrated into the background, our <strong>watermark remover</strong> can handle it.
                  </p>
                  <p>
                    We've conducted extensive testing to ensure our tool performs exceptionally well across various scenarios, providing you with consistent and high-quality results. Our versatility makes us the ideal choice for anyone seeking a comprehensive <strong>watermark remover</strong> solution.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="professional-use" className="py-16">
              <div className="container">
                <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                  The Best Free Watermark Remover for Professional and Personal Use
                </h2>
                <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6">
                  <p>
                    Our free <strong>watermark remover</strong> is perfect for both personal and professional applications. Photographers can use it to clean up stock photos or client proofs. Marketers can prepare images for social media and advertising campaigns. Students can use it to enhance presentations and projects.
                  </p>
                  <p>
                    We understand the value of high-quality visuals in today's world, and our <strong>watermark remover</strong> is designed to help you achieve that without the high cost of premium software. By offering this powerful tool for free, we aim to democratize access to professional-grade editing capabilities.
                  </p>
                  <p>
                    Get started with the best <strong>watermark remover</strong> and see the difference for yourself.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="experience-today" className="py-16">
              <div className="container">
                <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                  Experience the Freeqwenimage Watermark Remover Today
                </h2>
                <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6">
                  <p>
                    Ready to say goodbye to unwanted watermarks? Head over to our platform and give our <strong>watermark remover</strong> a try. The process is quick, easy, and completely free. You don't need to create an account or provide any personal information to get started.
                  </p>
                  <p>
                    Just upload your image, let our AI do the work, and download your clean, beautiful picture. Join the thousands of satisfied users who have discovered the power and simplicity of the Freeqwenimage <strong>watermark remover</strong>.
                  </p>
                  <p>
                    We are constantly working to improve our AI and add new features to provide you with the best possible experience. Your perfect images are just a few clicks away.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="go-to-solution" className="py-16">
              <div className="container">
                <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                  Free Watermark Remover - Your Go-to Solution for Clean Images
                </h2>
                <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6">
                  <p>
                    In an era where visual content is king, having a reliable <strong>watermark remover</strong> is essential. Our tool is not just about removing a logo; it's about giving you full control over your visual assets.
                  </p>
                  <p>
                    We've built our platform with user convenience and privacy in mind. All uploaded images are processed securely and are never stored for long periods. You can be confident that your data is safe with us.
                  </p>
                  <p>
                    Our free <strong>watermark remover</strong> is a testament to our commitment to innovation and user satisfaction. Make Freeqwenimage your first choice for any image cleaning task and see why we are the leaders in AI-powered <strong>watermark remover</strong> technology.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16">
              <div className="container">
                <div className="text-center">
                  <Badge className="text-xs font-medium">FAQ</Badge>
                  <h2 className="mt-4 text-4xl font-semibold">Everything You Need to Know About Our Watermark Remover</h2>
                  <p className="mt-6 font-medium text-muted-foreground">
                    Common questions and answers about our AI watermark removal technology.
                  </p>
                </div>
                <div className="mx-auto mt-14 grid gap-8 md:grid-cols-2 md:gap-12">
                  <div className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">1</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">What is an AI watermark remover?</h3>
                      </div>
                      <p className="text-md text-muted-foreground">
                        An AI <strong>watermark remover</strong> uses advanced artificial intelligence algorithms to detect and intelligently erase watermarks from images. Instead of simply blurring or cloning, it analyzes the surrounding content and reconstructs the image area where the watermark was, resulting in a natural, clean look.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">2</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">Is your watermark remover really free?</h3>
                      </div>
                      <p className="text-md text-muted-foreground">
                        Yes, our <strong>watermark remover</strong> is completely free to use. We believe that everyone should have access to powerful image editing tools without having to pay for expensive software or subscriptions. You can use our tool without any hidden costs.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">3</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">How long does it take to remove a watermark?</h3>
                      </div>
                      <p className="text-md text-muted-foreground">
                        The process is incredibly fast. Our AI <strong>watermark remover</strong> is optimized for speed and efficiency. In most cases, it takes just a few seconds to process and deliver a clean image, depending on the file size and complexity of the watermark.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">4</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">Can I remove watermarks from multiple images at once?</h3>
                      </div>
                      <p className="text-md text-muted-foreground">
                        Currently, our free <strong>watermark remover</strong> processes images one at a time to ensure the highest quality results. However, we are constantly working on new features, and a batch processing option may be available in the future.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">5</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">Does the watermark remover work on different file formats?</h3>
                      </div>
                      <p className="text-md text-muted-foreground">
                        Yes, our <strong>watermark remover</strong> supports a wide range of popular image formats, including JPG, PNG, and more. We aim to make our tool as versatile and compatible as possible for all users.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">6</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">Will using the watermark remover reduce the image quality?</h3>
                      </div>
                      <p className="text-md text-muted-foreground">
                        No, our AI <strong>watermark remover</strong> is designed to preserve the original image quality. We focus on intelligently reconstructing the pixels rather than simply compressing or blurring the image, ensuring that the final output is high-resolution and sharp.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">7</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">Is it safe to upload my images?</h3>
                      </div>
                      <p className="text-md text-muted-foreground">
                        Yes, your privacy and security are our top priorities. All images uploaded to our <strong>watermark remover</strong> are processed securely and are automatically deleted from our servers shortly after processing. We do not store or share your personal data.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">8</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">Can I use the watermark remover on my phone?</h3>
                      </div>
                      <p className="text-md text-muted-foreground">
                        Absolutely! Our website is fully responsive and optimized for mobile devices. You can use our <strong>watermark remover</strong> directly from your smartphone or tablet's web browser, making it convenient to edit images on the go.
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
                      Ready to Remove Watermarks from Your Images?
                    </h2>
                    <p className="text-muted-foreground md:text-lg">
                      Join thousands of satisfied users who trust our free AI watermark remover for clean, professional-looking images.
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                      <a href="/#ai_generator" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        Try Our Watermark Remover - It's Free!
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