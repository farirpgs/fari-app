import admin from "firebase-admin";

(async function main() {
  try {
    admin.initializeApp({
      databaseURL: "https://fariapp.firebaseio.com",
    });

    admin
      .database()
      .ref("/sessions/")
      .once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          console.log(childKey, childData);
        });
      });
    // const messagesRef = db.ref("/sessions");
    // const derp = await messagesRef.get();
    // console.debug(derp);
    // messagesRef.once("value", (snapshot) => {
    //   console.debug("ON VALUE");
    //   snapshot.forEach((sessionSnapshot) => {
    //     const session = sessionSnapshot.val();
    //     // console.debug("session", session);
    //     console.debug("FOR SESSION");
    //     process.exit(0);
    //   });
    // });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
