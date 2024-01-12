import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Thumb = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    isCurrent?: boolean;
  }
>(({ className, isCurrent, ...props }, ref) => {
  const styling = !isCurrent
    ? { thumb: "bg-yellow-500", shadow: "0 0 0 100vw rgba(0, 0, 0, 0.8)" }
    : { thumb: "bg-purple-500", shadow: "none" };

  return (
    <SliderPrimitive.Root
      minStepsBetweenThumbs={1}
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center h-full pointer-events-none",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-full w-full grow overflow-hidden">
        <SliderPrimitive.Range
          className="absolute h-full"
          style={{ boxShadow: styling.shadow }}
        />
      </SliderPrimitive.Track>
      {props?.defaultValue?.map((value) => (
        <SliderPrimitive.Thumb
          key={`thumb-${value}`}
          className={`block h-[67px] w-1 rounded-lg disabled:pointer-events-none pointer-events-auto disabled:opacity-50 ${styling.thumb}`}
        />
      ))}
    </SliderPrimitive.Root>
  );
});
Thumb.displayName = SliderPrimitive.Root.displayName;

export { Thumb };
