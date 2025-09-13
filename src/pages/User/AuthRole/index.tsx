import {
  AuthButton,
  DateTimeFormat,
  PageContainer,
  StatusTag,
} from '@/components';
import {
  ArrowLeftOutlined,
  KeyOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'umi';
import { useAuthRole } from './model';

const { Title, Text } = Typography;

export default function AuthRolePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const {
    roles,
    selectedUser,
    loading,
    submitting,
    initializeData,
    submitRoleAssignment,
  } = useAuthRole(userId);

  useEffect(() => {
    if (userId) {
      initializeData(userId);
    }
  }, [initializeData, userId]);

  // 当用户数据加载完成后，设置初始选中的角色
  useEffect(() => {
    if (selectedUser?.roles) {
      setSelectedRoleIds(selectedUser.roles.map((role: any) => role.roleId));
    }
  }, [selectedUser]);

  // 返回用户列表页面
  const handleBackToUsers = () => {
    navigate('/system/user');
  };

  // 提交角色分配
  const handleSubmit = async () => {
    if (!selectedUser) return;

    const success = await submitRoleAssignment({
      roleIds: selectedRoleIds,
    });

    if (success) {
      // 刷新用户数据
      await initializeData(userId);
    }
  };

  // 重置选择
  const handleReset = () => {
    if (selectedUser?.roles) {
      setSelectedRoleIds(selectedUser.roles.map((role: any) => role.roleId));
    }
  };

  // 全选
  const handleSelectAll = () => {
    const allRoleIds = roles.map((role: any) => role.roleId);
    setSelectedRoleIds(allRoleIds);
  };

  // 清空选择
  const handleClearAll = () => {
    setSelectedRoleIds([]);
  };

  if (!userId) {
    return (
      <PageContainer>
        <Card>
          <div
            style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}
          >
            请提供用户ID来分配角色
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

  if (!selectedUser) {
    return (
      <PageContainer>
        <Card>
          <div
            style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}
          >
            未找到用户信息
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
                onClick={handleBackToUsers}
                style={{ padding: 0, marginBottom: 8 }}
              >
                返回用户列表
              </Button>
              <div>
                <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
                  <KeyOutlined
                    style={{ marginRight: '8px', color: '#1890ff' }}
                  />
                  用户角色分配
                </Title>
                <Text type="secondary">
                  为用户分配系统角色，控制用户权限访问
                </Text>
              </div>
            </Col>
            <Col>
              <Space>
                <AuthButton
                  type="primary"
                  onClick={handleSubmit}
                  loading={submitting}
                  icon={<KeyOutlined />}
                  perms={['system:user:manage']}
                >
                  保存分配
                </AuthButton>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 用户信息卡片 */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              用户信息
            </div>
          }
          style={{ marginBottom: '16px' }}
        >
          <Row gutter={24}>
            <Col span={8}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={selectedUser.avatar}
                  size={80}
                  style={{ marginRight: '16px' }}
                >
                  {selectedUser.username.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <Title level={4} style={{ margin: 0, marginBottom: '4px' }}>
                    {selectedUser.username}
                  </Title>
                  <Text type="secondary">{selectedUser.email}</Text>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <Text strong>用户ID：</Text>
                <Text ellipsis code copyable>
                  {selectedUser.userId}
                </Text>
              </div>
              <div style={{ marginTop: '8px' }}>
                <Text strong>状态：</Text>
                <StatusTag status={selectedUser.status} />
              </div>
            </Col>
            <Col span={8}>
              <div>
                <Text strong>当前角色数量：</Text>
                <Text style={{ color: '#1890ff', fontWeight: 'bold' }}>
                  {selectedUser.roles?.length || 0} 个
                </Text>
              </div>
              <div style={{ marginTop: '8px' }}>
                <Text strong>创建时间：</Text>
                <DateTimeFormat value={selectedUser.createdAt} />
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
              <Text strong>当前角色：</Text>
            </div>
            <Space wrap size={4}>
              {selectedUser.roles && selectedUser.roles.length > 0 ? (
                selectedUser.roles.map((role: any) => (
                  <Tag
                    key={role.roleId}
                    color="blue"
                    style={{ padding: '4px 8px' }}
                  >
                    {role.name}
                  </Tag>
                ))
              ) : (
                <span style={{ color: '#999' }}>暂无角色</span>
              )}
            </Space>
          </div>
        </Card>

        {/* 角色分配表格 */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <KeyOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
              分配角色
            </div>
          }
          extra={
            <Space>
              <Button onClick={handleSelectAll}>全选</Button>
              <Button onClick={handleClearAll}>清空</Button>
            </Space>
          }
        >
          <div
            style={{
              marginBottom: '16px',
              color: '#666',
              fontSize: '14px',
              padding: '12px 16px',
              backgroundColor: '#f6f8fa',
              borderRadius: '6px',
              border: '1px solid #e1e4e8',
            }}
          >
            <Text>
              可以选择多个角色，用户将拥有所选角色的所有权限。当前已选择
              <Text strong style={{ color: '#1890ff' }}>
                {' '}
                {selectedRoleIds.length}{' '}
              </Text>
              个角色。
            </Text>
          </div>

          <Table
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: selectedRoleIds,
              onChange: (selectedRowKeys) => {
                setSelectedRoleIds(selectedRowKeys as string[]);
              },
              getCheckboxProps: () => ({
                disabled: false,
              }),
            }}
            columns={[
              {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name',
                render: (text: string, record: any) => (
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>
                      {text}
                    </div>
                    {record.remark && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#666',
                          marginTop: '2px',
                        }}
                      >
                        {record.remark}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                title: '角色编码',
                dataIndex: 'roleKey',
                key: 'roleKey',
                width: 120,
                render: (text: string) => <Tag color="blue">{text}</Tag>,
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
            dataSource={roles}
            rowKey="roleId"
            size="small"
            pagination={false}
            scroll={{ y: 300 }}
          />
        </Card>
      </div>
    </PageContainer>
  );
}
