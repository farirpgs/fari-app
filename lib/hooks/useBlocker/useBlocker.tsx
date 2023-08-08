// // import type { History, Transition } from "history";

// /**
//  * @source https://github.com/remix-run/react-router/issues/8139#issuecomment-1021457943
//  */
// export function usePrompt() {
//   // const blocker = useCallback(
//   //   (tx: Transition) => {
//   //     let response;
//   //     if (typeof message === "function") {
//   //       response = message(tx.location, tx.action);
//   //       if (typeof response === "string") {
//   //         response = window.confirm(response);
//   //       }
//   //     } else {
//   //       response = window.confirm(message);
//   //     }
//   //     if (response) {
//   //       tx.retry();
//   //     }
//   //   },
//   //   [message],
//   // );
//   // return useBlocker(blocker, when);
// }
