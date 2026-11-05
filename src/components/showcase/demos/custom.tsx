import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import type { ShowcaseCategory } from "@/components/showcase/types";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { AuroraText } from "@/components/ui/aurora-text";
import Book, {
  BookDescription,
  BookHeader,
  BookTitle,
} from "@/components/ui/book";
import { Button } from "@/components/ui/button";
import { ChoicePoll } from "@/components/ui/choice-poll";
import { DirectionAwareTabs } from "@/components/ui/direction-aware-tabs";
import { DitherShader } from "@/components/ui/dither-shader";
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from "@/components/ui/expandable-screen";
import FloatingPanel from "@/components/ui/floating-panel";
import { HoloCard } from "@/components/ui/holo-card";
import { MorphSurface } from "@/components/ui/morph-surface";
import { PollWidget } from "@/components/ui/poll-widget";
import {
  PopoverForm,
  PopoverFormButton,
  PopoverFormCutOutLeftIcon,
  PopoverFormCutOutRightIcon,
  PopoverFormSeparator,
  PopoverFormSuccess,
} from "@/components/ui/popover-form";
import {
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverLabel,
  PopoverForm as PopoverMotionForm,
  PopoverRoot,
  PopoverSubmitButton,
  PopoverTextarea,
  PopoverTrigger,
} from "@/components/ui/popover-motion";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import {
  defaultTerminalTabs,
  TerminalAnimationBlinkingCursor,
  TerminalAnimationCommandBar,
  TerminalAnimationContainer,
  TerminalAnimationContent,
  TerminalAnimationOutput,
  TerminalAnimationRoot,
  TerminalAnimationTabList,
  TerminalAnimationTabTrigger,
  TerminalAnimationTrailingPrompt,
  TerminalAnimationWindow,
} from "@/components/ui/terminal-animation";
import { TextAnimate } from "@/components/ui/text-animate";
import { TextureOverlay } from "@/components/ui/texture-overlay";
import { WashiTape } from "@/components/ui/washi-tape";

const ditherSrc =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='320'%3E%3Cdefs%3E%3CradialGradient id='g' cx='50%25' cy='50%25'%3E%3Cstop offset='0' stop-color='white'/%3E%3Cstop offset='1' stop-color='black'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='480' height='320' fill='url(%23g)'/%3E%3C/svg%3E";

const holoBackground =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='446'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%236d28d9'/%3E%3Cstop offset='1' stop-color='%23db2777'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='320' height='446' fill='url(%23g)'/%3E%3C/svg%3E";

const directionTabs = [
  {
    id: 0,
    label: "Visão geral",
    content: (
      <p className="text-muted-foreground text-sm">
        Transição direcional entre painéis com animação compartilhada.
      </p>
    ),
  },
  {
    id: 1,
    label: "Detalhes",
    content: (
      <p className="text-muted-foreground text-sm">
        O conteúdo acompanha a direção do movimento entre as abas.
      </p>
    ),
  },
  {
    id: 2,
    label: "Config",
    content: (
      <p className="text-muted-foreground text-sm">
        Ideal para painéis de configuração com pouco conteúdo.
      </p>
    ),
  },
];

const blurLines = [
  "Linha de conteúdo 1 para evidenciar o desfoque progressivo.",
  "Linha de conteúdo 2 para evidenciar o desfoque progressivo.",
  "Linha de conteúdo 3 para evidenciar o desfoque progressivo.",
  "Linha de conteúdo 4 para evidenciar o desfoque progressivo.",
  "Linha de conteúdo 5 para evidenciar o desfoque progressivo.",
  "Linha de conteúdo 6 para evidenciar o desfoque progressivo.",
  "Linha de conteúdo 7 para evidenciar o desfoque progressivo.",
  "Linha de conteúdo 8 para evidenciar o desfoque progressivo.",
  "Linha de conteúdo 9 para evidenciar o desfoque progressivo.",
  "Linha de conteúdo 10 para evidenciar o desfoque progressivo.",
  "Linha de conteúdo 11 para evidenciar o desfoque progressivo.",
  "Linha de conteúdo 12 para evidenciar o desfoque progressivo.",
].map((line) => (
  <p className="text-muted-foreground" key={line}>
    {line}
  </p>
));

