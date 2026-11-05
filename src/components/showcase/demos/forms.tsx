import { MinusIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ShowcaseCategory } from "@/components/showcase/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function CheckboxDemo() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox defaultChecked id="showcase-checkbox" />
      <Label htmlFor="showcase-checkbox">Accept terms and conditions</Label>
    </div>
  );
}

function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="r1" value="default" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="r2" value="comfortable" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="r3" value="compact" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  );
}

function SwitchDemo() {
  return (
    <div className="flex items-center gap-2">
      <Switch defaultChecked id="showcase-switch" />
      <Label htmlFor="showcase-switch">Airplane Mode</Label>
    </div>
  );
}

function SliderDemo() {
  return (
    <div className="w-full max-w-sm">
      <Slider defaultValue={[50]} max={100} step={1} />
    </div>
  );
}

function SelectDemo() {
  return (
    <Select defaultValue="apple">
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function ToggleDemo() {
  return (
    <div className="flex items-center gap-2">
      <Toggle aria-label="Toggle bold" variant="outline">
        <MinusIcon />
      </Toggle>
      <Toggle aria-label="Toggle italic" variant="outline">
        <PlusIcon />
      </Toggle>
    </div>
  );
}

function ToggleGroupDemo() {
  return (
    <ToggleGroup defaultValue={["center"]} variant="outline">
      <ToggleGroupItem aria-label="Align left" value="left">
        Left
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Align center" value="center">
        Center
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Align right" value="right">
        Right
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function InputGroupDemo() {
  return (
    <div className="w-full max-w-sm">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function InputOtpDemo() {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}

function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <Calendar
      className="rounded-md border"
      mode="single"
      onSelect={setDate}
      selected={date}
    />
  );
}

function FieldDemo() {
  return (
    <FieldSet className="w-full max-w-sm">
      <FieldLegend>Profile</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="showcase-field-name">Name</FieldLabel>
          <Input id="showcase-field-name" placeholder="Jane Doe" />
          <FieldDescription>This is your public display name.</FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}

function FormDemo() {
  const form = useForm({ defaultValues: { email: "" } });

  return (
    <Form {...form}>
      <form
        className="w-full max-w-sm space-y-4"
        onSubmit={form.handleSubmit(() => undefined)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl
                render={<Input placeholder="you@example.com" {...field} />}
              />
              <FormDescription>
                We&apos;ll never share your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const formsCategory: ShowcaseCategory = {
  id: "forms",
  title: "Forms",
  items: [
    { slug: "checkbox", name: "Checkbox", demo: CheckboxDemo },
    { slug: "radio-group", name: "Radio Group", demo: RadioGroupDemo },
    { slug: "switch", name: "Switch", demo: SwitchDemo },
    { slug: "slider", name: "Slider", demo: SliderDemo },
    { slug: "select", name: "Select", demo: SelectDemo },
    { slug: "toggle", name: "Toggle", demo: ToggleDemo },
    { slug: "toggle-group", name: "Toggle Group", demo: ToggleGroupDemo },
    { slug: "input-group", name: "Input Group", demo: InputGroupDemo },
    { slug: "input-otp", name: "Input OTP", demo: InputOtpDemo },
    { slug: "calendar", name: "Calendar", demo: CalendarDemo },
    { slug: "field", name: "Field", demo: FieldDemo },
    { slug: "form", name: "Form", demo: FormDemo },
  ],
};
