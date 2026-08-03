import { Icon } from '@/components';
import { buildPreferences } from '@/constants/runtime-settings';
import { login, queryMe, queryMenus } from '@/services/auth';
import { getDictionaryItemsByTypeCodes } from '@/services/dictionary';
import { getRuntimeConfig } from '@/services/system';
import { useAuthStore, useDictStore, useSettingStore } from '@/stores';
import { decrypt, encrypt, logger, tokenManager } from '@/utils';
import { runtimeConfig } from '@/utils/runtime-config';
import { Button, Checkbox, Form, Input, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import storetify from 'storetify';
import { useNavigate, useSearchParams } from 'umi';
import LoginBg from './components/LoginBg';
import LoginCard from './components/LoginCard';
import styles from './components/LoginCard/index.less';

const LoginPage: React.FC = () => {
  const { system, feature } = runtimeConfig.get();
  const siteName = system.name;
  const registerEnabled = feature.register;
  const guestAccount = feature.guestAccount;
  const [isLogging, setLogging] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'phone'>('account');
  const [countdown, setCountdown] = useState(0);

  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const loadInitData = async () => {
    let runtimeConfigData: Record<string, unknown> | undefined;
    try {
      const res = await getRuntimeConfig();
      runtimeConfigData = res.data;
    } catch (error) {
      logger.error(error);
    }
    const [meRes, menusRes] = await Promise.all([
      queryMe({ skipErrorHandler: true }).catch(() => undefined),
      queryMenus().catch(() => undefined),
    ]);
    const me = meRes?.data;
    const menus = menusRes?.data;

    runtimeConfig.set(runtimeConfigData);

    useSettingStore.setState({
      ...buildPreferences(runtimeConfig.get().ui),
      ...(me?.preferences || {}),
    });

    if (me) {
      useAuthStore.getState().setAuth(me, menus);
    }
  };

  const handleSubmit = async (values: any) => {
    setLogging(true);
    if (values.rememberMe) {
      const { account, password, rememberMe } = values;
      storetify(
        'rememberMe',
        {
          account,
          password: encrypt(password),
          rememberMe,
        },
        60 * 60 * 24 * 30,
      );
    } else {
      storetify('rememberMe', undefined);
    }
    try {
      const res = await login({ ...values, rememberMe: undefined });
      tokenManager.setTokens(
        res.data.access_token,
        res.data.refresh_token,
        res.data.access_token_expires_in,
        res.data.refresh_token_expires_in,
      );
      await loadInitData();

      try {
        if (!useDictStore.getState().getDict('common_status')) {
          const dictRes = await getDictionaryItemsByTypeCodes({
            typeCodes: 'common_status',
          });
          if (dictRes.data?.common_status) {
            useDictStore
              .getState()
              .setDict('common_status', dictRes.data.common_status);
          }
        }
      } catch (error) {
        logger.error('预加载 common_status 字典失败', error);
      }

      message.success(res.message);

      const redirect = searchParams.get('redirect');
      const safeRedirect =
        redirect && redirect.startsWith('/') && !redirect.startsWith('//')
          ? redirect
          : '/';
      navigate(safeRedirect);
    } catch (error: any) {
      tokenManager.clearTokens();
      if (error?.details?.status === 401) {
        message.error(error.message);
      }
    } finally {
      setLogging(false);
    }
  };

  const handlePhoneSubmit = async (values: any) => {
    message.info('手机号登录功能开发中');
    console.log('手机号登录:', values);
  };

  const sendVerifyCode = () => {
    if (countdown > 0) return;
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const loadRemember = () => {
    const { account, password, rememberMe } =
      (storetify('rememberMe') as any) || {};
    const values = form.getFieldsValue(['account', 'password', 'rememberMe']);
    const loginForm = {
      account: account === undefined ? values.account : account,
      password: password === undefined ? values.password : decrypt(password),
      rememberMe:
        rememberMe === undefined ? values.rememberMe : Boolean(rememberMe),
    };
    form.setFieldsValue(loginForm);
  };

  useEffect(() => {
    loadRemember();
  }, []);

  const AgreementText = () => (
    <div className={styles.agreement}>
      登录视为您已阅读并同意{siteName}
      <a>服务条款</a>和<a>隐私政策</a>
    </div>
  );

  const ForgetLinks = () => (
    <div className={styles.actions}>
      <div className={styles.left}>
        <a>忘记账号</a>
        <a>忘记密码</a>
      </div>
      <div className={styles.right}>
        <Form.Item name="rememberMe" valuePropName="checked" noStyle>
          <Checkbox>
            <FormattedMessage id={'pages.login.rememberMe'} />
          </Checkbox>
        </Form.Item>
      </div>
    </div>
  );

  const SocialLogin = () => (
    <>
      <div className={styles.dividerRow}>其他登录方式</div>
      <div className={styles.socialLogin}>
        <div className={styles.socialMain}>
          <Icon name="GithubFilled" style={{ fontSize: 22 }} />
          <span>GitHub 登录</span>
        </div>
        <div className={styles.socialIconBox}>
          <Icon
            name="WechatFilled"
            style={{ fontSize: 22, color: '#07c160' }}
          />
        </div>
        <div className={styles.socialIconBox}>
          <Icon
            name="AlipayCircleFilled"
            style={{ fontSize: 22, color: '#1677ff' }}
          />
        </div>
        <div className={styles.socialIconBox}>
          <Icon name="MoreOutlined" style={{ fontSize: 22 }} />
        </div>
      </div>
    </>
  );

  return (
    <LoginBg title={siteName}>
      <LoginCard spinning={isLogging}>
        <div className={styles.title}>欢迎开启新世界</div>

        <div className={styles.tabs}>
          <div
            className={`${styles.tab} ${
              activeTab === 'account' ? styles.active : ''
            }`}
            onClick={() => setActiveTab('account')}
          >
            账号登录
          </div>
          <div
            className={`${styles.tab} ${
              activeTab === 'phone' ? styles.active : ''
            }`}
            onClick={() => setActiveTab('phone')}
          >
            手机号登录
          </div>
        </div>

        {activeTab === 'account' ? (
          <Form
            form={form}
            name="login"
            size="large"
            initialValues={{ rememberMe: true }}
            onFinish={async (values) => {
              await handleSubmit(values);
            }}
          >
            <Form.Item
              name="account"
              rules={[
                { required: true, message: '请您输入手机号/用户名/邮箱' },
              ]}
            >
              <Input placeholder="请输入账号名/账号ID" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请您输入密码' }]}
            >
              <Input.Password placeholder="请输入登录密码" />
            </Form.Item>

            {guestAccount && (
              <div className={styles.guestAccount}>
                <span>
                  访客账号：
                  <span style={{ color: '#165dff', fontWeight: 500 }}>
                    {guestAccount.username}
                  </span>
                </span>
                <span style={{ marginLeft: 16 }}>
                  密码：
                  <span style={{ color: '#165dff', fontWeight: 500 }}>
                    {guestAccount.password}
                  </span>
                </span>
              </div>
            )}

            <AgreementText />

            <Form.Item style={{ marginBottom: 16 }}>
              <Button type="primary" htmlType="submit" block>
                <FormattedMessage id={'pages.login.login'} />
              </Button>
            </Form.Item>

            <ForgetLinks />
            <SocialLogin />

            {registerEnabled && (
              <div className={styles.register}>
                没有账号？
                <a onClick={() => navigate('/register')}>去注册</a>
              </div>
            )}
          </Form>
        ) : (
          <Form name="phoneLogin" size="large" onFinish={handlePhoneSubmit}>
            <Form.Item
              name="phone"
              rules={[{ required: true, message: '请输入手机号' }]}
            >
              <Input
                placeholder="请输入手机号"
                addonBefore={
                  <Select
                    defaultValue="+86"
                    variant="borderless"
                    popupMatchSelectWidth={false}
                    style={{ width: 72, color: '#1d2129' }}
                    options={[
                      { value: '+86', label: '+86 中国大陆' },
                      { value: '+852', label: '+852 中国香港' },
                      { value: '+853', label: '+853 中国澳门' },
                      { value: '+886', label: '+886 中国台湾' },
                      { value: '+1', label: '+1 美国 / 加拿大' },
                      { value: '+7', label: '+7 俄罗斯' },
                      { value: '+33', label: '+33 法国' },
                      { value: '+39', label: '+39 意大利' },
                      { value: '+44', label: '+44 英国' },
                      { value: '+49', label: '+49 德国' },
                      { value: '+61', label: '+61 澳大利亚' },
                      { value: '+62', label: '+62 印度尼西亚' },
                      { value: '+63', label: '+63 菲律宾' },
                      { value: '+65', label: '+65 新加坡' },
                      { value: '+66', label: '+66 泰国' },
                      { value: '+81', label: '+81 日本' },
                      { value: '+82', label: '+82 韩国' },
                      { value: '+84', label: '+84 越南' },
                      { value: '+91', label: '+91 印度' },
                      { value: '+92', label: '+92 巴基斯坦' },
                      { value: '+93', label: '+93 阿富汗' },
                      { value: '+94', label: '+94 斯里兰卡' },
                      { value: '+95', label: '+95 缅甸' },
                      { value: '+60', label: '+60 马来西亚' },
                      { value: '+855', label: '+855 柬埔寨' },
                      { value: '+856', label: '+856 老挝' },
                      { value: '+880', label: '+880 孟加拉国' },
                      { value: '+90', label: '+90 土耳其' },
                      { value: '+98', label: '+98 伊朗' },
                      { value: '+34', label: '+34 西班牙' },
                      { value: '+351', label: '+351 葡萄牙' },
                      { value: '+380', label: '+380 乌克兰' },
                      { value: '+7', label: '+7 哈萨克斯坦' },
                      { value: '+996', label: '+996 吉尔吉斯斯坦' },
                      { value: '+998', label: '+998 乌兹别克斯坦' },
                      { value: '+992', label: '+992 塔吉克斯坦' },
                      { value: '+993', label: '+993 土库曼斯坦' },
                      { value: '+374', label: '+374 亚美尼亚' },
                      { value: '+375', label: '+375 白俄罗斯' },
                      { value: '+994', label: '+994 阿塞拜疆' },
                      { value: '+370', label: '+370 立陶宛' },
                      { value: '+371', label: '+371 拉脱维亚' },
                      { value: '+372', label: '+372 爱沙尼亚' },
                      { value: '+48', label: '+48 波兰' },
                      { value: '+420', label: '+420 捷克' },
                      { value: '+421', label: '+421 斯洛伐克' },
                      { value: '+36', label: '+36 匈牙利' },
                      { value: '+43', label: '+43 奥地利' },
                      { value: '+41', label: '+41 瑞士' },
                      { value: '+46', label: '+46 瑞典' },
                      { value: '+47', label: '+47 挪威' },
                      { value: '+45', label: '+45 丹麦' },
                      { value: '+358', label: '+358 芬兰' },
                      { value: '+354', label: '+354 冰岛' },
                      { value: '+353', label: '+353 爱尔兰' },
                      { value: '+32', label: '+32 比利时' },
                      { value: '+31', label: '+31 荷兰' },
                      { value: '+352', label: '+352 卢森堡' },
                      { value: '+377', label: '+377 摩纳哥' },
                      { value: '+30', label: '+30 希腊' },
                      { value: '+40', label: '+40 罗马尼亚' },
                      { value: '+359', label: '+359 保加利亚' },
                      { value: '+386', label: '+386 斯洛文尼亚' },
                      { value: '+387', label: '+387 波黑' },
                      { value: '+385', label: '+385 克罗地亚' },
                      { value: '+382', label: '+382 黑山' },
                      { value: '+383', label: '+383 科索沃' },
                      { value: '+389', label: '+389 北马其顿' },
                      { value: '+381', label: '+381 塞尔维亚' },
                      { value: '+373', label: '+373 摩尔多瓦' },
                      { value: '+20', label: '+20 埃及' },
                      { value: '+27', label: '+27 南非' },
                      { value: '+212', label: '+212 摩洛哥' },
                      { value: '+213', label: '+213 阿尔及利亚' },
                      { value: '+216', label: '+216 突尼斯' },
                      { value: '+218', label: '+218 利比亚' },
                      { value: '+249', label: '+249 苏丹' },
                      { value: '+251', label: '+251 埃塞俄比亚' },
                      { value: '+254', label: '+254 肯尼亚' },
                      { value: '+255', label: '+255 坦桑尼亚' },
                      { value: '+256', label: '+256 乌干达' },
                      { value: '+257', label: '+257 布隆迪' },
                      { value: '+258', label: '+258 莫桑比克' },
                      { value: '+260', label: '+260 赞比亚' },
                      { value: '+261', label: '+261 马达加斯加' },
                      { value: '+263', label: '+263 津巴布韦' },
                      { value: '+264', label: '+264 纳米比亚' },
                      { value: '+265', label: '+265 马拉维' },
                      { value: '+266', label: '+266 莱索托' },
                      { value: '+267', label: '+267 博茨瓦纳' },
                      { value: '+268', label: '+268 斯威士兰' },
                      { value: '+269', label: '+269 科摩罗' },
                      { value: '+290', label: '+290 圣赫勒拿' },
                      { value: '+291', label: '+291 厄立特里亚' },
                      { value: '+297', label: '+297 阿鲁巴' },
                      { value: '+298', label: '+298 法罗群岛' },
                      { value: '+299', label: '+299 格陵兰' },
                      { value: '+52', label: '+52 墨西哥' },
                      { value: '+54', label: '+54 阿根廷' },
                      { value: '+55', label: '+55 巴西' },
                      { value: '+56', label: '+56 智利' },
                      { value: '+57', label: '+57 哥伦比亚' },
                      { value: '+58', label: '+58 委内瑞拉' },
                      { value: '+51', label: '+51 秘鲁' },
                      { value: '+593', label: '+593 厄瓜多尔' },
                      { value: '+595', label: '+595 巴拉圭' },
                      { value: '+598', label: '+598 乌拉圭' },
                      { value: '+502', label: '+502 危地马拉' },
                      { value: '+503', label: '+503 萨尔瓦多' },
                      { value: '+504', label: '+504 洪都拉斯' },
                      { value: '+505', label: '+505 尼加拉瓜' },
                      { value: '+506', label: '+506 哥斯达黎加' },
                      { value: '+507', label: '+507 巴拿马' },
                      { value: '+509', label: '+509 海地' },
                      { value: '+53', label: '+53 古巴' },
                      { value: '+591', label: '+591 玻利维亚' },
                      { value: '+592', label: '+592 圭亚那' },
                      { value: '+597', label: '+597 苏里南' },
                      { value: '+599', label: '+599 库拉索' },
                      { value: '+971', label: '+971 阿联酋' },
                      { value: '+972', label: '+972 以色列' },
                      { value: '+973', label: '+973 巴林' },
                      { value: '+974', label: '+974 卡塔尔' },
                      { value: '+975', label: '+975 不丹' },
                      { value: '+976', label: '+976 蒙古' },
                      { value: '+977', label: '+977 尼泊尔' },
                      { value: '+960', label: '+960 马尔代夫' },
                      { value: '+961', label: '+961 黎巴嫩' },
                      { value: '+962', label: '+962 约旦' },
                      { value: '+963', label: '+963 叙利亚' },
                      { value: '+964', label: '+964 伊拉克' },
                      { value: '+965', label: '+965 科威特' },
                      { value: '+966', label: '+966 沙特阿拉伯' },
                      { value: '+967', label: '+967 也门' },
                      { value: '+968', label: '+968 阿曼' },
                      { value: '+970', label: '+970 巴勒斯坦' },
                      { value: '+350', label: '+350 直布罗陀' },
                      { value: '+355', label: '+355 阿尔巴尼亚' },
                      { value: '+356', label: '+356 马耳他' },
                      { value: '+357', label: '+357 塞浦路斯' },
                      { value: '+376', label: '+376 安道尔' },
                      { value: '+378', label: '+378 圣马力诺' },
                    ]}
                  />
                }
              />
            </Form.Item>
            <Form.Item
              name="verifyCode"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Input
                placeholder="请输入验证码"
                suffix={
                  <Button
                    type="link"
                    disabled={countdown > 0}
                    onClick={sendVerifyCode}
                    style={{
                      padding: 0,
                      color: countdown > 0 ? '#c9cdd4' : '#165dff',
                      fontSize: 14,
                    }}
                  >
                    {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
                  </Button>
                }
              />
            </Form.Item>

            <AgreementText />

            <Form.Item style={{ marginBottom: 16 }}>
              <Button type="primary" htmlType="submit" block>
                登录 / 注册
              </Button>
            </Form.Item>

            <SocialLogin />
          </Form>
        )}
      </LoginCard>
    </LoginBg>
  );
};

export default LoginPage;
