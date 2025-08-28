import { type Metadata } from "next";
import HeroBg from "@/components/blocks/hero/bg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Play, Sparkles, Zap, Film } from "lucide-react";
import Link from "next/link";
import { getToolsByCategory } from "@/config/tools";
import ToolCard from "@/components/ai-tools/tool-card";

export const metadata: Metadata = {
  title: "AI Video Tools - Free Video Generation & Animation",
  description: "Create stunning videos from images with AI. Transform static photos into dynamic animations and bring your visual content to life.",
  keywords: ["AI video tools", "image to video", "AI animation", "video generation", "free AI video", "photo animation"],
};

const videoFeatures = [
  {
    icon: <Film className="h-6 w-6" />,
    title: "Image to Video",
    description: "Transform static images into dynamic videos",
    color: "text-purple-600"
  },
  {
    icon: <Play className="h-6 w-6" />,
    title: "AI Animation",
    description: "Add realistic motion and effects to photos",
    color: "text-pink-600"
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Multiple Effects",
    description: "Choose from various animation styles",
    color: "text-blue-600"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "HD Quality",
    description: "Generate high-definition video output",
    color: "text-orange-600"
  }
];

const useCases = [
  {
    title: "Social Media Content",
    description: "Create engaging video posts for Instagram, TikTok, and other platforms",
    examples: ["Instagram Stories", "TikTok videos", "Facebook posts", "Twitter content"]
  },
  {
    title: "Marketing & Advertising",
    description: "Bring product photos and marketing materials to life",
    examples: ["Product demos", "Ad campaigns", "Brand storytelling", "Promotional content"]
  },
  {
    title: "Creative Projects",
    description: "Add motion to artwork, portraits, and creative photography",
    examples: ["Art animations", "Portrait videos", "Creative effects", "Artistic motion"]
  },
  {
    title: "Presentations",
    description: "Make presentations more engaging with animated visuals",
    examples: ["Business presentations", "Educational content", "Slideshow enhancement", "Visual storytelling"]
  }
];

const animationStyles = [
  { name: "Subtle Motion", description: "Gentle, natural movement effects" },
  { name: "Dynamic Action", description: "Energetic, dramatic animations" },
  { name: "Cinematic", description: "Movie-like camera movements" },
  { name: "Artistic", description: "Creative, stylized animations" },
  { name: "Parallax", description: "Depth-based layered motion" },
  { name: "Morphing", description: "Shape and form transformations" }
];

export default function VideoToolsPage() {
  const videoTools = getToolsByCategory('video').filter(tool => tool.status === 'active');

  return (
    <>
      <HeroBg />
      <section className="py-24">
        <div className="container">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white mb-6">
              <span className="text-2xl">🎬</span>
            </div>
            <Badge className="mb-4">AI Video Tools</Badge>
            <h1 className="mx-auto mb-6 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
              Bring Your Images to Life with AI
            </h1>
            <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
              Transform static images into dynamic videos with AI-powered animation. 
              Create engaging content for social media, marketing, and creative projects.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {videoFeatures.map((feature, index) => (
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
              <h2 className="text-3xl font-bold mb-4">Available Video Tools</h2>
              <p className="text-muted-foreground text-lg">
                Transform your images into captivating videos
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {/* Animation Styles */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Animation Styles</h2>
              <p className="text-muted-foreground text-lg">
                Choose from various animation effects to match your creative vision
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animationStyles.map((style, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-2">{style.name}</h3>
                  <p className="text-muted-foreground text-sm">{style.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Perfect for Every Project</h2>
              <p className="text-muted-foreground text-lg">
                Discover how AI video generation can enhance your content
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

          {/* Process Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground text-lg">
                Simple steps to create amazing videos from your images
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload Image</h3>
                <p className="text-muted-foreground text-sm">
                  Choose any photo or image you want to animate
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Select Style</h3>
                <p className="text-muted-foreground text-sm">
                  Choose animation style and motion effects
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Generate Video</h3>
                <p className="text-muted-foreground text-sm">
                  AI creates your animated video in seconds
                </p>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <div className="px-8">
              <div className='flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-12 text-center md:p-16 text-white'>
                <div className="mx-auto max-w-2xl">
                  <h2 className="mb-4 text-balance text-3xl font-semibold md:text-5xl">
                    Ready to Create Amazing Videos?
                  </h2>
                  <p className="text-purple-100 md:text-lg mb-8">
                    Transform your static images into dynamic, engaging videos with AI-powered animation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" asChild>
                      <Link href="/ai-tools/video/image-to-video">
                        Start Creating Videos
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