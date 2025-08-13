import { DateTimeFormat, PageContainer, StatusTag } from '@/components';
import { SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Flex, Input, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'umi';
import { useAuthUser } from './model';

export default function AuthUserPage() {
  const { roleId } = useParams();
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
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* 角色信息卡片 */}
        <Card title="角色信息" style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: '#1890ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                marginRight: '16px',
              }}
            >
              {selectedRole.roleName?.charAt(0)?.toUpperCase() || 'R'}
            </div>
            <div>
              <h3 style={{ margin: 0, marginBottom: '4px' }}>
                {selectedRole.roleName}
              </h3>
              <p style={{ margin: 0, color: '#666' }}>{selectedRole.roleKey}</p>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <div style={{ fontWeight: 500, marginBottom: '8px' }}>
              当前用户：
            </div>
            <Space wrap size={4}>
              {selectedRole.users && selectedRole.users.length > 0 ? (
                selectedRole.users.map((user: any) => (
                  <Tag key={user.userId} color="green">
                    {user.username}
                  </Tag>
                ))
              ) : (
                <span style={{ color: '#999' }}>暂无用户</span>
              )}
            </Space>
          </div>

          {selectedRole.remark && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontWeight: 500, marginBottom: '8px' }}>
                角色描述：
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                {selectedRole.remark}
              </div>
            </div>
          )}
        </Card>

        {/* 用户分配表格 */}
        <Card
          title="分配用户"
          extra={
            <Space>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={submitting}
              >
                保存分配
              </Button>
              <Button onClick={handleReset}>重置</Button>
              <Button onClick={handleSelectAll}>全选</Button>
              <Button onClick={handleClearAll}>清空</Button>
            </Space>
          }
        >
          <Flex justify="space-between" align="center">
            <div
              style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}
            >
              可以选择多个用户，选中的用户将拥有该角色的所有权限
            </div>
            {/* 搜索框 */}
            <div style={{ marginBottom: '16px' }}>
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
                render: (text: string) => <DateTimeFormat value={text} />,
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
