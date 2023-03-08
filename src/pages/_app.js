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
import { useWebSocketProvider } from "wagmi";

bsc.hasIcon = true;
bsc.iconUrl = "/bscmain.png";
bscTestnet.name = "BSC Testnet";
bscTestnet.hasIcon = true;
bscTestnet.iconUrl = "/bsctest.png";

export const BinanceTestnet = {
  id: 97,
  name: 'BSC Testnet',
  network: 'bsc mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Binance Chain Native Token',
    symbol: 'tBNB',
  },
  rpcUrls: {
    default: {
      http: ['https://data-seed-prebsc-2-s1.binance.org:8545'],
      webSocket: ['wss://floral-late-shadow.bsc-testnet.discover.quiknode.pro/f646c1084c8ffd284d0538fbe89c622521e415bd/']
    },
  },
  blockExplorers: {
    default: { name: 'Bscscan', url: 'https://testnet.bscscan.com' },
  },
  hasIcon: true,
  iconUrl: "https://umbria.network/cdn-cgi/mirage/3bbdf2483e57b9a6384adcb4992cf5d0494b4863df5f54b694cf999f87f739c6/1280/assets/images/icon/bsclogo.png?v1",
  testnet: true,
}


const { chains, provider, webSocketProvider } = configureChains(
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
  webSocketProvider
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
        <Layout style={{ background: "#000000" }}>
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
              paddingTop: '10px',
              paddingBottom: '70px',
              borderBottom: '1px solid #242525',
              backgroundColor: "#0f0f0f",
            }}
          >
            <NavBar />
          </Header>
          <Content
            style={{
              minHeight: "100vh",
              // backgroundColor: "#151617",
              margin: "10px 0 0px 0"
            }}
          >
            <div>
              <Provider store={store}>
                <Component {...pageProps} />
              </Provider>
            </div>
          </Content>
          <Footer style={{ backgroundColor: "#0f0f0f",marginTop:"130px" }}>
            <FooterComp />
          </Footer>
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
