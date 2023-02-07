import "@/styles/globals.css";
import { Breadcrumb, Layout, Menu, theme } from "antd";
const { Header, Content, Footer } = Layout;
import { navlinks } from "@/constants";
import { useRouter } from "next/router";
import NavBar from "@/components/NavBar";
import FooterComp from "@/components/FooterComponents";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const items = navlinks.map((link) => ({
    key: link.id,
    label: `${link.name}`,
    link: link.navlink,
  }));

  const onSelect = ({ key }) => {
    router.push(key); // navigate to the selected page
  };

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
            <Component {...pageProps} />
          </div>
        </Content>
        <Footer style={{ backgroundColor: "#000000" }}
        >
          <FooterComp />
        </Footer>
      </Layout>
    </>
  );
}
