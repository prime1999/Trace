import Image from "next/image";
import slackLogo from "@/assets/images/slack.png";
import useCaseImage from "@/assets/images/usecase.jpg";

const useCase = () => {
  return (
    <main
      className="flex flex-col items-center justify-center gap-2 my-16 font-sans font-semibold"
      id="useCase"
    >
      <div className="flex items-center gap-2 text-xl mb-4">
        <h1>Built directly into</h1>
        <span className="flex items-center gap-2">
          <Image src={slackLogo} alt="slack logo" width={30} height={30} />
          <h1>Slack</h1>
        </span>
      </div>
      <div className="w-10/12 mx-auto flex flex-col-reverse lg:flex-lg items-start justify-center gap-4 mt-4">
        <div className="max-md:mt-6">
          <Image
            src={useCaseImage}
            alt="useCase image"
            width={700}
            height={500}
            className="rounded-lg"
          />
        </div>
        <div>
          <h3 className="text-xl">Powered by your conversations</h3>
          <p className="text-sm text-black/80">
            Trace fits naturally into Slack, turning discussions, decisions, and
            solutions into a searchable team memory without changing how your
            team works.
            <br />
            <br />
            This one reinforces your core positioning:
          </p>
          <span className="flex items-center my-2 text-sm text-green-500 border-l-4 border-green-600 pl-2">
            conversations → knowledge → team memory
          </span>
          <p className="text-xs text-black/60">
            which is what makes Trace different from a traditional knowledge
            base.
          </p>
        </div>
      </div>
    </main>
  );
};

export default useCase;
