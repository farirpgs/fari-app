import Box from "@mui/material/Box";
import { TDDocument, Tldraw, TldrawApp, TldrawProps } from "@tldraw/tldraw";
import React, { useEffect } from "react";

export function TldrawWriter(props: {
  onChange?: (doc: TDDocument) => void;
  tldrawProps?: TldrawProps;
}) {
  const rDocument = React.useRef<TDDocument>(makeNewBlankDocument());
  const [doc, setDoc] = React.useState<TDDocument>(rDocument.current);

  useEffect(() => {
    const interval = setInterval(() => {
      const newDoc = {
        ...rDocument.current,
      };
      props.onChange?.(newDoc);
      console.log("set Doooc");
      setDoc(newDoc);
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function handleChange(tlstate: any) {
    rDocument.current = tlstate.document;
  }

  return (
    <Box position="relative" width="100%" height="600px">
      <Tldraw
        showPages={false}
        showMenu={false}
        document={doc}
        onChange={handleChange}
        {...(props.tldrawProps ?? {})}
      />
    </Box>
  );
}

export function TldrawReader(props: { doc: TDDocument | undefined }) {
  if (!props.doc) {
    return null;
  }

  const safeDocument = JSON.parse(JSON.stringify(props.doc));

  return (
    <Box position="relative" width="100%" height="600px">
      <Tldraw showPages={false} document={safeDocument} readOnly />
    </Box>
  );
}

export function makeNewBlankDocument(): TDDocument {
  return {
    id: "doc",
    name: "New Document",
    version: TldrawApp.version,
    assets: {},
    pages: {
      page: {
        id: "page",
        shapes: {},
        bindings: {},
      },
    },
    pageStates: {
      page: {
        id: "page",
        camera: {
          point: [0, 0],
          zoom: 1,
        },
        selectedIds: [],
      },
    },
  };
}

// export default function Controlled() {
//   const rDocument = React.useRef<TDDocument>({
//     name: "New Document",
//     version: TldrawApp.version,
//     id: "doc",
//     pages: {
//       page1: {
//         id: "page1",
//         shapes: {
//           rect1: {
//             id: "rect1",
//             type: TDShapeType.Rectangle,
//             parentId: "page1",
//             name: "Rectangle",
//             childIndex: 1,
//             point: [100, 100],
//             size: [100, 100],
//             style: {
//               dash: DashStyle.Draw,
//               size: SizeStyle.Medium,
//               color: ColorStyle.Blue,
//             },
//           },
//           rect2: {
//             id: "rect2",
//             type: TDShapeType.Rectangle,
//             parentId: "page1",
//             name: "Rectangle",
//             childIndex: 1,
//             point: [200, 200],
//             size: [100, 100],
//             style: {
//               dash: DashStyle.Draw,
//               size: SizeStyle.Medium,
//               color: ColorStyle.Blue,
//             },
//           },
//         },
//         bindings: {},
//       },
//     },
//     pageStates: {
//       page1: {
//         id: "page1",
//         selectedIds: ["rect1"],
//         camera: {
//           point: [0, 0],
//           zoom: 1,
//         },
//       },
//     },
//   });

//   const [doc, setDoc] = React.useState<TDDocument>(rDocument.current);

//   React.useEffect(() => {
//     let i = 0;
//     const interval = setInterval(() => {
//       const currentDoc = rDocument.current;
//       const rect1 = currentDoc.pages.page1.shapes.rect1;
//       if (rect1) {
//         i++;
//         const next = {
//           ...currentDoc,
//           pages: {
//             ...currentDoc.pages,
//             page1: {
//               ...currentDoc.pages.page1,
//               shapes: {
//                 ...currentDoc.pages.page1.shapes,
//                 rect1: {
//                   ...rect1,
//                   style: {
//                     ...rect1.style,
//                     color: i % 2 ? ColorStyle.Red : ColorStyle.Blue,
//                   },
//                 },
//               },
//             },
//           },
//         };

//         rDocument.current = next;
//         setDoc(next);
//       }
//     }, 1000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   const handleChange = React.useCallback((state) => {
//     rDocument.current = state.document;
//   }, []);

//   return <Tldraw document={doc} onChange={handleChange} />;
// }
