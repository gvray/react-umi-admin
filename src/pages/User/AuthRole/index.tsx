import { DateTimeFormat, PageContainer, StatusTag } from '@/components';
import { Avatar, Button, Card, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'umi';
import { useAuthRole } from './model';

export default function AuthRolePage() {
  const { userId } = useParams();
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
      <PageContainer
      // title="用户角色分配"
      // subTitle="为用户分配系统角色，控制用户权限"
      >
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
      <PageContainer
      // title="用户角色分配"
      // subTitle="为用户分配系统角色，控制用户权限"
      >
        <Card loading={true} />
      </PageContainer>
    );
  }

  if (!selectedUser) {
    return (
      <PageContainer
      // title="用户角色分配"
      // subTitle="为用户分配系统角色，控制用户权限"
      >
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
    <PageContainer
    //   title="用户角色分配"
    //   subTitle="为用户分配系统角色，控制用户权限"
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* 用户信息卡片 */}
        <Card title="用户信息" style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <Avatar
              src={selectedUser.avatar}
              size={64}
              style={{ marginRight: '16px' }}
            >
              {selectedUser.username.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <h3 style={{ margin: 0, marginBottom: '4px' }}>
                {selectedUser.username}
              </h3>
              <p style={{ margin: 0, color: '#666' }}>{selectedUser.email}</p>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <div style={{ fontWeight: 500, marginBottom: '8px' }}>
              当前角色：
            </div>
            <Space wrap size={4}>
              {selectedUser.roles && selectedUser.roles.length > 0 ? (
                selectedUser.roles.map((role: any) => (
                  <Tag key={role.roleId} color="blue">
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
          title="分配角色"
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
          <div
            style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}
          >
            可以选择多个角色，用户将拥有所选角色的所有权限
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
                render: (text: string) => <DateTimeFormat value={text} />,
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