const pollOptions = [
  { id: "dark", label: "Modo escuro" },
  { id: "realtime", label: "Tempo real" },
  { id: "export", label: "Exportação" },
];

function AnimatedThemeTogglerDemo() {
  return (
    <div className="flex items-center gap-3">
      <AnimatedThemeToggler className="inline-flex size-9 items-center justify-center rounded-md border [&_svg]:size-4">
        <Sun />
        <Moon />
      </AnimatedThemeToggler>
      <span className="text-muted-foreground text-sm">
        Alterna o tema com transição de view.
      </span>
    </div>
  );
}

function AuroraTextDemo() {
  return <AuroraText className="font-bold text-4xl">Blklight</AuroraText>;
}

function BookDemo() {
  return (
    <Book>
      <BookHeader>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
          Novo
        </span>
      </BookHeader>
      <BookTitle>Design System</BookTitle>
      <BookDescription>
        72 componentes base-vega prontos para compor.
      </BookDescription>
    </Book>
  );
}

function ChoicePollDemo() {
  return (
    <ChoicePoll.Root
      className="w-full max-w-md"
      defaultValue="next"
      showResults
      votes={{ next: 12, vite: 7, remix: 3 }}
    >
      <ChoicePoll.Header>
        <ChoicePoll.Title>Qual framework?</ChoicePoll.Title>
        <ChoicePoll.Description>
          Escolha uma opção para votar.
        </ChoicePoll.Description>
      </ChoicePoll.Header>
      <ChoicePoll.Options>
        <ChoicePoll.Option value="next">Next.js</ChoicePoll.Option>
        <ChoicePoll.Option value="vite">Vite</ChoicePoll.Option>
        <ChoicePoll.Option value="remix">Remix</ChoicePoll.Option>
      </ChoicePoll.Options>
    </ChoicePoll.Root>
  );
}

function DitherShaderDemo() {
  return (
    <DitherShader
      className="h-44 w-full overflow-hidden rounded-lg"
      colorMode="duotone"
      ditherMode="bayer"
      gridSize={1}
      primaryColor="#252525"
      secondaryColor="#eaeaea"
      src={ditherSrc}
      threshold={0.35}
    />
  );
}

function DirectionAwareTabsDemo() {
  return (
    <DirectionAwareTabs className="w-full max-w-md" tabs={directionTabs} />
  );
}

function ExpandableScreenDemo() {
  return (
    <ExpandableScreen>
      <ExpandableScreenTrigger>
        <Button variant="outline">Expandir</Button>
      </ExpandableScreenTrigger>
      <ExpandableScreenContent className="bg-background p-8">
        <h3 className="font-semibold text-xl">Conteúdo expandido</h3>
        <p className="mt-2 text-muted-foreground text-sm">
          O gatilho se transforma em uma tela cheia com animação compartilhada
          de layout.
        </p>
      </ExpandableScreenContent>
    </ExpandableScreen>
  );
}

function FloatingPanelDemo() {
  return (
    <FloatingPanel.Root>
      <FloatingPanel.Trigger title="Feedback">Feedback</FloatingPanel.Trigger>
      <FloatingPanel.Content>
        <FloatingPanel.Form>
          <FloatingPanel.Header>
            <FloatingPanel.Label htmlFor="showcase-floating-note">
              Nota
            </FloatingPanel.Label>
          </FloatingPanel.Header>
          <FloatingPanel.Body>
            <FloatingPanel.Textarea id="showcase-floating-note" />
          </FloatingPanel.Body>
          <FloatingPanel.Footer>
            <FloatingPanel.CloseButton />
            <FloatingPanel.SubmitButton />
          </FloatingPanel.Footer>
        </FloatingPanel.Form>
      </FloatingPanel.Content>
    </FloatingPanel.Root>
  );
}

