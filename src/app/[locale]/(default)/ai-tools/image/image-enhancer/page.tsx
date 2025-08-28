import { type Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import ToolLoader from "@/components/tools/_base/tool-loader";
import { Suspense, lazy } from "react";

// 懒加载组件
const HeroBg = lazy(() => import("@/components/blocks/hero/bg"));
const ToolNavigation = lazy(() => import("@/components/ai-tools/tool-navigation"));

export const metadata: Metadata = {
    title: "Free AI Image Enhancer - Improve Photo Quality Instantly",
    description: "Enhance your images with AI technology. Improve photo quality, increase resolution, reduce noise, and sharpen details automatically. Free and easy to use.",
    keywords: ["AI image enhancer", "photo enhancement", "image quality improvement", "upscale images", "denoise photos", "sharpen images"],
};

const content = {
    "H1_Main_Title": "AI Image Enhancer: Transform Your Photos Instantly",
    "H1_Sub_Title": "Enhance image quality with advanced AI technology. Automatically improve resolution, reduce noise, sharpen details, and optimize colors for stunning results.",
    "Tool_Title": "Try Our Free AI Image Enhancer",
    "Content_Sections": [
        {
            "H2_Subtitle": "How AI Image Enhancement Works",
            "Paragraphs": [
                "Our **AI Image Enhancer** uses advanced machine learning algorithms trained on millions of high-quality images to understand what makes a photo look great. When you upload an image, our AI analyzes every pixel to identify areas that can be improved.",
                "The enhancement process includes **intelligent upscaling**, **noise reduction**, **detail sharpening**, and **color optimization**. Unlike traditional filters, our AI makes context-aware adjustments that preserve the natural look of your photos while dramatically improving their quality."
            ]
        },
        {
            "H2_Subtitle": "Professional Results in Seconds",
            "Paragraphs": [
                "Transform **blurry photos** into sharp, detailed images, **increase resolution** without losing quality, **remove noise** from low-light photos, and **enhance colors** to make them more vibrant and natural-looking.",
                "Perfect for **photographers**, **content creators**, **e-commerce businesses**, and anyone who wants to improve their image quality. Our AI enhancement works on portraits, landscapes, product photos, and any type of digital image."
            ]
        },
        {
            "H2_Subtitle": "Advanced AI Technology Features",
            "Paragraphs": [
                "Our **Image Enhancer** offers **super-resolution upscaling** to increase image size up to 4x without quality loss, **intelligent denoising** that removes grain while preserving important details, and **adaptive sharpening** that enhances edges and textures.",
                "The AI also performs **automatic color correction**, **brightness optimization**, and **contrast enhancement** to bring out the best in every image. All enhancements are applied automatically with no manual adjustments needed."
            ]
        }
    ],
    "FAQ_Section": {
        "Title": "Frequently Asked Questions about AI Image Enhancement",
        "Subtitle": "Everything you need to know about improving your photos with AI.",
        "FAQs": [
            {
                "Question": "What types of images can I enhance?",
                "Answer": "Our AI works with **all types of photos** including portraits, landscapes, product images, old photos, and digital artwork. It supports **JPG**, **PNG**, and **WEBP** formats up to **10MB** in size."
            },
            {
                "Question": "How much can the AI improve my images?",
                "Answer": "Results vary depending on the original image quality, but you can expect **significant improvements** in sharpness, clarity, and color vibrancy. The AI can **upscale images up to 4x** their original resolution while maintaining quality."
            },
            {
                "Question": "How long does image enhancement take?",
                "Answer": "Most images are enhanced in **15-30 seconds** depending on size and complexity. The AI processes images in the cloud, so you don't need powerful hardware on your device."
            },
            {
                "Question": "Will the enhanced image look natural?",
                "Answer": "Yes! Our AI is trained to make **natural-looking enhancements** that improve quality without creating artificial or over-processed results. The enhanced images maintain the original character and style."
            },
            {
                "Question": "Can I enhance multiple images at once?",
                "Answer": "Currently, you can enhance one image at a time to ensure the best quality results. Each image receives individual attention from our AI algorithms for optimal enhancement."
            },
            {
                "Question": "Is my uploaded image stored or shared?",
                "Answer": "Your privacy is important to us. Uploaded images are **processed securely** and **automatically deleted** from our servers after processing. We never store, share, or use your images for any other purpose."
            }
        ]
    }
};

export default function ImageEnhancerPage() {
    return (
        <>
            <Suspense fallback={<div className="fixed inset-0 bg-gradient-to-br from-background to-muted" />}>
                <HeroBg />
            </Suspense>
            <section className="py-24">
                <div className="container">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <Badge className="mb-4">AI Image Enhancement</Badge>
                        <h1 className="mx-auto mb-6 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
                            {content.H1_Main_Title}
                        </h1>
                        <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                            {content.H1_Sub_Title}
                        </p>
                    </div>

                    {/* Tool Section */}
                    <section id="image-enhancer-tool" className="py-16">
                        <div className="container">
                            <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl text-center">
                                {content.Tool_Title}
                            </h2>
                            <div className="max-w-4xl mx-auto">
                                <ToolLoader toolId="image-enhancer" />
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
                        <ToolNavigation currentTool="image-enhancer" />
                    </Suspense>

                    {/* CTA Section */}
                    <section className="py-20">
                        <div className="px-8">
                            <div className='flex items-center justify-center rounded-2xl bg-[url("/imgs/masks/circle.svg")] bg-cover bg-center px-8 py-12 text-center md:p-16'>
                                <div className="mx-auto max-w-2xl">
                                    <h2 className="mb-4 text-balance text-3xl font-semibold md:text-5xl">
                                        Ready to Enhance Your Images?
                                    </h2>
                                    <p className="text-muted-foreground md:text-lg mb-8">
                                        Upload any photo and watch our AI transform it into a high-quality, professional-looking image.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <a href="#image-enhancer-tool" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                                            Start Enhancing - It's Free!
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