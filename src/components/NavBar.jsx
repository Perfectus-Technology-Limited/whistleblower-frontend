import { navlinks } from "@/constants";
import { Menu } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { Logo, LogoTagName } from "public/NewUiDesigns";
import MobileNavBar from "./MobileNavBar";
import { CustomConnectionButton } from "./web3/CustomConnectionButton";
export default function NavBar() {
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
      <div
        className="entire-navbardiv"
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <div>
          <Link href={"/"} style={{ height: "64px", display: "flex" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight:"9px"
              }}
            >
              <Logo />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              className="logo-tag-name"
            >
              <LogoTagName/>
            </div>
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Menu
              items={items}
              selectedKeys={router.pathname}
              style={{
                display: "flex",
                width: "500px",
                color: "#ffffff",
                fontSize: "20px",
                textAlign: "center",
              }}
              onSelect={onSelect}
            />
          </div>
          <div>
            <CustomConnectionButton />
            {/* <ConnectButton /> */}
            {/* <button className="connect-btn">
             
            </button> */}
          </div>
        </div>
      </div>
      <div className="mobile-entire-navbar">
        <MobileNavBar />
      </div>
    </>
  );
}