function HoloCardDemo() {
  return (
    <HoloCard
      branding={{}}
      data={{
        name: "Julian",
        subtitle: "Design Engineer",
        description: "Membro fundador do Blklight.",
        primaryId: "001",
        secondaryInfo: "Desde 2024",
        backgroundImage: holoBackground,
        badge: "Blklight",
      }}
      height={320}
      width={230}
    />
  );
}

function MorphSurfaceDemo() {
  return <MorphSurface />;
}

function PollWidgetDemo() {
  return (
    <div className="w-full max-w-md">
      <PollWidget
        description="Seu voto ajuda a priorizar a roadmap."
        mode="inline"
        options={pollOptions}
        question="Qual recurso devemos construir agora?"
        votes={{ dark: 8, realtime: 14, export: 5 }}
      >
        <PollWidget.Content>
          <PollWidget.Question />
          <PollWidget.Options />
          <PollWidget.Submit />
        </PollWidget.Content>
      </PollWidget>
    </div>
  );
}

function PopoverFormDemo() {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [note, setNote] = useState("");

  return (
    <PopoverForm
      open={open}
      setOpen={setOpen}
      showSuccess={showSuccess}
      title="Deixe um comentário"
      openChild={
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!note) {
              return;
            }
            setShowSuccess(true);
          }}
        >
          <div className="px-4 pt-4">
            <label
              className="mb-1 block font-medium text-muted-foreground text-sm"
              htmlFor="showcase-popover-form-note"
            >
              Comentário
            </label>
            <textarea
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2"
              id="showcase-popover-form-note"
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              value={note}
            />
          </div>
          <div className="relative flex h-12 items-center px-[10px]">
            <PopoverFormSeparator />
            <div className="absolute top-0 left-0 -translate-x-[1.5px] -translate-y-1/2">
              <PopoverFormCutOutLeftIcon />
            </div>
            <div className="absolute top-0 right-0 translate-x-[1.5px] -translate-y-1/2 rotate-180">
              <PopoverFormCutOutRightIcon />
            </div>
            <PopoverFormButton loading={false} text="Enviar" />
          </div>
        </form>
      }
      successChild={
        <PopoverFormSuccess
          description="Obrigado pelo seu comentário!"
          title="Enviado"
        />
      }
    />
  );
}

function PopoverMotionDemo() {
  return (
    <PopoverRoot>
      <PopoverTrigger>Adicionar nota</PopoverTrigger>
      <PopoverContent>
        <PopoverMotionForm>
          <PopoverLabel>Nota</PopoverLabel>
          <PopoverTextarea />
          <PopoverFooter>
            <PopoverCloseButton />
            <PopoverSubmitButton />
          </PopoverFooter>
        </PopoverMotionForm>
      </PopoverContent>
    </PopoverRoot>
  );
}

function ProgressiveBlurDemo() {
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-lg border">
      <div className="flex h-full flex-col gap-3 p-4 text-sm">{blurLines}</div>
      <ProgressiveBlur position="bottom" />
    </div>
  );
}

