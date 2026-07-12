import Image from "next/image";
import slackImage from "@/assets/images/slack.png";
import { Bell } from "lucide-react";

type TopbarProps = {
  workspaceName?: string;
};

const Topbar = ({ workspaceName = "Trace" }: TopbarProps) => {
  return (
    <main className="w-full bg-gray-200 rounded-xl p-3 flex justify-between items-center">
      <h1 className="font-sans font-semibold text-lg">Dashboard</h1>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Image src={slackImage} alt="Slack" width={24} height={24} />
          <div>
            {" "}
            <h6 className="font-sans font-semibold text-black">
              {workspaceName}
            </h6>
          </div>
        </div>
        <Bell size={15} className="text-gray-500 cursor-pointer" />
      </div>
    </main>
  );
};

export default Topbar;
