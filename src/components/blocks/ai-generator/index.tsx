import AIImageGenerator from "@/components/AI Image";
import { Section } from "@/types/blocks/section";

export default function AIGeneratorBlock({ section }: { section: Section }) {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* 标题区域 */}
        {(section.title || section.description) && (
          <div className="mx-auto max-w-2xl text-center mb-12">
            {section.title && (
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {section.title}
              </h2>
            )}
            {section.description && (
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                {section.description}
              </p>
            )}
          </div>
        )}
        
        {/* AI 图片生成器组件 */}
        <AIImageGenerator />
      </div>
    </section>
  );
}