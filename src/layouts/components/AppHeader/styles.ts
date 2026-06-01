import { Avatar, Layout } from 'antd';
import { styled } from 'umi';

const { Header } = Layout;

export const HeaderWrapper = styled(Header)<{
  $bgColor: string;
  $fixed: boolean;
}>`
  padding: 0;
  background: ${({ $bgColor }) => $bgColor};
  position: ${({ $fixed }) => ($fixed ? 'sticky' : 'relative')};
  top: 0;
  z-index: 100;
`;

export const HeaderActions = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-inline: 24px;
`;

export const UserAvatar = styled(Avatar)<{
  $backgroundColor?: string;
}>`
  cursor: pointer;

  ${({ $backgroundColor }) =>
    $backgroundColor &&
    `
      background-color: ${$backgroundColor};
    `}
`;
