import { Layout, Typography } from "antd";

const { Footer } = Layout;
const { Text } = Typography;

const FooterMenu = () => (
  <Footer style={{ textAlign: "center" }}>
    <Text type="secondary">©2023 Created by Yos Sularko</Text>
  </Footer>
);

export default FooterMenu;
