import Image from "next/image";
import logo from "@/assets/images/logo.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const features = [
  {
    title: "Manual Knowledge Capture",
    description:
      "Save important discussions, decisions, and solutions directly from Slack using simple commands like #trace save.",
  },
  {
    title: "AI-Powered Suggestions",
    description:
      "Trace identifies potentially valuable conversations and suggests them for review instead of automatically storing them.",
  },
  {
    title: "Human Approval Workflow",
    description:
      "Maintain trust and accuracy by requiring approval before suggested knowledge becomes part of your team's memory.",
  },
  {
    title: "Search Across Everything",
    description:
      "Find decisions, solutions, and important context instantly without digging through channels and old threads.",
  },
  {
    title: "Team Memory",
    description:
      "Preserve institutional knowledge so critical information stays accessible even when team members leave.",
  },
  {
    title: "Smart Organization",
    description:
      "Automatically structure saved knowledge by topic, project, team, and workspace context for easy discovery.",
  },
];

const Product = () => {
  return (
    <main className="my-16" id="product">
      <div className="flex flex-col items-center justify-center gap-2">
        <Image src={logo} alt="Trace logo" width={80} height={80} />
        <h3 className="font-semibold font-sans text-xl">
          How does <span className="text-2xl font-bold">Trace</span> work
        </h3>
        <p className="text-xs text-black/50">
          Your team's knowledge, automatically organized
        </p>
      </div>
      <div className="w-10/12 mx-auto flex items-center gap-12 mt-4">
        {" "}
        <p className="w-1/2 font-sans text-sm text-black/90">
          Every day, critical decisions, solutions, and insights are shared
          inside Slack conversations, but most of that knowledge never makes it
          into documentation. <br />
          <span className="font-semibold text-black">Trace</span> helps teams
          preserve organizational knowledge by understanding conversations as
          they happen. Instead of waiting for someone to ask a question or
          manually document an outcome,{" "}
          <span className="font-semibold text-black">Trace</span> identifies
          important decisions, solutions, processes, and lessons learned within
          discussions and suggests them for review. Teams stay in control.
          Before anything becomes part of the knowledge base, Trace asks for
          approval, ensuring that only relevant and trusted information is
          preserved. <br />
          The result is a searchable, living memory that captures not just what
          was decided, but why it was decided, so knowledge stays accessible
          long after the conversation ends.
        </p>
        <div className="mx-auto w-full max-w-xl">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-1"
            className="w-full"
          >
            {features.map((feature: any) => (
              <AccordionItem
                className="w-full"
                value={feature.title}
                key={feature.title}
              >
                <AccordionTrigger className="w-full border rounded-md text-black/80 p-2 mt-4 hover:text-black/90">
                  {feature.title}
                </AccordionTrigger>
                <AccordionContent className="border rounded-md p-2 mt-2 text-xs text-black/60">
                  {feature.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </main>
  );
};

export default Product;
