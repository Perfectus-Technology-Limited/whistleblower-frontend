import { navlinks } from "@/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Menu } from "antd";
import { useRouter } from "next/router";
import { CustomConnectButton } from "./CustomConnectButton";
import MobileNavBar from "./MobileNavBar";

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
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div>
          <h1 style={{ color: "#74ec67" }}>LOGO</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Menu
              items={items}
              style={{
                display: "flex",
                width: "500px",
                backgroundColor: "#000000",
                color: "#ffffff",
                fontSize: "20px",
                textAlign: "center",
              }}
              onSelect={onSelect}
            />
          </div>
          <div>
            {/* <button className="connect-btn">connect</button> */}
            <CustomConnectButton/>
          </div>
        </div>
      </div>
      <div className="mobile-entire-navbar">
        <MobileNavBar />
      </div>
    </>
  );
}
