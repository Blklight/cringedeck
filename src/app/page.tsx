import { LayoutBase } from "@/components/layout-base";

export default function Home() {
  return (
    <LayoutBase>
      <div className="flex grow items-center justify-center p-8">
        <div className="max-w-md space-y-2 text-center">
          <h1 className="font-bold text-2xl tracking-tight">tpl-ui</h1>
          <p className="text-muted-foreground text-sm">
            Front-end template. Start building from{" "}
            <code className="font-mono">src/app/page.tsx</code>.
          </p>
        </div>
      </div>
    </LayoutBase>
  );
}
