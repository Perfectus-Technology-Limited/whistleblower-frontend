import FileList from "@/components/FileList";
import Loader from "@/components/Loader";
import IconArrowDownSquareFill from "@/utils/IconArrowDownSquareFill";
import IconArrowUpSquareFill from "@/utils/IconArrowUpSquareFill";
import IconBxUserCircle from "@/utils/IconBxUserCircle";
import { Avatar, Col, Row } from "antd";
import { Empty } from "antd";
import { useState } from "react";

export default function Details() {
  const [like, setLike] = useState(0);
  const [dislike, setDislike] = useState(0);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [router]);

  if (isLoading) {
    return <Loader />;
  }

  const IncreeseHandle = () => {
    setLike(like + 1);
  };

  const DecreeseHandle = () => {
    setDislike(dislike + 1);
  };

  return (
    <div className="detais-page-main-div">
      <Row
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
        }}
        className="display-page-header-row"
        gutter={32}
      >
        <Col
          className="display-page-title"
          xl={24}
          lg={16}
          md={24}
          sm={24}
          xs={24}
        >
          <h1 style={{ color: "#fff", fontSize: "30px" }}>
            Dealmaker: Al Yousef
          </h1>
          <h3 style={{ color: "#fff" }}>08/02/2023</h3>
        </Col>
      </Row>

      <Row className="post-row" gutter={32}>
        <Col xl={4} lg={6} md={4} sm={4} xs={4} className="post-rating-col">
          <div className="post-rater">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <IconArrowUpSquareFill
                  onClick={IncreeseHandle}
                  height={"2.5em"}
                  width={"2.5em"}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div style={{ fontSize: "25px", marginLeft: "10px" }}>{like}</div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <IconArrowDownSquareFill
                  onClick={DecreeseHandle}
                  height={"2.5em"}
                  width={"2.5em"}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div style={{ fontSize: "25px", marginLeft: "10px" }}>
                {dislike}
              </div>
            </div>
          </div>
        </Col>
        <Col xl={12} lg={12} md={20} sm={20} xs={20} className="post-col">
          <p style={{ color: "#fff" }} className="post-text">
            Today WikiLeaks publishes a secret document from the International
            Chamber of Commerce (ICC) International Court of Arbitration,
            pertaining to a dispute over commission payment in relation to a
            $3.6 billion arms deal between French state-owned company GIAT
            Industries SA (now Nexter Systems) and the United Arab Emirates
            (UAE). The agreement was for the sale of 388 Leclerc combat tanks,
            46 armoured vehicles, 2 training tanks, spare parts and ammunition.
            It was signed in 1993 and scheduled to be completed in 2008. The
            case brought before the ICC arbitration tribunal was a claim from
            Abbas Ibrahim Yousef Al Yousef, a UAE businessman, that GIAT had not
            honoured a contract to pay him a 6,5% commission on the deal or
            almost $235 million total. GIAT stopped paying after sending Al
            Yousef over $195 million through his company Kenoza Consulting &
            Management Inc., which was registered in the British Virgin Islands.
            Al Yousef demanded the nearly $40 million that remained outstanding.
            GIAT's lawyers maintained that they had to stop payments as they
            became illegal when the OECD Anti-Corruption Convention was
            transposed into French law in the year 2000. They claimed "Kenoza
            intended to commit and indeed committed corruption acts". Al Yousef
            firmly denied that any part of the commission had been used to bribe
            UAE officials or used in any corrupt acts. As GIAT did not produce
            any evidence for the claim, the ICC Tribunal did not rule on the
            issue but noted that "...if the excessive nature of the compensation
            for the Claimants service must be taken as evidence of a corrupt
            purpose of the Agency Agreement, this purpose must have been known
            and intended by both Parties to the agreement". The Tribunal did
            investigate what services Al Yousef provided to justify the
            excessive commission. Despite claims to the contrary, the Tribunal
            found that Al Yousef did not play an important role in the
            development of the Leclerc tank. The tanks were fitted with German
            engines, which created an obstacle as this would violate laws
            forbidding German arms sales to the Middle East. Al Yousef claimed
            he had successfully lobbied German authorities to obtain a waiver
            from these laws in "...a process which involved decision makers at
            the highest levels, both in France and Germany". During a witness
            statement, Al Yousef could not remember the names of any German
            officials and told the Tribunal he had used lobbyists instead of
            meeting with German authorities directly. Surprisingly, Al Yousef
            told the Tribunal that had he been on a retainer, he would have
            asked GIAT to pay him a million dollars a month as a consultant.
            That would have brought him $51 million to $60 million rather than
            nearly $235 million. As a result, the Tribunal concluded that
            "...the contractual commission rates is far above anything that
            could be justified (...). The remuneration is excessive by the
            standard which Mr Al Yousef himself set and by any standard which
            was raised in the arbitration". His claims were dismissed and Al
            Yousef was ordered to pay the entire cost of arbitration by the
            Tribunal ($550 000) plus a portion of GIAT’s legal costs (€115 000).
          </p>
        </Col>
        <Col xl={8} lg={6} md={24} sm={24} xs={24} className="leaked-doc-col">
          <h2>Leaked Documents</h2>
          <div style={{ paddingTop: "40px" }}>
            {/* <Empty style={{ color: "#ffffff" }} /> */}
            <FileList />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingTop: "40px",
            }}
          >
            <div>
              <Avatar size={72} icon={<IconBxUserCircle />} />
            </div>
            <div style={{ color: "#ffffff" }}>
              <p
                style={{
                  width: "300px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                0x5b9141b2258A45B133b61D32112fC9369D95Af24
              </p>
              <p>09/02/2023</p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
