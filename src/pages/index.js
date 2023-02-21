import Head from "next/head";
import { Avatar, Card, Col, Divider, Row, Skeleton } from "antd";
import PostCard from "@/components/PostCard";
import Map from "@/components/map/Index";
import ThirdSectionCard from "@/components/ThirdSectionCard";

const style = {
  background: "#0092ff",
  padding: "8px 0",
};

export default function Home() {
  const { Meta } = Card;
  const array = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <>
      <Head>
        <title>Whistleblowers unite!</title>
        <meta name="description" content="Whistleblowers unite! Your voice can change the world!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container">
        <div className="site-tagline">
          <h1>
            Whistleblowers unite! Your voice can change the world!
          </h1>
        </div>
        <Map />

        <Row>
          <Row>
            <Col className="gutter-row">
              <h2 style={{ color: "#ffffff" }}>Featured</h2>
            </Col>
          </Row>
          <Row justify="space-between">

            {array.map((row, index) => (
              <PostCard key={index} index={index} />
            ))}

            {/* <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard /> */}
          </Row>
        </Row>

        <Row className="gutter-row" justify="space-between">
          <Col span={24} className="gutter-row">
            <h2 style={{ color: "#ffffff" }}>Third Section</h2>
          </Col>
          <ThirdSectionCard />
          <ThirdSectionCard />
          <ThirdSectionCard />
          <ThirdSectionCard />
          <ThirdSectionCard />
          <ThirdSectionCard />
          <ThirdSectionCard />
        </Row>
      </main>
    </>
  );
}
