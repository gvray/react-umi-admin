import { useEffect, useState } from 'react';
import { styled, useLocation } from 'umi';

// 导航进度条组件
const ProgressBar = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 9999;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transform: ${(props) => (props.visible ? 'scaleX(1)' : 'scaleX(0)')};
  transform-origin: left;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
`;

const NavigationProgress: React.FC = () => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);

    // 路由加载完成后隐藏进度条
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return <ProgressBar visible={isNavigating} />;
};

export default NavigationProgress;
