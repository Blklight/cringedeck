import type { Metadata } from "next";
import { Suspense } from "react";

import { ShowcasePage } from "@/components/showcase/showcase-page";

export const metadata: Metadata = {
  title: "Componentes",
};

export default function ComponentsPage() {
  return (
    <Suspense>
      <ShowcasePage />
    </Suspense>
  );
}
