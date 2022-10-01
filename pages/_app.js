import "../styles/globals.css";
import { UserProvider } from "@auth0/nextjs-auth0";
import { UserProvider as AtlasUserProvider } from "../context/UserContext";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <AtlasUserProvider>
        <Toaster
          position='bottom-center'
          toastOptions={{
            style: {
              background: "#1d9bf0",
              color: "#fff",
            },
          }}
        />
        <Component {...pageProps} />
      </AtlasUserProvider>
    </UserProvider>
  );
}

export default MyApp;
