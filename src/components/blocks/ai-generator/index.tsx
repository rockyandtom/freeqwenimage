import AIImageGenerator from "@/components/AI Image";
import { Section } from "@/types/blocks/section";

export default function AIGeneratorBlock({ section }: { section: Section }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* AI 图片生成器组件 */}
        <AIImageGenerator />
      </div>
    </section>
  );
}