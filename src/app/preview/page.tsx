import { notFound } from "next/navigation";
import { LayoutBase } from "@/components/layout-base";
import { PreviewGallery } from "@/components/preview/preview-gallery";
import { isProduction } from "@/lib/env";

export default function PreviewPage() {
  if (isProduction) notFound();
  return (
    <LayoutBase>
      <PreviewGallery />
    </LayoutBase>
  );
}
