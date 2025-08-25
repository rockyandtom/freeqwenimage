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

const content = {
  "H1_Main_Title": "AI Kissing Video Generator Free: Your Ultimate Tool for Romantic Videos",
  "H1_Sub_Title": "Create stunning AI kissing videos for free with free qwen image. Our AI Kissing Video Generator Free uses advanced AI to add AI video effects to your clips.",
  "Tool_Title": "Try Our AI Kissing Video Generator Free",
  "Content_Sections": [
    {
      "H2_Subtitle": "Unleash Your Creativity with Our AI Kissing Video Generator Free",
      "Paragraphs": [
        "Welcome to free qwen image, the leading platform for generating captivating videos with our **AI Kissing Video Generator Free**. Our mission is to empower you to create beautiful, heartfelt content without any technical hassle. With just a few clicks, you can transform ordinary videos into romantic masterpieces.",
        "Our **AI Kissing Video Generator Free** leverages cutting-edge artificial intelligence to add stunning AI video effects that will leave your viewers in awe. Imagine bringing your favorite characters to life or making your own romantic stories a reality.",
        "Our tool is designed for everyone, from seasoned content creators to beginners who are just starting their journey. You don't need any special skills or expensive software. The process is simple, intuitive, and, best of all, completely free."
      ]
    },
    {
      "H2_Subtitle": "How Our AI Kissing Video Generator Free Works: Simple and Intuitive",
      "Paragraphs": [
        "Our **AI Kissing Video Generator Free** is designed with a user-friendly interface to ensure a seamless experience. You start by uploading the video clip you wish to edit. Our AI then analyzes the video to understand its context and identify the subjects.",
        "Next, you can choose from a wide range of **AI video effects** specifically designed for romantic themes. These effects include various styles, animations, and transitions that can enhance the emotional impact of your video.",
        "The entire process is automated, so you don't have to worry about complex settings or manual adjustments. Whether you want to create a short, sweet clip or a longer, more elaborate video, our **AI Kissing Video Generator Free** can handle it all."
      ]
    },
    {
      "H2_Subtitle": "Why Choose Our AI Kissing Video Generator Free Over Others?",
      "Paragraphs": [
        "The market is flooded with video editing tools, but none offer the unique combination of features and quality that free qwen image does with its **AI Kissing Video Generator Free**. Our platform stands out for several key reasons:",
        "**Completely Free:** No hidden fees, subscriptions, or watermarks on your final videos. **Top-of-the-line AI Technology:** State-of-the-art deep learning models ensure realistic and visually stunning effects. **Unparalleled Ease of Use:** Intuitive interface that requires no prior video editing experience. **Wide Variety of Effects:** Extensive library of AI video effects for different romantic themes.",
        "Our **AI Kissing Video Generator Free** is not just a tool; it's a creative partner that helps you bring your romantic stories to life."
      ]
    },
    {
      "H2_Subtitle": "Creating Viral Content with Our AI Kissing Video Generator Free",
      "Paragraphs": [
        "Want to create content that captures attention and goes viral? Our **AI Kissing Video Generator Free** is your secret weapon. The unique and eye-catching **AI video effects** generated by our tool can make your videos stand out from the crowd.",
        "Social media platforms like TikTok, Instagram Reels, and YouTube Shorts are dominated by short, engaging clips. By using our **AI Kissing Video Generator Free**, you can create visually striking videos that are perfect for these platforms.",
        "The emotional appeal of romantic videos is universal, and our AI enhances this appeal with beautiful and realistic effects. Start using our **AI Kissing Video Generator Free** today and watch your content soar to new heights."
      ]
    },
    {
      "H2_Subtitle": "The Technology Behind Our AI Kissing Video Generator Free",
      "Paragraphs": [
        "At the heart of free qwen image is a powerful AI engine that drives our **AI Kissing Video Generator Free**. Our technology is built on a foundation of advanced machine learning and computer vision.",
        "We use deep neural networks to analyze video frames, identify human subjects, and understand their interactions. The AI then synthesizes new visual elements, such as animated effects, transitions, and filters, to create the final video.",
        "Our cloud-based infrastructure allows us to process videos quickly, so you don't have to wait long to see your creations. The technology behind our **AI Kissing Video Generator Free** is a testament to our commitment to innovation and excellence."
      ]
    }
  ],
  "FAQ_Section": {
    "Title": "Your Questions About Our AI Kissing Video Generator Free Answered",
    "Subtitle": "Everything you need to know about creating AI kissing videos with our generator.",
    "FAQs": [
      {
        "Question": "What is the free qwen image AI Kissing Video Generator Free?",
        "Answer": "Our **AI Kissing Video Generator Free** is a web-based tool that uses artificial intelligence to add romantic and creative effects to your videos, specifically focusing on kissing scenes and similar themes."
      },
      {
        "Question": "Is the AI Kissing Video Generator Free really free?",
        "Answer": "Yes, our **AI Kissing Video Generator Free** is completely free to use. There are no hidden charges, subscriptions, or watermarks on your final videos."
      },
      {
        "Question": "How long does it take to generate a video?",
        "Answer": "The generation time depends on the length of your video and the complexity of the effects you choose. However, thanks to our optimized servers, most videos are processed within minutes."
      },
      {
        "Question": "Can I use the AI Kissing Video Generator Free on my phone?",
        "Answer": "Yes, our website is fully responsive and works on both desktop and mobile devices. You can easily access and use the **AI Kissing Video Generator Free** from your smartphone or tablet."
      },
      {
        "Question": "What kind of AI video effects are available?",
        "Answer": "We offer a wide variety of **AI video effects**, including romantic filters, animated overlays, heart-shaped transitions, and more. We are constantly adding new effects to our library."
      },
      {
        "Question": "Do I need any special software to use the AI Kissing Video Generator Free?",
        "Answer": "No, you don't need to download or install any software. Our tool is entirely browser-based, so you only need an internet connection to use it."
      },
      {
        "Question": "Are my uploaded videos private and secure?",
        "Answer": "Yes, we take user privacy very seriously. Your uploaded videos are securely processed and are not shared with any third parties. They are automatically deleted from our servers after a short period."
      },
      {
        "Question": "Can I use the videos for commercial purposes?",
        "Answer": "Yes, you have full ownership of the videos you create with our **AI Kissing Video Generator Free**. You are free to use them for personal or commercial purposes without any restrictions."
      }
    ]
  }
};

export default async function AIEffectsPage({ params }: PageProps) {
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

          {/* Image to Video Tool */}
          <section id="ai-video-tool" className="py-16">
            <div className="container">
              <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl text-center">
                {content.Tool_Title}
              </h2>
              <div className="max-w-4xl mx-auto">
                <ImageToVideoTool />
              </div>
            </div>
          </section>

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
                    Ready to Create Amazing AI Kissing Videos?
                  </h2>
                  <p className="text-muted-foreground md:text-lg">
                    Join millions of users who trust our AI Kissing Video Generator Free to bring their romantic stories to life.
                  </p>
                  <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                    <a href="#ai-video-tool" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                      Start Creating Now - It's Free!
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
