// /* eslint-disable @typescript-eslint/no-unnecessary-condition */
// /* eslint-disable @typescript-eslint/no-unsafe-return */
// import type {
//   GlobalOptions as ConfettiGlobalOptions,
//   CreateTypes as ConfettiInstance,
//   Options as ConfettiOptions,
// } from "canvas-confetti";
// import type { ReactNode } from "react";
// import React, {
//   createContext,
//   forwardRef,
//   useCallback,
//   useEffect,
//   useImperativeHandle,
//   useMemo,
//   useRef,
// } from "react";
// import confetti from "canvas-confetti";

// import type { ButtonProps } from "@repo/ui/button";
// import { Button } from "@repo/ui/button";

// interface Api {
//   fire: (options?: ConfettiOptions) => void;
// }

// type Props = React.ComponentPropsWithRef<"canvas"> & {
//   options?: ConfettiOptions;
//   globalOptions?: ConfettiGlobalOptions;
//   manualstart?: boolean;
//   children?: ReactNode;
// };

// export type ConfettiRef = Api | null;

// const ConfettiContext = createContext<Api>({} as Api);

// const Confetti = forwardRef<ConfettiRef, Props>((props, ref) => {
//   const {
//     options,
//     globalOptions = { resize: true, useWorker: true },
//     manualstart = false,
//     children,
//     ...rest
//   } = props;
//   // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
//   const instanceRef = useRef<ConfettiInstance | null>(null); // confetti instance

//   const canvasRef = useCallback(
//     // https://react.dev/reference/react-dom/components/common#ref-callback
//     // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
//     (node: HTMLCanvasElement) => {
//       if (node !== null) {
//         // <canvas> is mounted => create the confetti instance
//         if (instanceRef.current) return; // if not already created
//         instanceRef.current = confetti.create(node, {
//           ...globalOptions,
//           resize: true,
//         });
//       } else {
//         // <canvas> is unmounted => reset and destroy instanceRef
//         if (instanceRef.current) {
//           instanceRef.current.reset();
//           instanceRef.current = null;
//         }
//       }
//     },
//     [globalOptions],
//   );

//   // `fire` is a function that calls the instance() with `opts` merged with `options`
//   const fire = useCallback(
//     (opts = {}) => instanceRef.current?.({ ...options, ...opts }),
//     [options],
//   );

//   const api = useMemo(
//     () => ({
//       fire,
//     }),
//     [fire],
//   );

//   useImperativeHandle(ref, () => api, [api]);

//   useEffect(() => {
//     if (!manualstart) {
//       fire();
//     }
//   }, [manualstart, fire]);

//   return (
//     <ConfettiContext.Provider value={api}>
//       <canvas ref={canvasRef} {...rest} />
//       {children}
//     </ConfettiContext.Provider>
//   );
// });

// interface ConfettiButtonProps extends ButtonProps {
//   // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
//   options?: ConfettiOptions &
//     // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
//     ConfettiGlobalOptions & { canvas?: HTMLCanvasElement };
//   children?: React.ReactNode;
// }

// function ConfettiButton({ options, children, ...props }: ConfettiButtonProps) {
//   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     const rect = event.currentTarget.getBoundingClientRect();
//     const x = rect.left + rect.width / 2;
//     const y = rect.top + rect.height / 2;
//     confetti({
//       ...options,
//       origin: {
//         x: x / window.innerWidth,
//         y: y / window.innerHeight,
//       },
//     });
//   };

//   return (
//     <Button onClick={handleClick} {...props}>
//       {children}
//     </Button>
//   );
// }
// Confetti.displayName = "Confetti";

// export { ConfettiButton };

// export default Confetti;
