// "use client";

// import {
//     EditorBubble,
//     EditorBubbleItem,
//     EditorCommand,
//     EditorCommandItem,
//     EditorContent,
//     EditorRoot,
// } from "novel";
// import { useEffect, useState, useTransition } from "react";

// export function Editor({ defaultValue }: { defaultValue: string }) {
//   const [isPendingSaving, startTransitionSaving] = useTransition();
//   const [isPendingPublishing, startTransitionPublishing] = useTransition();
//   const [data, setData] = useState<{}>({});
//   const [hydrated, setHydrated] = useState(false);

//   // listen to CMD + S and override the default behavior
//   useEffect(() => {
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (e.metaKey && e.key === "s") {
//         e.preventDefault();
//         startTransitionSaving(async () => {
//           //await updatePost(data);
//         });
//       }
//     };
//     document.addEventListener("keydown", onKeyDown);
//     return () => {
//       document.removeEventListener("keydown", onKeyDown);
//     };
//   }, [data, startTransitionSaving]);

//   return (
//     <div className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 p-12 px-8 dark:border-stone-700 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg">
//       <EditorRoot>
//         <EditorContent>
//           <EditorCommand>
//             <EditorCommandItem
//                 value={""}
//                 onCommand={(val) => console.log(val)}>
//                 Do something
//             <EditorCommandItem />
//             <EditorCommandItem />
//           </EditorCommand>
//           <EditorBubble>
//             <EditorBubbleItem />
//             <EditorBubbleItem />
//             <EditorBubbleItem />
//           </EditorBubble>
//         </EditorContent>
//       </EditorRoot>
//       {/* <NovelEditor
//         className="relative block"
//         defaultValue={defaultValue || undefined}
//         onUpdate={(editor) => {
//           setData((prev) => ({
//             ...prev,
//             content: editor?.storage.markdown.getMarkdown(),
//           }));
//         }}
//         onDebouncedUpdate={() => {
//           if (
//             data.title === post.title &&
//             data.description === post.description &&
//             data.content === post.content
//           ) {
//             return;
//           }
//           startTransitionSaving(async () => {
//             await updatePost(data);
//           });
//         }}
//       /> */}
//     </div>
//   );
// }
