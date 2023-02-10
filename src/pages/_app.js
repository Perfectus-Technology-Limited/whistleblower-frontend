import "@/styles/globals.css";
import { Layout } from "antd";
const { Header, Content, Footer } = Layout;
import { useRouter } from "next/router";
import NavBar from "@/components/NavBar";
import FooterComp from "@/components/FooterComponents";
import { store } from "../app/store";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <Layout>
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
    </>
  );
}
