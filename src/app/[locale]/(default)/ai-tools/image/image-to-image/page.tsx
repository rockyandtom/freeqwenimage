import { type Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import ToolLoader from "@/components/tools/_base/tool-loader";
import { Suspense, lazy } from "react";

// 懒加载组件
const HeroBg = lazy(() => import("@/components/blocks/hero/bg"));
const ToolNavigation = lazy(() => import("@/components/ai-tools/tool-navigation"));

export const metadata: Metadata = {
    title: "Free AI Image to Image Transformer - FreeQwenImage",
    description: "Transform your images with AI using text prompts. Change styles, apply artistic effects, and create stunning variations of your photos. Free and easy to use.",
    keywords: ["image to image", "AI image transformer", "style transfer", "image editing", "AI art", "photo transformation"],
};

const content = {
    "H1_Main_Title": "AI Image to Image Transformer: Reimagine Your Photos",
    "H1_Sub_Title": "Transform any image with AI using simple text prompts. Change styles, apply artistic effects, and create stunning variations of your existing photos.",
    "Tool_Title": "Try Our Free Image to Image Transformer",
    "Content_Sections": [
        {
            "H2_Subtitle": "How AI Image to Image Transformation Works",
            "Paragraphs": [
                "Our **Image to Image Transformer** uses advanced AI to understand both your original image and your text prompt, then creates a new version that combines elements from both. Upload any photo and describe how you want it transformed.",
                "The AI analyzes the composition, objects, and style of your original image, then applies the changes you describe while maintaining the core structure. Whether you want to **change artistic styles**, **modify colors**, **add effects**, or **transform the mood**, our tool delivers professional results."
            ]
        },
        {
            "H2_Subtitle": "Endless Creative Possibilities",
            "Paragraphs": [
                "Transform **portraits into paintings**, convert **photos to anime style**, apply **artistic filters**, or completely **reimagine scenes**. Our AI understands complex transformations like changing seasons, time of day, weather conditions, or artistic movements.",
                "Perfect for **digital artists**, **content creators**, **photographers**, and anyone looking to explore creative variations of their images. Create multiple versions with different styles, experiment with artistic effects, or prepare images for different contexts and audiences."
            ]
        },
        {
            "H2_Subtitle": "Professional Features and Controls",
            "Paragraphs": [
                "Our **Image to Image tool** offers precise control over the transformation process. Adjust the **transformation strength** to control how dramatically your image changes, choose from **style presets** for common effects, or write **custom prompts** for unique results.",
                "The tool supports **high-resolution images**, maintains **image quality** throughout the transformation, and provides **before/after comparisons** so you can see exactly how your image has been enhanced. All transformations preserve the original aspect ratio and important compositional elements."
            ]
        }
    ],
    "FAQ_Section": {
        "Title": "Frequently Asked Questions about Image to Image AI",
        "Subtitle": "Everything you need to know about AI-powered image transformation.",
        "FAQs": [
            {
                "Question": "What types of transformations can I do?",
                "Answer": "You can apply **artistic styles** (watercolor, oil painting, anime), change **moods and atmospheres**, modify **colors and lighting**, add **weather effects**, transform **time of day**, and much more. The AI understands complex descriptions and can combine multiple effects."
            },
            {
                "Question": "How do I write effective transformation prompts?",
                "Answer": "Be specific about the style and changes you want. Instead of 'make it artistic', try 'transform into a watercolor painting with soft blues and purples'. Include details about **style**, **colors**, **mood**, **lighting**, and **artistic techniques** for best results."
            },
            {
                "Question": "What image formats and sizes are supported?",
                "Answer": "We support **JPG**, **PNG**, and **WEBP** formats up to **10MB** in size. The AI works best with clear, well-lit images. Higher resolution images generally produce better transformation results."
            },
            {
                "Question": "How long does image transformation take?",
                "Answer": "Most transformations complete in **15-45 seconds** depending on image size and complexity. The tool shows real-time progress and allows you to cancel if needed. More complex transformations may take slightly longer."
            },
            {
                "Question": "Can I control how much the image changes?",
                "Answer": "Yes! Use the **transformation strength** slider to control the intensity. Lower values (0.1-0.4) make subtle changes while preserving the original, while higher values (0.7-1.0) create more dramatic transformations."
            },
            {
                "Question": "Is my uploaded image stored or shared?",
                "Answer": "Your images are processed securely and **automatically deleted after 24 hours**. We don't store, share, or use your images for any other purpose. Your privacy and data security are our top priorities."
            }
        ]
    }
};

export default function ImageToImagePage() {
    return (
        <>
            <Suspense fallback={<div className="fixed inset-0 bg-gradient-to-br from-background to-muted" />}>
                <HeroBg />
            </Suspense>
            <section className="py-24">
                <div className="container">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <Badge className="mb-4">AI Image Transformer</Badge>
                        <h1 className="mx-auto mb-6 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
                            {content.H1_Main_Title}
                        </h1>
                        <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                            {content.H1_Sub_Title}
                        </p>
                    </div>

                    {/* Tool Section */}
                    <section id="image-to-image-tool" className="py-16">
                        <div className="container">
                            <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl text-center">
                                {content.Tool_Title}
                            </h2>
                            <div className="max-w-4xl mx-auto">
                                <ToolLoader toolId="image-to-image" />
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
                        <ToolNavigation currentTool="image-to-image" />
                    </Suspense>

                    {/* CTA Section */}
                    <section className="py-20">
                        <div className="px-8">
                            <div className='flex items-center justify-center rounded-2xl bg-[url("/imgs/masks/circle.svg")] bg-cover bg-center px-8 py-12 text-center md:p-16'>
                                <div className="mx-auto max-w-2xl">
                                    <h2 className="mb-4 text-balance text-3xl font-semibold md:text-5xl">
                                        Ready to Transform Your Images?
                                    </h2>
                                    <p className="text-muted-foreground md:text-lg mb-8">
                                        Upload any image and discover endless creative possibilities with AI-powered transformations.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <a href="#image-to-image-tool" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                                            Start Transforming - It's Free!
                                        </a>
                                        <a href="/ai-tools/image" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                            Explore More Image Tools
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