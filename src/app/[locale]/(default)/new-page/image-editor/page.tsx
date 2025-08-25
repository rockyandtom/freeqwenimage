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

const content = {
  "H1_Main_Title": "Freeqwenimage: The Ultimate AI Watermark Remover for Your Images",
  "H1_Sub_Title": "Effortlessly remove watermarks with our free AI watermark remover tool. Freeqwenimage offers a fast and simple solution for clean, watermark-free images.",
  "Content_Sections": [
    {
      "H2_Subtitle": "Why Choose Our AI Watermark Remover?",
      "Paragraphs": [
        "Welcome to Freeqwenimage, where we believe in the power of pristine images. Our advanced **AI watermark remover** is designed to help you effortlessly remove watermarks from any picture. Whether you're a professional designer, a social media enthusiast, or just someone looking to clean up a personal photo, our tool provides a seamless and effective solution.",
        "Gone are the days of manually cloning and healing pixels; our **watermark remover** uses state-of-the-art artificial intelligence to detect and erase watermarks, leaving your images looking flawless and natural. With Freeqwenimage, you're not just removing a watermark; you're restoring the original beauty of your photo.",
        "Our AI-powered **watermark remover** stands out in a crowded market for several reasons. Unlike traditional photo editing software that requires a steep learning curve, Freeqwenimage is intuitive and easy to use. Our technology is built on a robust foundation of machine learning, allowing it to analyze the surrounding pixels and intelligently fill in the removed area."
      ]
    },
    {
      "H2_Subtitle": "How Our Free Watermark Remover Works Its Magic",
      "Paragraphs": [
        "The process of using our **watermark remover** is incredibly simple. All you need to do is upload your image to our platform. Our AI engine then takes over, automatically identifying the watermark. You can also manually select the area you want to clean up for more precise control.",
        "Once you've made your selection, our **watermark remover** algorithms get to work. They analyze the surrounding textures, colors, and patterns, then intelligently reconstruct the underlying image. This process is lightning-fast, and within seconds, you'll have a clean, watermark-free version of your image ready for download.",
        "This smart and efficient approach ensures that you get the best possible results every time you use our **watermark remover**. We've optimized our system for speed and accuracy, making it the go-to choice for anyone in need of a reliable **watermark remover**."
      ]
    },
    {
      "H2_Subtitle": "Beyond the Watermark Remover: The Power of AI Image Generation",
      "Paragraphs": [
        "While our **watermark remover** is a flagship feature, Freeqwenimage is so much more than just a single-purpose tool. Our platform is built around the innovative capabilities of **AI image generation**.",
        "This powerful feature allows you to create stunning, original images from simple text descriptions. Imagine being able to bring your wildest ideas to life with just a few words. This synergy of tools—from removing imperfections with our **watermark remover** to creating something entirely new with our AI generator—makes Freeqwenimage a comprehensive creative suite.",
        "The combination of our free **watermark remover** and powerful image generation capabilities provides an all-in-one solution for your visual needs."
      ]
    },
    {
      "H2_Subtitle": "Watermark Remover for Different Image Types",
      "Paragraphs": [
        "No matter what type of image you're working with, our **watermark remover** is up to the task. We've fine-tuned our AI to handle a wide range of images, including photographs, illustrations, and graphic designs.",
        "Our tool is effective on both transparent and opaque watermarks, as well as text and logo-based marks. Whether the watermark is in a corner, across the center, or subtly integrated into the background, our **watermark remover** can handle it.",
        "We've conducted extensive testing to ensure our tool performs exceptionally well across various scenarios, providing you with consistent and high-quality results. Our versatility makes us the ideal choice for anyone seeking a comprehensive **watermark remover** solution."
      ]
    },
    {
      "H2_Subtitle": "The Best Free Watermark Remover for Professional and Personal Use",
      "Paragraphs": [
        "Our free **watermark remover** is perfect for both personal and professional applications. Photographers can use it to clean up stock photos or client proofs. Marketers can prepare images for social media and advertising campaigns. Students can use it to enhance presentations and projects.",
        "We understand the value of high-quality visuals in today's world, and our **watermark remover** is designed to help you achieve that without the high cost of premium software. By offering this powerful tool for free, we aim to democratize access to professional-grade editing capabilities.",
        "Get started with the best **watermark remover** and see the difference for yourself."
      ]
    }
  ],
  "FAQ_Section": {
    "Title": "Everything You Need to Know About Our Watermark Remover",
    "Subtitle": "Common questions and answers about our AI watermark removal technology.",
    "FAQs": [
      {
        "Question": "What is an AI watermark remover?",
        "Answer": "An AI **watermark remover** uses advanced artificial intelligence algorithms to detect and intelligently erase watermarks from images. Instead of simply blurring or cloning, it analyzes the surrounding content and reconstructs the image area where the watermark was, resulting in a natural, clean look."
      },
      {
        "Question": "Is your watermark remover really free?",
        "Answer": "Yes, our **watermark remover** is completely free to use. We believe that everyone should have access to powerful image editing tools without having to pay for expensive software or subscriptions. You can use our tool without any hidden costs."
      },
      {
        "Question": "How long does it take to remove a watermark?",
        "Answer": "The process is incredibly fast. Our AI **watermark remover** is optimized for speed and efficiency. In most cases, it takes just a few seconds to process and deliver a clean image, depending on the file size and complexity of the watermark."
      },
      {
        "Question": "Can I remove watermarks from multiple images at once?",
        "Answer": "Currently, our free **watermark remover** processes images one at a time to ensure the highest quality results. However, we are constantly working on new features, and a batch processing option may be available in the future."
      },
      {
        "Question": "Does the watermark remover work on different file formats?",
        "Answer": "Yes, our **watermark remover** supports a wide range of popular image formats, including JPG, PNG, and more. We aim to make our tool as versatile and compatible as possible for all users."
      },
      {
        "Question": "Will using the watermark remover reduce the image quality?",
        "Answer": "No, our AI **watermark remover** is designed to preserve the original image quality. We focus on intelligently reconstructing the pixels rather than simply compressing or blurring the image, ensuring that the final output is high-resolution and sharp."
      },
      {
        "Question": "Is it safe to upload my images?",
        "Answer": "Yes, your privacy and security are our top priorities. All images uploaded to our **watermark remover** are processed securely and are automatically deleted from our servers shortly after processing. We do not store or share your personal data."
      },
      {
        "Question": "Can I use the watermark remover on my phone?",
        "Answer": "Absolutely! Our website is fully responsive and optimized for mobile devices. You can use our **watermark remover** directly from your smartphone or tablet's web browser, making it convenient to edit images on the go."
      }
    ]
  }
};

