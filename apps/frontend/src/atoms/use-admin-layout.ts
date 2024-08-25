import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useRef, useState } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";

export const leftPanelSizeAtom = atomWithStorage<number>("leftPanelSize", 15);
export const centerPanelSizeAtom = atomWithStorage<number>(
  "centerPanelSize",
  60,
);
export const rightPanelSizeAtom = atomWithStorage<number>("rightPanelSize", 25);

export const showLeftPanelAtom = atomWithStorage<boolean>(
  "showLeftPanel",
  true,
);
export const showRightPanelAtom = atomWithStorage<boolean>(
  "showRightPanel",
  true,
);
export const showCenterPanelAtom = atomWithStorage<boolean>(
  "showCenterPanel",
  true,
);

export const navCollapsedSizeAtom = atomWithStorage<number>(
  "navCollapsedSize",
  4,
);

export const isCollapsedAtom = atomWithStorage<boolean>("isCollapsed", false);

export function usePanelRef() {
  const [leftPanelRef, setLeftPanelRef] = useState<
    React.RefObject<ImperativePanelHandle | null>
  >(useRef<ImperativePanelHandle>(null));
  return {
    leftPanelRef,
    setLeftPanelRef,
  };
}
export const useAdminLayout = () => {
  const [showLeftPanel, setShowLeftPanel] = useAtom(showLeftPanelAtom);
  const [showRightPanel, setShowRightPanel] = useAtom(showRightPanelAtom);
  const [showCenterPanel, setShowCenterPanel] = useAtom(showCenterPanelAtom);
  const [leftPanelSize, setLeftPanelSize] = useAtom(leftPanelSizeAtom);
  const [centerPanelSize, setCenterPanelSize] = useAtom(centerPanelSizeAtom);
  const [rightPanelSize, setRightPanelSize] = useAtom(rightPanelSizeAtom);
  const [navCollapsedSize, setNavCollapsedSize] = useAtom(navCollapsedSizeAtom);
  const [isCollapsed, setIsCollapsed] = useAtom(isCollapsedAtom);

  const _leftPanelRef = atom(useRef<ImperativePanelHandle>(null));
  const _middlePanelRef = useRef<ImperativePanelHandle>(null);
  const _rightPanelRef = useRef<ImperativePanelHandle>(null);

  return {
    //leftPanelRef,
    //setLeftPanelRef,
    //middlePanelRef,
    //rightPanelRef,
    leftPanelSize,
    setLeftPanelSize,
    isCollapsed,
    setIsCollapsed,
    centerPanelSize,
    navCollapsedSize,
    setNavCollapsedSize,
    setCenterPanelSize,
    rightPanelSize,
    setRightPanelSize,
    showLeftPanel,
    setShowLeftPanel,
    showRightPanel,
    setShowRightPanel,
    showCenterPanel,
    setShowCenterPanel,
  };
};
