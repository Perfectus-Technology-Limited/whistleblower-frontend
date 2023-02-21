import "@/styles/globals.css";
import { Layout } from "antd";
const { Header, Content, Footer } = Layout;
import NavBar from "@/components/NavBar";
import FooterComp from "@/components/FooterComponents";
import { store } from "../app/store";
import { Provider } from "react-redux";
import "@rainbow-me/rainbowkit/styles.css";
import Head from "next/head";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { bscTestnet, bsc } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

bsc.hasIcon = true;
bsc.iconUrl = "/bscmain.png";
bscTestnet.name = "BSC Testnet";
bscTestnet.hasIcon = true;
bscTestnet.iconUrl = "/bsctest.png";

const { chains, provider } = configureChains(
  [bscTestnet, bsc],
  [
    publicProvider(),
    // jsonRpcProvider({
    //   rpc: () => ({ http: "https://data-seed-prebsc-2-s2.binance.org:8545" }),
    // }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Whistleblower",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "#0e9aa7",
          accentColorForeground: "white",
          borderRadius: "small",
          fontStack: "system",
          overlayBlur: "small",
        })}
        chains={chains}
      >
        <Layout>
          <Head>
            <title>Whistleblowers unite!</title>
            <meta name="description" content="Whistleblowers unite! Your voice can change the world!" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "#000000",
            }}
          >
            <NavBar />
          </Header>
          <Content
            style={{
              padding: "0 50px",
              minHeight: "100vh",
              backgroundColor: "#000000",
            }}
          >
            <div>
              <Provider store={store}>
                <Component {...pageProps} />
              </Provider>
            </div>
          </Content>
          <Footer style={{ backgroundColor: "#000000" }}>
            <FooterComp />
          </Footer>
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
