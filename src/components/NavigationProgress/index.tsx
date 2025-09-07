import { useEffect, useState } from 'react';
import { history, styled, useLocation } from 'umi';
// 解耦请求，仅根据路由变化来展示

// 容器：仅处理显隐（淡出），不再反向回退
const ProgressContainer = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 9999;
  background: transparent;
  opacity: ${(p) => (p.visible ? 1 : 0)};
  transition: opacity 200ms ease;
  pointer-events: none;
`;

// 内条：只做从左到右的前向动画
const ProgressInner = styled.div<{ $progress: number }>`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
  transform-origin: left;
  transform: ${({ $progress }) => `scaleX(${$progress})`};
  transition: transform 120ms ease-out;
`;

const NavigationProgress: React.FC = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useState<{ id: any }>({ id: null })[0];

  const start = () => {
    // 开始：显示并缓慢推进到 ~90%
    setVisible(true);
    setProgress(0.05);
    if (timerRef.id) clearInterval(timerRef.id);
    timerRef.id = setInterval(() => {
      setProgress((p) => {
        const next = p + (0.9 - p) * 0.2; // 趋近 0.9
        return next > 0.9 ? 0.9 : next;
      });
    }, 200);
  };

  const finish = () => {
    if (timerRef.id) {
      clearInterval(timerRef.id);
      timerRef.id = null;
    }
    // 快速完成到 100%，随后淡出
    setProgress(1);
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 150);
  };

  useEffect(() => {
    // 监听路由变化动作，尽可能在切换开始时启动
    const unlisten = history.listen(() => {
      start();
    });
    return unlisten;
  }, []);

  useEffect(() => {
    // 新路由渲染完成时，立刻快速结束
    if (visible) {
      finish();
    }
  }, [location.pathname]);

  return (
    <ProgressContainer visible={visible}>
      {visible && <ProgressInner $progress={progress} />}
    </ProgressContainer>
  );
};

export default NavigationProgress;
