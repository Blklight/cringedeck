"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ChamferCard } from "./chamfer-card";
import type { Corner, Size } from "./chamfer-utils";

export interface ChamferCommandProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  shape?: "cut" | "smooth";
  corners?: "all" | Corner[];
  size?: Size;
  radius?: number;
  /** raio (px) dos cantos sem chanfro */
  rounded?: number;
}

export const ChamferCommand = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  ChamferCommandProps
>(
  (
    {
      shape = "cut",
      corners = ["tl", "br"],
      size = "md",
      radius = 4,
      rounded = 0,
      className,
      ...props
    },
    ref,
  ) => (
    <ChamferCard
      shape={shape}
      corners={corners}
      size={size}
      radius={radius}
      rounded={rounded}
      className="bg-popover text-popover-foreground"
    >
      <CommandPrimitive
        ref={ref}
        className={cn("flex h-full w-full flex-col overflow-hidden", className)}
        {...props}
      />
    </ChamferCard>
  ),
);
ChamferCommand.displayName = "ChamferCommand";

export function ChamferCommandDialog({
  children,
  open,
  onOpenChange,
  title = "Paleta de comandos",
  ...cmd
}: ChamferCommandProps & {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title?: string;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => onOpenChange(o)}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm" />
        <DialogPrimitive.Popup className="fixed left-1/2 top-[20%] z-50 w-[92vw] max-w-lg -translate-x-1/2">
          <DialogPrimitive.Title className="sr-only">
            {title}
          </DialogPrimitive.Title>
          <ChamferCommand {...cmd}>{children}</ChamferCommand>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export const ChamferCommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="flex items-center gap-2 border-b border-border px-4"
    cmdk-input-wrapper=""
  >
    <Search className="h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));
ChamferCommandInput.displayName = "ChamferCommandInput";

export const ChamferCommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("no-scrollbar max-h-80 overflow-y-auto p-2", className)}
    {...props}
  />
));
ChamferCommandList.displayName = "ChamferCommandList";

export const ChamferCommandEmpty = (
  p: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>,
) => (
  <CommandPrimitive.Empty
    className="py-6 text-center text-sm text-muted-foreground"
    {...p}
  />
);

export const ChamferCommandGroup = ({
  className,
  ...p
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>) => (
  <CommandPrimitive.Group
    className={cn(
      "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground",
      className,
    )}
    {...p}
  />
);

export const ChamferCommandItem = ({
  className,
  ...p
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>) => (
  <CommandPrimitive.Item
    className={cn(
      "chamfer chamfer-sm chamfer-tr flex cursor-pointer select-none items-center gap-2 px-2 py-2 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
      className,
    )}
    {...p}
  />
);

export const ChamferCommandSeparator = ({
  className,
  ...p
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>) => (
  <CommandPrimitive.Separator
    className={cn("-mx-2 my-1 h-px bg-border", className)}
    {...p}
  />
);

export const ChamferCommandShortcut = ({
  className,
  ...p
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "ml-auto text-xs tracking-widest text-muted-foreground",
      className,
    )}
    {...p}
  />
);

export const ChamferCommandBR = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  ChamferCommandProps
>(
  (
    {
      corners = ["br"],
      size = "lg",
      rounded = 14,
      shape = "smooth",
      radius = 3,
      ...props
    },
    ref,
  ) => (
    <ChamferCommand
      ref={ref}
      corners={corners}
      size={size}
      rounded={rounded}
      shape={shape}
      radius={radius}
      {...props}
    />
  ),
);
ChamferCommandBR.displayName = "ChamferCommandBR";
