import { type Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import ToolLoader from "@/components/tools/_base/tool-loader";
import { Suspense, lazy } from "react";

// 懒加载组件
const HeroBg = lazy(() => import("@/components/blocks/hero/bg"));
const ToolNavigation = lazy(() => import("@/components/ai-tools/tool-navigation"));

export const metadata: Metadata = {
  title: "Free AI Image to Video Generator - FreeQwenImage",
  description: "Transform static images into dynamic videos with AI animation. Create engaging video content from photos for social media, marketing, and creative projects.",
  keywords: ["image to video", "AI video generator", "photo animation", "video creation", "AI animation", "free video maker"],
};

const content = {
  "H1_Main_Title": "AI Image to Video Generator: Bring Photos to Life",
  "H1_Sub_Title": "Transform any static image into a dynamic video with AI-powered animation. Perfect for social media, marketing, and creative storytelling.",
  "Tool_Title": "Try Our Free Image to Video Generator",
  "Content_Sections": [
    {
      "H2_Subtitle": "How AI Image to Video Generation Works",
      "Paragraphs": [
        "Our **Image to Video Generator** uses advanced AI to analyze your image and create realistic motion effects. The AI understands depth, objects, and composition to generate natural-looking animations that bring your static photos to life.",
        "Choose from various **animation styles** like subtle motion, dynamic action, cinematic effects, or parallax movements. The AI applies physics-based motion that respects the original image structure while adding engaging visual dynamics."
      ]
    },
    {
      "H2_Subtitle": "Perfect for Content Creators and Marketers",
      "Paragraphs": [
        "Create **engaging social media content** for Instagram Stories, TikTok videos, Facebook posts, and Twitter. Transform product photos into **dynamic marketing materials**, bring portraits to life, or add motion to landscape photography for stunning visual storytelling.",
        "Our tool is perfect for **content creators**, **digital marketers**, **social media managers**, and **creative professionals** who need to produce eye-catching video content quickly and efficiently without complex video editing software."
      ]
    },
    {
      "H2_Subtitle": "Advanced Animation Controls and Styles",
      "Paragraphs": [
        "Fine-tune your animations with **motion strength controls**, choose from **multiple duration options** (2-8 seconds), and select from **8 different animation styles** including cinematic, parallax, morphing, and rotation effects.",
        "Add **custom animation prompts** to create unique motion effects beyond preset styles. The AI understands complex motion descriptions like 'gentle swaying', 'camera zoom', or 'floating elements' to create exactly the animation you envision."
      ]
    }
  ],
  "FAQ_Section": {
    "Title": "Frequently Asked Questions about Image to Video AI",
    "Subtitle": "Everything you need to know about AI-powered video generation from images.",
    "FAQs": [
      {
        "Question": "What types of images work best for video generation?",
        "Answer": "**High-quality, well-lit images** with clear subjects work best. **Portraits**, **landscapes**, **product photos**, and **artwork** all produce excellent results. Images with good contrast and defined elements create more realistic animations."
      },
      {
        "Question": "How long does it take to generate a video?",
        "Answer": "Video generation typically takes **30-60 seconds** depending on image complexity and chosen duration. The AI needs more time to analyze and animate complex scenes, but most videos are ready within a minute."
      },
      {
        "Question": "What video formats and quality do you support?",
        "Answer": "We generate **MP4 videos** in **HD quality** with smooth frame rates. Videos are optimized for social media platforms and can be easily shared or downloaded for use in presentations, websites, or marketing materials."
      },
      {
        "Question": "Can I control the type of animation applied?",
        "Answer": "Yes! Choose from **8 animation styles** including subtle motion, dynamic action, cinematic effects, parallax, morphing, zoom, pan, and rotation. You can also adjust **motion strength** and add **custom prompts** for unique effects."
      },
      {
        "Question": "What video durations are available?",
        "Answer": "You can generate videos from **2 to 8 seconds** in length. Shorter durations (2-4s) are perfect for **social media**, while longer durations (6-8s) work well for **presentations** and **marketing content**."
      },
      {
        "Question": "Can I use the generated videos commercially?",
        "Answer": "Yes, you can use the generated videos for both **personal and commercial purposes**. They're perfect for social media marketing, advertising campaigns, presentations, and creative projects. Check our terms for specific usage details."
      }
    ]
  }
};

export default function ImageToVideoPage() {
  return (
    <>
      <Suspense fallback={<div className="fixed inset-0 bg-gradient-to-br from-background to-muted" />}>
        <HeroBg />
      </Suspense>
      <section className="py-24">
        <div className="container">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4">AI Video Generator</Badge>
            <h1 className="mx-auto mb-6 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
              {content.H1_Main_Title}
            </h1>
            <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
              {content.H1_Sub_Title}
            </p>
          </div>

          {/* Tool Section */}
          <section id="image-to-video-tool" className="py-16">
            <div className="container">
              <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl text-center">
                {content.Tool_Title}
              </h2>
              <div className="max-w-4xl mx-auto">
                <ToolLoader toolId="image-to-video" />
              </div>
            </div>
          </section>

          {/* Content Sections */}
          <div className="space-y-16">
            {content.Content_Sections.map((section, index) => (
              <section key={index} id={`section-${index + 1}`} className="py-16">
                <div className="container">
                  <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                    {section.H2_Subtitle}
                  </h2>
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
                <h2 className="mt-4 text-4xl font-semibold">
                  {content.FAQ_Section.Title}
                </h2>
                <p className="mt-6 font-medium text-muted-foreground">
                  {content.FAQ_Section.Subtitle}
                </p>
              </div>
              <div className="mx-auto mt-14 grid gap-8 md:grid-cols-2 md:gap-12">
                {content.FAQ_Section.FAQs.map((faq, index) => (
                  <div key={index} className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">{index + 1}</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">{faq.Question}</h3>
                      </div>
                      <p className="text-md text-muted-foreground"
                         dangerouslySetInnerHTML={{ __html: faq.Answer.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>') }}></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tool Navigation */}
          <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded-lg" />}>
            <ToolNavigation currentTool="image-to-video" />
          </Suspense>

          {/* CTA Section */}
          <section className="py-20">
            <div className="px-8">
              <div className='flex items-center justify-center rounded-2xl bg-[url("/imgs/masks/circle.svg")] bg-cover bg-center px-8 py-12 text-center md:p-16'>
                <div className="mx-auto max-w-2xl">
                  <h2 className="mb-4 text-balance text-3xl font-semibold md:text-5xl">
                    Ready to Animate Your Images?
                  </h2>
                  <p className="text-muted-foreground md:text-lg mb-8">
                    Transform your static photos into engaging videos with AI-powered animation technology.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="#image-to-video-tool" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                      Start Creating Videos - It's Free!
                    </a>
                    <a href="/ai-tools/video" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                      Explore More Video Tools
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