import { type Metadata } from "next";
import HeroBg from "@/components/blocks/hero/bg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap, Shield, Heart } from "lucide-react";
import Link from "next/link";
import { TOOLS_CONFIG, getToolsByCategory, getToolCategories } from "@/config/tools";

export const metadata: Metadata = {
  title: "AI Tools Gallery - FreeQwenImage",
  description: "Browse our comprehensive collection of free AI-powered tools for image generation, enhancement, and video creation.",
  keywords: ["AI tools", "free AI", "image generator", "AI art", "image enhancement", "video generation", "creative tools"],
};

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast",
    description: "Generate results in seconds with our optimized AI models"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "100% Free",
    description: "No hidden fees, no subscriptions, no registration required"
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Professional Quality",
    description: "High-resolution outputs suitable for commercial use"
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "User Friendly",
    description: "Intuitive interface designed for creators of all levels"
  }
];

const categoryInfo = {
  image: {
    title: "Image Tools",
    description: "Create, enhance, and transform images with AI",
    gradient: "from-blue-500 to-purple-600"
  },
  video: {
    title: "Video Tools", 
    description: "Bring your images to life with AI animation",
    gradient: "from-purple-500 to-pink-600"
  },
  audio: {
    title: "Audio Tools",
    description: "Generate and process audio with AI",
    gradient: "from-green-500 to-teal-600"
  },
  text: {
    title: "Text Tools",
    description: "AI-powered text generation and processing",
    gradient: "from-orange-500 to-red-600"
  }
};

export default function ToolsGalleryPage() {
  const categories = getToolCategories();
  const activeTools = TOOLS_CONFIG.filter(tool => tool.status === 'active');

  return (
    <>
      <HeroBg />
      <section className="py-24">
        <div className="container">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4">AI Tools Gallery</Badge>
            <h1 className="mx-auto mb-6 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
              Free AI Tools for Every Creative Need
            </h1>
            <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
              Discover our comprehensive collection of AI-powered tools designed to enhance your creative workflow. 
              From image generation to video creation, all tools are completely free and require no registration.
            </p>
          </div>

          {/* Quick Access to Workspace */}
          <div className="text-center mb-16">
            <Button size="lg" asChild className="mr-4">
              <Link href="/ai-tools">
                进入AI工作区
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#tools-gallery">
                浏览工具
              </Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tools by Category */}
          <div id="tools-gallery" className="space-y-16">
            {categories.map(category => {
              const categoryTools = getToolsByCategory(category).filter(tool => tool.status === 'active');
              const info = categoryInfo[category];
              
              return (
                <section key={category} className="space-y-8">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${info.gradient} text-white mb-4`}>
                      <span className="text-2xl">
                        {category === 'image' && '🖼️'}
                        {category === 'video' && '🎬'}
                        {category === 'audio' && '🎵'}
                        {category === 'text' && '📝'}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{info.title}</h2>
                    <p className="text-muted-foreground text-lg">{info.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryTools.map(tool => (
                      <Card key={tool.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
                        <CardContent className="p-6">
                          {/* Tool Status Badge */}
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-2 text-2xl">
                              <span>{tool.icon.input}</span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              <span>{tool.icon.output}</span>
                            </div>
                            <div className="flex gap-1">
                              {tool.status === 'beta' && <Badge variant="secondary" className="text-xs">Beta</Badge>}
                              {tool.pricing === 'free' && <Badge variant="outline" className="text-xs">Free</Badge>}
                            </div>
                          </div>
                          
                          {/* Tool Info */}
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {tool.description}
                          </p>
                          
                          {/* Features */}
                          <div className="flex flex-wrap gap-1 mb-6">
                            {tool.features.slice(0, 3).map(feature => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                          
                          {/* Action Button */}
                          <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
                            <Link href={`/ai-tools?tool=${tool.id}`}>
                              Try {tool.name}
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}