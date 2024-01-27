import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Thumb = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    isCurrent?: boolean;
    adjustedWidth: number;
  }
>(({ className, isCurrent, adjustedWidth, ...props }, ref) => {
  const styling = !isCurrent
    ? {
        thumb: "border-2 border-primary",
      }
    : { thumb: "bg-transparent", shadow: "none" };

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
        <SliderPrimitive.Range className="absolute h-full" />
      </SliderPrimitive.Track>
      {props?.defaultValue?.map((value) => (
        <SliderPrimitive.Thumb
          key={`thumb-${value}`}
          className={`block h-28 disabled:pointer-events-none pointer-events-auto disabled:opacity-50 ${styling.thumb}`}
          style={{
            width: `${adjustedWidth}px`,
          }}
        >
          {isCurrent && (
            <span className="block my-0 mx-auto w-1 h-full bg-purple-500"></span>
          )}
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  );
});
Thumb.displayName = SliderPrimitive.Root.displayName;

export { Thumb };
