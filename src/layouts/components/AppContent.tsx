import { Layout } from 'antd';
import { styled } from 'umi';

const { Content } = Layout;

const AppContent = styled(Content)<{ $fixed: boolean }>`
  position: relative;
  overflow: auto;

  height: ${({ $fixed }) => ($fixed ? 'calc(100vh - 64px)' : 'auto')};

  min-height: ${({ $fixed }) => ($fixed ? 'unset' : 'calc(100vh - 64px)')};
`;

export default AppContent;
