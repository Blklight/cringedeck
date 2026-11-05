import { useState } from "react";
import type { ShowcaseCategory } from "@/components/showcase/types";
import { ChamferBadge } from "@/components/ui/chamfer-badge";
import { ChamferButton } from "@/components/ui/chamfer-button";
import {
  ChamferCard,
  ChamferCardContent,
  ChamferCardDescription,
  ChamferCardHeader,
  ChamferCardTitle,
} from "@/components/ui/chamfer-card";
import {
  ChamferCommand,
  ChamferCommandBR,
  ChamferCommandDialog,
  ChamferCommandEmpty,
  ChamferCommandGroup,
  ChamferCommandInput,
  ChamferCommandItem,
  ChamferCommandList,
} from "@/components/ui/chamfer-command";
import {
  ChamferDialog,
  ChamferDialogClose,
  ChamferDialogContent,
  ChamferDialogTrigger,
  ChamferSheetContent,
} from "@/components/ui/chamfer-dialog";
import { CornerFrame } from "@/components/ui/corner-frame";
import { FilletCard } from "@/components/ui/fillet-card";
import { FlipCard } from "@/components/ui/flip-card";

function ChamferCardDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ChamferCard corners={["tl", "br"]} size="lg">
        <ChamferCardHeader>
          <ChamferCardTitle>Dois cantos</ChamferCardTitle>
          <ChamferCardDescription>tl + br, tamanho lg</ChamferCardDescription>
        </ChamferCardHeader>
        <ChamferCardContent>
          Contorno de 1px acompanha as diagonais.
        </ChamferCardContent>
      </ChamferCard>
      <ChamferCard corners="all" size="xs">
        <ChamferCardHeader>
          <ChamferCardTitle>Todos os cantos</ChamferCardTitle>
          <ChamferCardDescription>tamanho xs</ChamferCardDescription>
        </ChamferCardHeader>
      </ChamferCard>
      <ChamferCard shape="smooth" size="lg" radius={4}>
        <ChamferCardHeader>
          <ChamferCardTitle>Suavizado</ChamferCardTitle>
          <ChamferCardDescription>shape="smooth"</ChamferCardDescription>
        </ChamferCardHeader>
      </ChamferCard>
      <ChamferCard corners={["br"]} rounded={16} size="lg">
        <ChamferCardHeader>
          <ChamferCardTitle>Chanfro + arredondado</ChamferCardTitle>
          <ChamferCardDescription>rounded=16</ChamferCardDescription>
        </ChamferCardHeader>
      </ChamferCard>
      <FilletCard corners={["tl", "br"]} size="lg" radius={4}>
        <div className="p-6 text-sm">FilletCard</div>
      </FilletCard>
    </div>
  );
}

function ChamferButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ChamferButton>Default</ChamferButton>
      <ChamferButton variant="secondary" corner="tr">
        Secondary
      </ChamferButton>
      <ChamferButton variant="ghost" corner="tl">
        Ghost
      </ChamferButton>
      <ChamferButton variant="destructive" corner="bl">
        Destructive
      </ChamferButton>
      <ChamferButton shape="smooth">Smooth</ChamferButton>
      <ChamferButton rounded={8}>Rounded</ChamferButton>
      <ChamferButton size="lg">Large</ChamferButton>
    </div>
  );
}

function ChamferBadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ChamferBadge>Default</ChamferBadge>
      <ChamferBadge variant="secondary">Secondary</ChamferBadge>
      <ChamferBadge variant="outline">Outline</ChamferBadge>
      <ChamferBadge shape="smooth">Smooth</ChamferBadge>
      <ChamferBadge rounded={6}>Rounded</ChamferBadge>
    </div>
  );
}

function FlipCardDemo() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <FlipCard front={<p>Frente (clique)</p>} back={<p>Verso</p>} />
      <FlipCard
        axis="x"
        trigger="peel"
        corners={["tr"]}
        front={<p>Eixo X, orelha</p>}
        back={<p>Verso</p>}
      />
      <FlipCard
        shape="smooth"
        corners={["br"]}
        rounded={16}
        front={<p>Suavizado</p>}
        back={<p>Verso</p>}
      />
    </div>
  );
}

function ChamferDialogDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <ChamferDialog>
        <ChamferDialogTrigger render={<ChamferButton corner="br" />}>
          Dialog
        </ChamferDialogTrigger>
        <ChamferDialogContent
          sticky
          title="Vaga"
          description="Dialog com header e footer fixos."
          footer={
            <ChamferDialogClose render={<ChamferButton variant="secondary" />}>
              Fechar
            </ChamferDialogClose>
          }
        >
          <p className="text-sm text-muted-foreground">Conteúdo do dialog.</p>
        </ChamferDialogContent>
      </ChamferDialog>
      <ChamferDialog>
        <ChamferDialogTrigger
          render={<ChamferButton corner="tl" variant="secondary" />}
        >
          Sheet
        </ChamferDialogTrigger>
        <ChamferSheetContent
          shape="smooth"
          title="Sheet"
          description="Lateral direita."
        >
          <p className="text-sm text-muted-foreground">Conteúdo do sheet.</p>
        </ChamferSheetContent>
      </ChamferDialog>
    </div>
  );
}

function CommandItems() {
  return (
    <>
      <ChamferCommandInput placeholder="Buscar…" />
      <ChamferCommandList>
        <ChamferCommandEmpty>Nada encontrado.</ChamferCommandEmpty>
        <ChamferCommandGroup heading="Sugestões">
          <ChamferCommandItem>Calendário</ChamferCommandItem>
          <ChamferCommandItem>Buscar emoji</ChamferCommandItem>
          <ChamferCommandItem>Calculadora</ChamferCommandItem>
        </ChamferCommandGroup>
      </ChamferCommandList>
    </>
  );
}

function ChamferCommandDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ChamferCommand shape="smooth" size="lg">
        <CommandItems />
      </ChamferCommand>
      <ChamferCommandBR>
        <CommandItems />
      </ChamferCommandBR>
      <div>
        <ChamferButton onClick={() => setOpen(true)}>
          Abrir paleta
        </ChamferButton>
        <ChamferCommandDialog open={open} onOpenChange={setOpen}>
          <CommandItems />
        </ChamferCommandDialog>
      </div>
    </div>
  );
}

function CornerFrameDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <CornerFrame className="p-6 text-sm">Padrão (md)</CornerFrame>
      <CornerFrame
        className="p-6 text-sm"
        cornerSize="sm"
        corners={["tl", "br"]}
        color="var(--primary)"
        cornerOpacity={1}
      >
        Cor + tl/br
      </CornerFrame>
      <CornerFrame
        className="p-6 text-sm"
        cornerSize={[20, 8]}
        cornerOffset={4}
      >
        Assimétrico + offset
      </CornerFrame>
    </div>
  );
}

export const chamferCategory: ShowcaseCategory = {
  id: "chamfer",
  title: "Chamfer",
  items: [
    { slug: "chamfer-badge", name: "Chamfer Badge", demo: ChamferBadgeDemo },
    { slug: "chamfer-button", name: "Chamfer Button", demo: ChamferButtonDemo },
    { slug: "chamfer-card", name: "Chamfer Card", demo: ChamferCardDemo },
    {
      slug: "chamfer-command",
      name: "Chamfer Command",
      demo: ChamferCommandDemo,
    },
    { slug: "chamfer-dialog", name: "Chamfer Dialog", demo: ChamferDialogDemo },
    { slug: "corner-frame", name: "Corner Frame", demo: CornerFrameDemo },
    { slug: "flip-card", name: "Flip Card", demo: FlipCardDemo },
  ],
};
