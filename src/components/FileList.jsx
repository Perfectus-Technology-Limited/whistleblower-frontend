import IconFileEarmarkFill from "@/utils/IconFileEarmarkFill";
import { List, Avatar } from "antd";

const data = [
  {
    title: "Doc 1",
  },
  {
    title: "Doc 2",
  },
  {
    title: "Doc 3",
  },
  {
    title: "Doc 4",
  },
];

export default function FileList() {
  return (
    <div>
      <List
        className="file-list-com"
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  shape="square"
                  size="large"
                  icon={<IconFileEarmarkFill />}
                />
              }
              title={<a href="#">{item.title}</a>}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
