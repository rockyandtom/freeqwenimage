import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface ContentPageProps {
  meta: {
    title: string;
    description: string;
    h1: string;
  };
  content: Array<{
    h2?: string;
    p?: string | string[];
    image?: {
      src: string;
      alt: string;
    };
  }>;
}

const renderParagraph = (text: string) => {
  // This will handle **bold** text.
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default function ContentPage({ meta, content }: ContentPageProps) {
  return (
    <section className="container py-16">
      <div className="mx-auto mb-12 text-center">
        <h1 className="mb-6 text-pretty text-4xl font-bold lg:text-5xl">
          {meta.h1}
        </h1>
        <p className="mb-4 max-w-3xl mx-auto text-muted-foreground lg:text-lg">
          {meta.description}
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {content.map((item, index) => {
          const isFAQ = item.h2 && item.h2.toUpperCase().startsWith("FAQ");
          return (
            <div key={index} className="mb-12">
              {item.h2 && (
                <div className="text-center mb-8">
                  {isFAQ && <Badge className="text-xs font-medium">FAQ</Badge>}
                  <h2 className="text-3xl font-bold mt-4">{item.h2}</h2>
                </div>
              )}

              {isFAQ ? (
                <div className="space-y-4">
                  {Array.isArray(item.p) &&
                    item.p.map((p, i) => {
                      const parts = p.split("?**");
                      if (parts.length === 2) {
                        const question = parts[0].replace("**", "") + "?";
                        const answer = parts[1].trim();
                        return (
                          <Card key={i} className="shadow-md">
                            <CardHeader>
                              <CardTitle className="text-lg text-left flex items-center">
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-xs mr-3">
                                  {i + 1}
                                </span>
                                {question}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground">{answer}</p>
                            </CardContent>
                          </Card>
                        );
                      }
                      return null;
                    })}
                </div>
              ) : (
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  {Array.isArray(item.p) ? (
                    item.p.map((para, pIndex) => (
                      <p key={pIndex}>{renderParagraph(para)}</p>
                    ))
                  ) : (
                    item.p && <p>{renderParagraph(item.p)}</p>
                  )}
                </div>
              )}

              {item.image && (
                <div className="mt-6">
                  <Card className="overflow-hidden shadow-lg">
                    <CardContent className="p-0">
                      <div className="relative aspect-[16/9] w-full overflow-hidden">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}