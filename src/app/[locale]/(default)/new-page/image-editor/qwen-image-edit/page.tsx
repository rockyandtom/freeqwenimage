import { Metadata } from "next";
import HeroBg from "@/components/blocks/hero/bg";
import { Badge } from "@/components/ui/badge";
import ClothingChangeTool from "@/components/clothing-change-tool";
import React from 'react';

export const metadata: Metadata = {
    title: "Qwen Image Edit: Free AI Image Editing with Qwen",
    description: "Unlock the full potential of your images with free Qwen Image Edit powered by FreeQwenImage. Our AI-powered tools help you create stunning visuals with ease.",
};

const content = {
  "H1_Main_Title": "Unlock Your Creative Potential with Qwen Image Edit",
  "H1_Sub_Title": "Welcome to Qwen Image Edit, your gateway to advanced AI-powered image editing. Our platform harnesses the cutting-edge capabilities of Qwen's AI technology to provide you with professional-grade image editing tools that are both powerful and accessible.",
  "Tool_Title": "Qwen Image Edit",
  "Tool_Description": "Experience the power of AI-driven image editing with our advanced Qwen-powered tools",
  "Content_Sections": [
    {
      "H2_Subtitle": "The Power Behind Free Qwen Image Edit",
      "Paragraphs": [
        "At the heart of our platform lies a robust **Qwen Image Edit** model, fine-tuned for a wide range of creative applications. This model is built on the latest advancements in AI and machine learning, allowing it to understand context and intent with remarkable precision.",
        "Unlike generic tools, our **Qwen Image Edit** system has been trained on a massive and diverse dataset, enabling it to handle everything from subtle color adjustments to dramatic stylistic changes. This means whether you are trying to give your photo a vintage look or a futuristic feel, the **Qwen Image Edit** engine can deliver.",
        "The core technology focuses on non-destructive editing, so you can experiment freely without worrying about losing your original work. This user-friendly approach ensures that artists of all skill levels can explore their creativity without limitations."
      ]
    },
    {
      "H2_Subtitle": "Integrating ComfyUI with Qwen Image Edit",
      "Paragraphs": [
        "For advanced users and developers, we offer deep integration with **ComfyUI**, a powerful and modular Stable Diffusion graphical interface. This synergy allows you to harness the full potential of our **Qwen Image Edit** capabilities within a highly customizable workflow.",
        "By connecting our **Qwen Image Edit** model to **ComfyUI**, you can create complex node graphs for tasks such as intricate image compositing, advanced inpainting, and precise control over generative outputs. This opens up a new realm of possibilities, allowing you to automate repetitive tasks, build custom pipelines, and achieve levels of detail and control that are simply not possible with traditional editing software.",
        "The integration is seamless and designed to provide a flexible and powerful environment for those who want to push the boundaries of what's possible with **Qwen Image Edit**. We provide detailed documentation and examples to help you get started, ensuring that you can quickly begin creating stunning images with unparalleled precision."
      ]
    },
    {
      "H2_Subtitle": "Unleash Creativity with Free Qwen Image Edit and AI Image Generation",
      "Paragraphs": [
        "The combination of **Qwen Image Edit** and **AI image generation** represents a revolutionary approach to digital creativity. Our platform seamlessly integrates these two powerful technologies to provide an unparalleled creative experience.",
        "With **Qwen Image Edit**, you can not only enhance existing images but also generate entirely new visuals based on your creative vision. The **AI image generation** component allows you to create images from text descriptions, while **Qwen Image Edit** enables you to refine and perfect these generated images with surgical precision.",
        "This dual approach means you can start with a text prompt to generate a base image, then use **Qwen Image Edit** to add specific details, adjust colors, remove unwanted elements, or apply artistic styles. The synergy between generation and editing creates a workflow that is both efficient and creatively liberating."
      ]
    },
    {
      "H2_Subtitle": "Advanced Features of Qwen Image Edit for Professionals",
      "Paragraphs": [
        "Professional users will find that **Qwen Image Edit** offers a comprehensive suite of advanced features designed to meet the demanding requirements of commercial work. Our platform supports high-resolution processing up to 4K, ensuring that your edits maintain crisp detail even for large-format applications.",
        "The **Qwen Image Edit** system includes sophisticated masking capabilities that allow for precise selection and editing of complex subjects like hair, fur, and transparent objects. For batch processing, we offer automated workflows that can apply consistent edits across multiple images, saving valuable time for photographers and designers.",
        "The color grading tools in **Qwen Image Edit** provide cinema-quality results, with support for professional color spaces and LUTs. Additionally, our platform includes advanced retouching tools that can remove blemishes, smooth skin, and enhance features while maintaining a natural appearance."
      ]
    },
    {
      "H2_Subtitle": "Get Started with Free Qwen Image Edit Today",
      "Paragraphs": [
        "Starting your creative journey with **Qwen Image Edit** is incredibly straightforward. Simply upload your image to our platform, and you'll immediately have access to our full suite of AI-powered editing tools. There's no software to download, no account required for basic features, and no hidden costs.",
        "Our intuitive interface guides you through the editing process, with helpful tooltips and examples for each feature. For those new to AI image editing, we offer preset styles and one-click enhancements that deliver impressive results instantly. More experienced users can dive deep into manual controls and advanced settings to achieve precise creative outcomes.",
        "The **Qwen Image Edit** platform is designed to grow with you, offering both simplicity for beginners and depth for professionals. Whether you're editing a single photo or working on a complex creative project, our platform scales to meet your needs."
      ]
    }
  ],
  "FAQ_Section": {
    "Title": "Frequently Asked Questions about Qwen Image Edit",
    "Subtitle": "Everything you need to know about our AI-powered image editing platform.",
    "FAQs": [
      {
        "Question": "What is Qwen Image Edit?",
        "Answer": "**Qwen Image Edit** is an advanced AI-powered image editing platform that uses Qwen's cutting-edge machine learning technology to provide professional-grade image editing capabilities. It allows users to enhance, modify, and transform images using intuitive AI-driven tools without requiring extensive technical knowledge."
      },
      {
        "Question": "Is the Qwen Image Edit platform really free?",
        "Answer": "Yes, our **Qwen Image Edit** platform is completely free to use. We believe in democratizing access to powerful AI tools, and we are committed to providing our core services without any cost or hidden fees."
      },
      {
        "Question": "What kind of edits can I perform with Qwen Image Edit?",
        "Answer": "**Qwen Image Edit** can handle a wide range of tasks, including but not limited to: removing objects, changing backgrounds, applying stylistic effects, generating new content within an image, and much more. The possibilities are vast."
      },
      {
        "Question": "Do I need to download any software to use Qwen Image Edit?",
        "Answer": "No, our **Qwen Image Edit** platform is entirely web-based. You can access all the tools directly from your browser without needing to download or install any software. This makes it convenient and accessible from any device."
      },
      {
        "Question": "What is the difference between Qwen Image Edit and other AI tools?",
        "Answer": "**Qwen Image Edit** is specifically optimized for image editing tasks, built on Qwen's advanced AI architecture. Unlike generic AI tools, our platform has been fine-tuned specifically for creative applications, delivering superior results for image editing tasks. Additionally, we are completely free to use with no feature limitations."
      },
      {
        "Question": "How does Qwen Image Edit ensure image quality?",
        "Answer": "Our **Qwen Image Edit** platform uses state-of-the-art AI models trained on high-quality datasets to ensure that all edits maintain professional standards. The system preserves fine details, maintains color accuracy, and ensures that all modifications look natural and seamless."
      }
    ]
  }
};