export default async function ImageEditorPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <HeroBg />
      <section className="py-24">
        <div className="container">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl"
                dangerouslySetInnerHTML={{ __html: content.H1_Main_Title }}>
            </h1>
            <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl"
               dangerouslySetInnerHTML={{ __html: content.H1_Sub_Title }}>
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-16">
            {content.Content_Sections.map((section, index) => (
              <section key={index} id={`section-${index + 1}`} className="py-16">
                <div className="container">
                  <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl"
                      dangerouslySetInnerHTML={{ __html: section.H2_Subtitle }}></h2>
                  <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6">
                    {section.Paragraphs.map((paragraph, pIndex) => (
                      <p key={pIndex}
                         dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>') }}></p>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* FAQ Section */}
          <section id="faq" className="py-16">
            <div className="container">
              <div className="text-center">
                <Badge className="text-xs font-medium">FAQ</Badge>
                <h2 className="mt-4 text-4xl font-semibold"
                    dangerouslySetInnerHTML={{ __html: content.FAQ_Section.Title }}></h2>
                <p className="mt-6 font-medium text-muted-foreground"
                   dangerouslySetInnerHTML={{ __html: content.FAQ_Section.Subtitle }}></p>
              </div>
              <div className="mx-auto mt-14 grid gap-8 md:grid-cols-2 md:gap-12">
                {content.FAQ_Section.FAQs.map((faq, index) => (
                  <div key={index} className="flex gap-4">
                    <span
                        className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">{index + 1}</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold"
                            dangerouslySetInnerHTML={{ __html: faq.Question }}></h3>
                      </div>
                      <p className="text-md text-muted-foreground"
                         dangerouslySetInnerHTML={{ __html: faq.Answer.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>') }}></p>
                    </div>
                  </div>
                ))}
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
      </section>
    </>
  );
}