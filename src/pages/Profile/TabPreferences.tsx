import { THEME_MODE_LABELS, ThemeModeWithoutSystem } from '@/constants';
import { useThemeStore } from '@/stores';
import {
  BellOutlined,
  LayoutOutlined,
  SettingOutlined,
  SkinOutlined,
} from '@ant-design/icons';
import { Card, Col, List, Row, Select, Switch, Typography } from 'antd';
import { useState } from 'react';
import styles from './index.less';

const { Text } = Typography;

const TabPreferences: React.FC = () => {
  const { themeMode, setThemeMode } = useThemeStore();
  const [prefs, setPrefs] = useState({
    breadcrumb: true,
    tableDense: false,
    autoSave: true,
    shortcuts: true,
    emailNotif: true,
    smsNotif: false,
    pushNotif: true,
  });

  const handleThemeModeChange = (value: string) => {
    setThemeMode(value as ThemeModeWithoutSystem);
  };

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Row gutter={[16, 16]}>
      {/* 外观与布局 */}
      <Col span={12}>
        <Card
          title={
            <>
              <SkinOutlined /> 外观与布局
            </>
          }
          size="small"
          className={styles.prefCard}
        >
          <List
            dataSource={[
              {
                title: '主题模式',
                desc: '切换浅色 / 深色主题',
                extra: (
                  <Select
                    value={themeMode}
                    onChange={handleThemeModeChange}
                    style={{ width: 110 }}
                    options={Object.entries(THEME_MODE_LABELS).map(
                      ([value, label]) => ({ value, label }),
                    )}
                  />
                ),
              },
              {
                title: '布局模式',
                desc: '侧边栏 / 顶部导航',
                extra: (
                  <Select
                    defaultValue="side"
                    style={{ width: 110 }}
                    options={[
                      { value: 'side', label: '侧边栏' },
                      { value: 'top', label: '顶部导航' },
                    ]}
                  />
                ),
              },
              {
                title: '语言',
                desc: '界面显示语言',
                extra: (
                  <Select
                    defaultValue="zh-CN"
                    style={{ width: 110 }}
                    options={[
                      { value: 'zh-CN', label: '简体中文' },
                      { value: 'en-US', label: 'English' },
                    ]}
                  />
                ),
              },
              {
                title: '显示面包屑',
                desc: '页面顶部导航路径',
                extra: (
                  <Switch
                    checked={prefs.breadcrumb}
                    onChange={() => toggle('breadcrumb')}
                  />
                ),
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<LayoutOutlined style={{ color: '#8c8c8c' }} />}
                  title={<Text style={{ fontSize: 13 }}>{item.title}</Text>}
                  description={
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.desc}
                    </Text>
                  }
                />
                {item.extra}
              </List.Item>
            )}
          />
        </Card>
      </Col>

      {/* 数据与表格 */}
      <Col span={12}>
        <Card
          title={
            <>
              <SettingOutlined /> 数据与表格
            </>
          }
          size="small"
          className={styles.prefCard}
        >
          <List
            dataSource={[
              {
                title: '默认首页',
                desc: '登录后跳转的页面',
                extra: (
                  <Select
                    defaultValue="/dashboard"
                    style={{ width: 130 }}
                    options={[
                      { value: '/dashboard', label: '仪表盘' },
                      { value: '/profile', label: '个人中心' },
                    ]}
                  />
                ),
              },
              {
                title: '表格密度',
                desc: '数据表格行间距',
                extra: (
                  <Select
                    defaultValue="default"
                    style={{ width: 110 }}
                    options={[
                      { value: 'default', label: '默认' },
                      { value: 'middle', label: '中等' },
                      { value: 'small', label: '紧凑' },
                    ]}
                  />
                ),
              },
              {
                title: '默认分页数',
                desc: '每页显示条数',
                extra: (
                  <Select
                    defaultValue="10"
                    style={{ width: 110 }}
                    options={[
                      { value: '10', label: '10 条/页' },
                      { value: '20', label: '20 条/页' },
                      { value: '50', label: '50 条/页' },
                    ]}
                  />
                ),
              },
              {
                title: '自动保存',
                desc: '自动保存表单草稿',
                extra: (
                  <Switch
                    checked={prefs.autoSave}
                    onChange={() => toggle('autoSave')}
                  />
                ),
              },
              {
                title: '快捷键',
                desc: '启用键盘快捷操作',
                extra: (
                  <Switch
                    checked={prefs.shortcuts}
                    onChange={() => toggle('shortcuts')}
                  />
                ),
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<SettingOutlined style={{ color: '#8c8c8c' }} />}
                  title={<Text style={{ fontSize: 13 }}>{item.title}</Text>}
                  description={
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.desc}
                    </Text>
                  }
                />
                {item.extra}
              </List.Item>
            )}
          />
        </Card>
      </Col>

      {/* 消息提醒 */}
      <Col span={24}>
        <Card
          title={
            <>
              <BellOutlined /> 消息提醒
            </>
          }
          size="small"
          className={styles.prefCard}
        >
          <Row gutter={16}>
            <Col span={8}>
              <List
                dataSource={[
                  {
                    title: '邮件通知',
                    desc: '接收系统邮件',
                    key: 'emailNotif' as const,
                  },
                  {
                    title: '短信通知',
                    desc: '接收重要短信',
                    key: 'smsNotif' as const,
                  },
                  {
                    title: '推送通知',
                    desc: '浏览器推送',
                    key: 'pushNotif' as const,
                  },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<BellOutlined style={{ color: '#8c8c8c' }} />}
                      title={<Text style={{ fontSize: 13 }}>{item.title}</Text>}
                      description={
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.desc}
                        </Text>
                      }
                    />
                    <Switch
                      checked={prefs[item.key]}
                      onChange={() => toggle(item.key)}
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default TabPreferences;
