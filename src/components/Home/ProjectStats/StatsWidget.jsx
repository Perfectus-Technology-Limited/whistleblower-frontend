import { Spin } from "antd";
import React from "react";

const styles = {
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    // border: '1px solid red',
    backgroundColor: "#0f0f0f",
    borderRadius: "10px",
    color: "#ffffff",
    height: "130px",
  },
  statValue: {
    fontSize: "35px",
    fontWeight: "800",
    color: "#D80E2F",
    textShadow: "0 2px #D80E2F",
  },
};

const defaultOptions = {
  loop: true,
  autoplay: true,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function StatsWidget({ title, value, isLoading }) {
  return (
    <div className="stats-widget" style={styles.cardContainer}>
      <div className="animation stat-value" style={styles.statValue}>
        {isLoading ? <Spin size="large" /> : value}
      </div>
      <div className="title" style={styles.title}>
        {title}
      </div>
    </div>
  );
}

export default StatsWidget;
