import { type Metadata } from "next";
import HeroBg from "@/components/blocks/hero/bg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap, Palette, Wand2 } from "lucide-react";
import Link from "next/link";
import { getToolsByCategory } from "@/config/tools";
import ToolCard from "@/components/ai-tools/tool-card";

export const metadata: Metadata = {
  title: "AI Image Tools - Free Image Generation & Enhancement",
  description: "Discover our collection of free AI-powered image tools. Generate images from text, enhance quality, transform styles, and more. Professional results in seconds.",
  keywords: ["AI image tools", "image generator", "image enhancement", "AI art", "image editing", "free AI tools"],
};

const imageFeatures = [
  {
    icon: <Wand2 className="h-6 w-6" />,
    title: "Text to Image",
    description: "Create stunning images from text descriptions",
    color: "text-blue-600"
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Image Enhancement",
    description: "Upscale and improve image quality with AI",
    color: "text-purple-600"
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "Style Transfer",
    description: "Transform images with artistic styles",
    color: "text-pink-600"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Fast Processing",
    description: "Get results in seconds, not minutes",
    color: "text-orange-600"
  }
];

const useCases = [
  {
    title: "Content Creation",
    description: "Generate unique visuals for blogs, social media, and marketing materials",
    examples: ["Blog illustrations", "Social media posts", "Marketing banners"]
  },
  {
    title: "Design & Art",
    description: "Create concept art, illustrations, and design mockups",
    examples: ["Concept art", "Character designs", "Product mockups"]
  },
  {
    title: "Photo Enhancement",
    description: "Improve photo quality, remove noise, and upscale resolution",
    examples: ["Photo restoration", "Quality improvement", "Resolution upscaling"]
  },
  {
    title: "Creative Projects",
    description: "Explore artistic styles and creative transformations",
    examples: ["Style experiments", "Artistic filters", "Creative edits"]
  }
];

export default function ImageToolsPage() {
  const imageTools = getToolsByCategory('image').filter(tool => tool.status === 'active');

  return (
    <>
      <HeroBg />
      <section className="py-24">
        <div className="container">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-6">
              <span className="text-2xl">🖼️</span>
            </div>
            <Badge className="mb-4">AI Image Tools</Badge>
            <h1 className="mx-auto mb-6 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
              Professional AI Image Tools
            </h1>
            <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
              Transform your creative workflow with our collection of free AI-powered image tools. 
              Generate, enhance, and transform images with professional quality results.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {imageFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-4 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tools Grid */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Available Image Tools</h2>
              <p className="text-muted-foreground text-lg">
                Choose from our collection of specialized AI image tools
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imageTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Perfect for Every Creative Need</h2>
              <p className="text-muted-foreground text-lg">
                Discover how our AI image tools can enhance your projects
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {useCases.map((useCase, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                  <p className="text-muted-foreground mb-4">{useCase.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {useCase.examples.map(example => (
                      <Badge key={example} variant="outline" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Comparison Table */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Tool Comparison</h2>
              <p className="text-muted-foreground text-lg">
                Compare features to find the right tool for your needs
              </p>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4 font-semibold">Tool</th>
                        <th className="text-left p-4 font-semibold">Input</th>
                        <th className="text-left p-4 font-semibold">Output</th>
                        <th className="text-left p-4 font-semibold">Best For</th>
                        <th className="text-left p-4 font-semibold">Speed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {imageTools.map(tool => (
                        <tr key={tool.id} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center space-x-1 text-lg">
                                <span>{tool.icon.input}</span>
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                <span>{tool.icon.output}</span>
                              </div>
                              <div>
                                <div className="font-medium">{tool.name}</div>
                                <div className="text-sm text-muted-foreground">{tool.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm">
                            {tool.id === 'text-to-image' && 'Text prompt'}
                            {tool.id === 'image-enhancer' && 'Image file'}
                            {tool.id === 'image-to-image' && 'Image + prompt'}
                          </td>
                          <td className="p-4 text-sm">
                            {tool.id === 'text-to-image' && 'Generated image'}
                            {tool.id === 'image-enhancer' && 'Enhanced image'}
                            {tool.id === 'image-to-image' && 'Transformed image'}
                          </td>
                          <td className="p-4 text-sm">
                            {tool.features.slice(0, 2).join(', ')}
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="text-xs">
                              10-30s
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <div className="px-8">
              <div className='flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center md:p-16 text-white'>
                <div className="mx-auto max-w-2xl">
                  <h2 className="mb-4 text-balance text-3xl font-semibold md:text-5xl">
                    Ready to Create Amazing Images?
                  </h2>
                  <p className="text-blue-100 md:text-lg mb-8">
                    Start with any of our AI image tools and bring your creative vision to life.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" asChild>
                      <Link href="/ai-tools/image/text-to-image">
                        Start with Text to Image
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600" asChild>
                      <Link href="/ai-tools">
                        View All Tools
                      </Link>
                    </Button>
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