const QwenImageEditPage = () => {
    return (
        <>
            <HeroBg />
            <section className="py-24">
                <div className="container">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
                            {content.H1_Main_Title}
                        </h1>
                        <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                            {content.H1_Sub_Title}
                        </p>
                    </div>

                    {/* Tool Section */}
                    <section id="qwen-image-edit-tool" className="py-16">
                        <div className="container">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold mb-4">{content.Tool_Title}</h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    {content.Tool_Description}
                                </p>
                            </div>
                            <div className="max-w-4xl mx-auto">
                                <ClothingChangeTool />
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

                    {/* CTA Section */}
                    <section className="py-20">
                        <div className="px-8">
                            <div className='flex items-center justify-center rounded-2xl bg-[url("/imgs/masks/circle.svg")] bg-cover bg-center px-8 py-12 text-center md:p-16'>
                                <div className="mx-auto max-w-(--breakpoint-md)">
                                    <h2 className="mb-4 text-balance text-3xl font-semibold md:text-5xl">
                                        Ready to Transform Your Images with AI?
                                    </h2>
                                    <p className="text-muted-foreground md:text-lg">
                                        Experience the power of Qwen Image Edit and unlock your creative potential today.
                                    </p>
                                    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                                        <a href="#qwen-image-edit-tool" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                                            Try Qwen Image Edit - It's Free!
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
};

export default QwenImageEditPage;