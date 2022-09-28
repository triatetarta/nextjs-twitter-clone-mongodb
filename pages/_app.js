import "../styles/globals.css";
import { UserProvider } from "@auth0/nextjs-auth0";
import { UserProvider as AtlasUserProvider } from "../context/UserContext";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <AtlasUserProvider>
        <Component {...pageProps} />
      </AtlasUserProvider>
    </UserProvider>
  );
}

export default MyApp;
