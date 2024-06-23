import "./LoginPage.css";
import { useEffect } from "react";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import firebase from "firebase/compat/app";
import { enqueueSnackbar } from "notistack";

export default function LoginPage(props) {
  useEffect(() => {
    /* props.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(props.auth)
                if (ui.isPendingRedirect()) {
                    ui.start('#firebaseui-auth-container', {
                        signInOptions: [{
                            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID
                        }]
                    })
                }
            }) */
    var ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(props.auth);
    ui.start("#firebaseui-auth-container", {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        "microsoft.com",
      ],
      signInFlow: "popup",
      signInSuccessUrl: "/courses",
      callbacks: {
        uiShown: function () {
          document.getElementById("loader").style.display = "none";
        },
        signInFailure: function (error) {
          // Some unrecoverable error occurred during sign-in.
          // Return a promise when error handling is completed and FirebaseUI
          // will reset, clearing any UI. This commonly occurs for error code
          // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
          // occurs. Check below for more details on this.
          enqueueSnackbar(`Login Failed`, {
            variant: "error",
          });
          console.error(error);
        },
      },
    });
  }, []);
  return (
    <div className="loginPage glass">
      <h2>Project X | Login</h2>
      {/* <p
        style={{
          marginTop: "10px"
        }}
      >
        <em>The power of knowledge in the palm of your hands...</em>
      </p> */}
      <div id="firebaseui-auth-container"></div>
      <div id="loader">
        <p>Loading...</p>
      </div>
    </div>
  );
}
