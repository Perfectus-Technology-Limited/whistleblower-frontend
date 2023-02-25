import React from "react";
import { Col, Menu, Row } from "antd";
import { footernavlinks } from "@/constants";

function FooterComp() {
  const items = footernavlinks.map((link) => ({
    key: link.id,
    label: `${link.name}`,
    link: link.navlink,
  }));

  return (
    <div style={{ marginTop: "130px" }}>
      <Row>
        {/* <Col xxl={8} md={12} style={{ display: "flex", alignItems: "center" }} className="logo-col">
          <h1 style={{ color: "#74ec67" }}>Logo</h1>
        </Col> */}
        <Col md={24} xxl={24} className="footer-links-credits">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Menu
              items={items}
              style={{
                display: "flex",
                width: "800px",
                backgroundColor: "#151617",
                color: "#ffffff",
                fontSize: "20px",
                textAlign: "center",
              }}
              className="footer-menu-links"
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#fff", fontSize: "10px", fontWeight: "200" }}>
              Unicrypt Network © 2021 • support@unicrypt.network • All rights
              reserved. Designed by nuixw
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default FooterComp;