function TerminalAnimationDemo() {
  return (
    <TerminalAnimationRoot
      alwaysDark
      className="w-full"
      tabs={defaultTerminalTabs}
    >
      <TerminalAnimationContainer className="mx-auto max-w-xl pt-0 md:pt-0">
        <TerminalAnimationWindow minHeight="18rem">
          <TerminalAnimationTabList className="flex gap-1 border-white/10 border-b px-4 py-2">
            {defaultTerminalTabs.map((tab, index) => (
              <TerminalAnimationTabTrigger
                className="data-[state=active]:bg-white/10 rounded px-3 py-1 text-neutral-400 text-xs data-[state=active]:text-neutral-100"
                index={index}
                key={tab.label}
              >
                {tab.label}
              </TerminalAnimationTabTrigger>
            ))}
          </TerminalAnimationTabList>
          <TerminalAnimationContent className="font-mono text-sm">
            <div className="flex gap-2">
              <span className="text-emerald-400">$</span>
              <TerminalAnimationCommandBar />
            </div>
            <TerminalAnimationOutput className="mt-2 flex flex-col" />
            <TerminalAnimationTrailingPrompt className="mt-2 flex gap-2">
              <span className="text-emerald-400">$</span>
              <TerminalAnimationBlinkingCursor />
            </TerminalAnimationTrailingPrompt>
          </TerminalAnimationContent>
        </TerminalAnimationWindow>
      </TerminalAnimationContainer>
    </TerminalAnimationRoot>
  );
}

function TextAnimateDemo() {
  return (
    <TextAnimate
      className="font-semibold text-2xl"
      delay={0.1}
      text="Animação de texto por palavras"
      type="fadeInUp"
    />
  );
}

function TextureOverlayDemo() {
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
      <TextureOverlay className="mix-blend-overlay" texture="grid" />
      <span className="relative z-10 flex h-full items-center justify-center font-semibold text-white">
        Texture Overlay
      </span>
    </div>
  );
}

function WashiTapeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4 p-6">
      <WashiTape color="pink" pattern="stripes" rotation={-3}>
        Stripes
      </WashiTape>
      <WashiTape color="mint" pattern="dots" rotation={2}>
        Dots
      </WashiTape>
      <WashiTape color="peach" pattern="checkered" rotation={-1}>
        Checkered
      </WashiTape>
      <WashiTape color="lavender" pattern="solid" rotation={3}>
        Solid
      </WashiTape>
    </div>
  );
}

export const customCategory: ShowcaseCategory = {
  id: "custom",
  title: "Custom",
  items: [
    {
      slug: "animated-theme-toggler",
      name: "Animated Theme Toggler",
      demo: AnimatedThemeTogglerDemo,
    },
    { slug: "aurora-text", name: "Aurora Text", demo: AuroraTextDemo },
    { slug: "book", name: "Book", demo: BookDemo },
    { slug: "choice-poll", name: "Choice Poll", demo: ChoicePollDemo },
    { slug: "dither-shader", name: "Dither Shader", demo: DitherShaderDemo },
    {
      slug: "direction-aware-tabs",
      name: "Direction Aware Tabs",
      demo: DirectionAwareTabsDemo,
    },
    {
      slug: "expandable-screen",
      name: "Expandable Screen",
      demo: ExpandableScreenDemo,
    },
    {
      slug: "floating-panel",
      name: "Floating Panel",
      demo: FloatingPanelDemo,
    },
    { slug: "holo-card", name: "Holo Card", demo: HoloCardDemo },
    { slug: "morph-surface", name: "Morph Surface", demo: MorphSurfaceDemo },
    { slug: "poll-widget", name: "Poll Widget", demo: PollWidgetDemo },
    { slug: "popover-form", name: "Popover Form", demo: PopoverFormDemo },
    {
      slug: "popover-motion",
      name: "Popover Motion",
      demo: PopoverMotionDemo,
    },
    {
      slug: "progressive-blur",
      name: "Progressive Blur",
      demo: ProgressiveBlurDemo,
    },
    {
      slug: "terminal-animation",
      name: "Terminal Animation",
      demo: TerminalAnimationDemo,
    },
    { slug: "text-animate", name: "Text Animate", demo: TextAnimateDemo },
    {
      slug: "texture-overlay",
      name: "Texture Overlay",
      demo: TextureOverlayDemo,
    },
    { slug: "washi-tape", name: "Washi Tape", demo: WashiTapeDemo },
  ],
};
