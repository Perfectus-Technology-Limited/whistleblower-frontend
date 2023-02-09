import { navlinks } from "@/constants";
import IconHamburgerMenu from "@/utils/HamburgerIcon";
import { Drawer, Menu } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";

export default function MobileNavBar() {
  const router = useRouter();
  const items = navlinks.map((link) => ({
    key: link.id,
    label: `${link.name}`,
    link: link.navlink,
  }));

  const onSelect = ({ key }) => {
    router.push(key); // navigate to the selected page
    setOpen(false);
  };

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ color: "#74ec67" }}>Logo</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconHamburgerMenu onClick={showDrawer} />
        </div>
      </div>
      <Drawer
        title="Basic Drawer"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "",
          }}
        >
          <Menu
            items={items}
            style={{
              display: "flex",
              width: "500px",
              backgroundColor: "#071309",
              color: "#ffffff",
              fontSize: "20px",
              textAlign: "center",
            }}
            className="mobile-menu-items"
            onSelect={onSelect}
          />
        </div>
        <div style={{ marginTop: "4px" }}>
          <button className="connect-btn" style={{ width: "100%" }}>
            Connect
          </button>
        </div>
      </Drawer>
    </>
  );
}
