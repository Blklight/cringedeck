import { AlertCircleIcon, UserIcon } from "lucide-react";
import type { ShowcaseCategory } from "@/components/showcase/types";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

function AlertDemo() {
  return (
    <Alert>
      <AlertCircleIcon />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">
          Undo
        </Button>
      </AlertAction>
    </Alert>
  );
}

function AspectRatioDemo() {
  return (
    <div className="w-full max-w-sm">
      <AspectRatio ratio={16 / 9}>
        <div className="flex size-full items-center justify-center rounded-md bg-muted text-muted-foreground text-sm">
          16 / 9
        </div>
      </AspectRatio>
    </div>
  );
}

function AvatarDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar>
        <AvatarImage alt="@shadcn" src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    </div>
  );
}

function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  );
}

function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
      <Button size="icon" variant="outline">
        <UserIcon />
      </Button>
    </div>
  );
}

function ButtonGroupDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ButtonGroup>
        <Button variant="outline">Left</Button>
        <ButtonGroupSeparator />
        <Button variant="outline">Middle</Button>
        <ButtonGroupSeparator />
        <Button variant="outline">Right</Button>
      </ButtonGroup>
    </div>
  );
}

function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
        <CardAction>
          <Badge variant="secondary">New</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          This is the card content.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  );
}

function EmptyDemo() {
  return (
    <Empty className="border border-dashed">
      <EmptyMedia variant="icon">
        <UserIcon />
      </EmptyMedia>
      <EmptyTitle>No members yet</EmptyTitle>
      <EmptyDescription>
        Invite people to collaborate on this project.
      </EmptyDescription>
      <EmptyContent>
        <Button size="sm">Invite member</Button>
      </EmptyContent>
    </Empty>
  );
}

function InputDemo() {
  return (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="showcase-input">Email</Label>
      <Input id="showcase-input" placeholder="you@example.com" type="email" />
    </div>
  );
}

function ItemDemo() {
  return (
    <div className="w-full max-w-md">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <UserIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Profile</ItemTitle>
          <ItemDescription>Manage your account details.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="ghost">
            Edit
          </Button>
        </ItemActions>
      </Item>
    </div>
  );
}

function KbdDemo() {
  return (
    <div className="flex items-center gap-4">
      <Kbd>K</Kbd>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  );
}

function LabelDemo() {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="showcase-label">Accept terms and conditions</Label>
    </div>
  );
}

function ProgressDemo() {
  return (
    <div className="w-full max-w-sm">
      <Progress value={62}>
        <ProgressLabel>Uploading</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  );
}

function SeparatorDemo() {
  return (
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Blog</span>
      <Separator orientation="vertical" />
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Source</span>
    </div>
  );
}

function SkeletonDemo() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

function SpinnerDemo() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
      <Spinner className="size-6" />
    </div>
  );
}

function TextareaDemo() {
  return (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="showcase-textarea">Message</Label>
      <Textarea id="showcase-textarea" placeholder="Type your message here." />
    </div>
  );
}

export const primitivesCategory: ShowcaseCategory = {
  id: "primitives",
  title: "Primitivos & Display",
  items: [
    { slug: "alert", name: "Alert", demo: AlertDemo },
    { slug: "aspect-ratio", name: "Aspect Ratio", demo: AspectRatioDemo },
    { slug: "avatar", name: "Avatar", demo: AvatarDemo },
    { slug: "badge", name: "Badge", demo: BadgeDemo },
    { slug: "button", name: "Button", demo: ButtonDemo },
    { slug: "button-group", name: "Button Group", demo: ButtonGroupDemo },
    { slug: "card", name: "Card", demo: CardDemo },
    { slug: "empty", name: "Empty", demo: EmptyDemo },
    { slug: "input", name: "Input", demo: InputDemo },
    { slug: "item", name: "Item", demo: ItemDemo },
    { slug: "kbd", name: "Kbd", demo: KbdDemo },
    { slug: "label", name: "Label", demo: LabelDemo },
    { slug: "progress", name: "Progress", demo: ProgressDemo },
    { slug: "separator", name: "Separator", demo: SeparatorDemo },
    { slug: "skeleton", name: "Skeleton", demo: SkeletonDemo },
    { slug: "spinner", name: "Spinner", demo: SpinnerDemo },
    { slug: "textarea", name: "Textarea", demo: TextareaDemo },
  ],
};
