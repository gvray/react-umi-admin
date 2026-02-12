import styles from './index.less';

interface LoginBgProps {
  children: React.ReactNode;
  title?: string;
}

const LoginBg: React.FC<LoginBgProps> = ({ children, title }) => {
  return (
    <div className={styles.loginWarp}>
      <div className={styles.loginBg} />
      <div className={styles.loginTitle}>
        <img className={styles.logoImg} src="/logo-dark.svg" />
        <strong>{title}</strong>
      </div>
      <div className={styles.loginText}>
        <h3>用真诚</h3>
        <p>让复杂的世界更美好</p>
      </div>
      <div className={styles.loginForm}>{children}</div>
    </div>
  );
};

export default LoginBg;
