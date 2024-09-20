import { LuGitFork } from "react-icons/lu";
import {
  MdBalance,
  MdOutlineAdjust,
  MdOutlineBrightness1,
  MdOutlineStarBorder,
} from "react-icons/md";

export function GithubStats() {
  return (
    <>
      <div className="scrollbar-hide mt-6 flex space-x-4 overflow-auto">
        <div className="flex items-center space-x-1">
          <MdOutlineBrightness1 />
          <span className="shrink-0 text-xs">TypeScript</span>
        </div>
        <div className="flex items-center space-x-1">
          <MdBalance />
          <span className="shrink-0 text-xs">AGPL-3.0</span>
        </div>
        <div className="flex items-center space-x-1">
          <MdOutlineStarBorder />
          <span className="shrink-0 text-xs">20000</span>
        </div>

        <div className="flex items-center space-x-1">
          <LuGitFork />
          <span className="shrink-0 text-xs">2000</span>
        </div>

        <div className="flex items-center space-x-1">
          <MdOutlineAdjust />
          <span className="shrink-0 text-xs">200</span>
        </div>
      </div>

      <div className="mt-10 h-[130px] pb-10">
        {/* {data?.stats && <ChartSSR data={data?.stats} />} */}
        <p className="mt-4 text-sm text-[#878787]">Updated one hour ago</p>
      </div>
    </>
  );
}
