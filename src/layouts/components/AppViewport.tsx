import { Layout } from 'antd';
import { styled } from 'umi';

const { Content } = Layout;

const AppViewport = styled(Content)`
  position: relative;
  overflow: auto;
  min-height: unset;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export default AppViewport;
