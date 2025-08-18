import { DateTimeFormat, PageContainer, StatusTag } from '@/components';
import {
  ArrowLeftOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Flex,
  Input,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'umi';
import { useAuthUser } from './model';

const { Title, Text } = Typography;

export default function AuthUserPage() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const {
    users,
    selectedRole,
    loading,
    submitting,
    initializeData,
    submitUserAssignment,
  } = useAuthUser(roleId);

  useEffect(() => {
    if (roleId) {
      initializeData(roleId);
    }
  }, [initializeData, roleId]);

  // 当角色数据加载完成后，设置初始选中的用户
  useEffect(() => {
    if (selectedRole?.users) {
      setSelectedUserIds(selectedRole.users.map((user: any) => user.userId));
    }
  }, [selectedRole]);

  // 返回角色列表页面
  const handleBackToRoles = () => {
    navigate('/system/role');
  };

  // 提交用户分配
  const handleSubmit = async () => {
    if (!selectedRole) return;

    const success = await submitUserAssignment({
      roleId: selectedRole.roleId,
      userIds: selectedUserIds,
    });

    if (success) {
      // 刷新角色数据
      await initializeData(roleId);
    }
  };

  // 重置选择
  const handleReset = () => {
    if (selectedRole?.users) {
      setSelectedUserIds(selectedRole.users.map((user: any) => user.userId));
    }
  };

  // 全选
  const handleSelectAll = () => {
    const allUserIds = users.map((user: any) => user.userId);
    setSelectedUserIds(allUserIds);
  };

  // 清空选择
  const handleClearAll = () => {
    setSelectedUserIds([]);
  };

  // 过滤用户数据
  const filteredUsers = users.filter((user: any) => {
    if (!searchText) return true;
    return (
      user.nickname?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  if (!roleId) {
    return (
      <PageContainer>
        <Card>
          <div
            style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}
          >
            请提供角色ID来分配用户
          </div>
        </Card>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <Card loading={true} />
      </PageContainer>
    );
  }

  if (!selectedRole) {
    return (
      <PageContainer>
        <Card>
          <div
            style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}
          >
            未找到角色信息
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 页面头部导航 */}
        <Card style={{ marginBottom: '16px' }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={handleBackToRoles}
                style={{ padding: 0, marginBottom: 8 }}
              >
                返回角色列表
              </Button>
              <div>
                <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
                  <TeamOutlined
                    style={{ marginRight: '8px', color: '#1890ff' }}
                  />
                  角色用户分配
                </Title>
                <Text type="secondary">为角色分配用户，控制用户权限访问</Text>
              </div>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  loading={submitting}
                  icon={<TeamOutlined />}
                >
                  保存分配
                </Button>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 角色信息卡片 */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              角色信息
            </div>
          }
          style={{ marginBottom: '16px' }}
        >
          <Row gutter={24}>
            <Col span={8}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: '#1890ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    marginRight: '16px',
                  }}
                >
                  {selectedRole.roleName?.charAt(0)?.toUpperCase() || 'R'}
                </div>
                <div>
                  <Title level={4} style={{ margin: 0, marginBottom: '4px' }}>
                    {selectedRole.roleName}
                  </Title>
                  <Text type="secondary">{selectedRole.roleKey}</Text>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <Text strong>角色ID：</Text>
                <Text code>{selectedRole.roleId}</Text>
              </div>
              <div style={{ marginTop: '8px' }}>
                <Text strong>状态：</Text>
                <StatusTag status={selectedRole.status} />
              </div>
            </Col>
            <Col span={8}>
              <div>
                <Text strong>当前用户数量：</Text>
                <Text style={{ color: '#1890ff', fontWeight: 'bold' }}>
                  {selectedRole.users?.length || 0} 个
                </Text>
              </div>
              <div style={{ marginTop: '8px' }}>
                <Text strong>创建时间：</Text>
                <DateTimeFormat value={selectedRole.createdAt} />
              </div>
            </Col>
          </Row>

          <div
            style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #f0f0f0',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <TeamOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
              <Text strong>当前用户：</Text>
            </div>
            <Space wrap size={4}>
              {selectedRole.users && selectedRole.users.length > 0 ? (
                selectedRole.users.map((user: any) => (
                  <Tag
                    key={user.userId}
                    color="green"
                    style={{ padding: '4px 8px' }}
                  >
                    {user.username}
                  </Tag>
                ))
              ) : (
                <span style={{ color: '#999' }}>暂无用户</span>
              )}
            </Space>
          </div>

          {selectedRole.remark && (
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #f0f0f0',
              }}
            >
              <div style={{ fontWeight: 500, marginBottom: '8px' }}>
                角色描述：
              </div>
              <div
                style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}
              >
                {selectedRole.remark}
              </div>
            </div>
          )}
        </Card>

        {/* 用户分配表格 */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TeamOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
              分配用户
            </div>
          }
          extra={
            <Space>
              <Button onClick={handleSelectAll}>全选</Button>
              <Button onClick={handleClearAll}>清空</Button>
            </Space>
          }
        >
          <Flex
            justify="space-between"
            align="center"
            style={{ marginBottom: '16px' }}
          >
            <div
              style={{
                color: '#666',
                fontSize: '14px',
                padding: '12px 16px',
                backgroundColor: '#f6f8fa',
                borderRadius: '6px',
                border: '1px solid #e1e4e8',
              }}
            >
              <Text>
                可以选择多个用户，选中的用户将拥有该角色的所有权限。当前已选择
                <Text strong style={{ color: '#1890ff' }}>
                  {' '}
                  {selectedUserIds.length}{' '}
                </Text>
                个用户。
              </Text>
            </div>
            {/* 搜索框 */}
            <div>
              <Input
                placeholder="搜索用户昵称、用户名或邮箱"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ width: '300px' }}
              />
              {searchText && (
                <span
                  style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}
                >
                  找到 {filteredUsers.length} 个用户
                </span>
              )}
            </div>
          </Flex>
          <Table
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: selectedUserIds,
              onChange: (selectedRowKeys) => {
                setSelectedUserIds(selectedRowKeys as string[]);
              },
              getCheckboxProps: () => ({
                disabled: false,
              }),
            }}
            columns={[
              {
                title: '用户信息',
                dataIndex: 'username',
                key: 'username',
                render: (text: string, record: any) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={record.avatar}
                      size="small"
                      style={{ marginRight: '8px' }}
                    >
                      {text.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '14px' }}>
                        {text}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {record.email}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: '昵称',
                dataIndex: 'nickname',
                key: 'nickname',
                width: 120,
                render: (text: string) => (
                  <span style={{ fontSize: '12px' }}>{text || '-'}</span>
                ),
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 80,
                render: (status: number) => <StatusTag status={status} />,
              },
              {
                title: '创建时间',
                dataIndex: 'createdAt',
                key: 'createdAt',
                width: 120,
                render: (time: string) => <DateTimeFormat value={time} />,
              },
            ]}
            dataSource={filteredUsers}
            rowKey="userId"
            size="small"
            pagination={false}
            scroll={{ y: 300 }}
          />
        </Card>
      </div>
    </PageContainer>
  );
}
