// @flow
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../../lib/utils"

type Props = {
  className?: string,
  ...React.ElementConfig<typeof SliderPrimitive.Root>
}

const Slider = (React.forwardRef<Props, HTMLElement>(
  (props: Props, ref) => {
    const { className, ...rest } = props;
    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...rest}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <SliderPrimitive.Range className="absolute h-full bg-slate-900 dark:bg-slate-50" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-slate-200 border-slate-900/50 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800 dark:border-slate-50/50 dark:bg-slate-950 dark:focus-visible:ring-slate-300" />
      </SliderPrimitive.Root>
    );
  }
): React$AbstractComponent<Props>);

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider }