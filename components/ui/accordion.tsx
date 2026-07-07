"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ChevronDownIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const contentRef = React.useRef<React.ElementRef<
    typeof AccordionPrimitive.Content
  > | null>(null);

  React.useLayoutEffect(() => {
    const element = contentRef.current;

    if (!element) {
      return;
    }

    const animate = () => {
      const isOpen = element.dataset.state === "open";

      gsap.killTweensOf(element);

      if (isOpen) {
        gsap.set(element, { height: "auto", opacity: 1 });
        const height = element.scrollHeight;
        gsap.fromTo(
          element,
          { height: 0, opacity: 0 },
          {
            height,
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(element, { height: "auto" });
            },
          },
        );
        return;
      }

      const height =
        element.getBoundingClientRect().height || element.scrollHeight;

      gsap.fromTo(
        element,
        { height, opacity: 1 },
        {
          height: 0,
          opacity: 0,
          duration: 0.28,
          ease: "power2.inOut",
        },
      );
    };

    animate();

    const observer = new MutationObserver((mutations) => {
      if (
        mutations.some((mutation) => mutation.attributeName === "data-state")
      ) {
        animate();
      }
    });

    observer.observe(element, {
      attributes: true,
      attributeFilter: ["data-state"],
    });

    return () => {
      observer.disconnect();
      gsap.killTweensOf(element);
    };
  }, []);

  return (
    <AccordionPrimitive.Content
      ref={contentRef}
      data-slot="accordion-content"
      forceMount
      className="overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
