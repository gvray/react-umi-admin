import { getDepartmentTree } from '@/services/department';
import {
  assignRoleDataScopes,
  getRole,
  getRoleDataScopes,
} from '@/services/role';
import { DatabaseOutlined, EyeOutlined, TeamOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Modal,
  Radio,
  Row,
  Space,
  Tag,
  Tree,
  Typography,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { styled } from 'umi';

const { Text } = Typography;

// Styled Components
const PermissionTypeOption = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #1890ff;
    background-color: #f6f8fa;
  }

  &.selected {
    border-color: #1890ff;
    background-color: #e6f7ff;
  }

  .option-icon {
    margin-right: 12px;
    font-size: 16px;
    color: #1890ff;
  }

  .option-content {
    flex: 1;

    .option-title {
      font-weight: 500;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .option-description {
      font-size: 12px;
      color: #666;
      line-height: 1.4;
    }
  }

  .option-radio {
    margin-left: 12px;
  }
`;

const DepartmentTreeContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 12px;
  background: #fafafa;
`;

export enum DataScope {
  SELF = 1, // 仅本人数据权限
  DEPARTMENT = 2, // 本部门数据权限
  DEPARTMENT_AND_CHILD = 3, // 本部门及以下数据权限
  CUSTOM = 4, // 自定义数据权限
  ALL = 5, // 全部数据权限
}

// 数据权限类型配置
const PERMISSION_TYPES = [
  {
    value: DataScope.ALL,
    label: '全部数据权限',
    description: '可以访问所有数据，不受任何限制',
    icon: <DatabaseOutlined />,
    color: '#52c41a',
  },
  {
    value: DataScope.DEPARTMENT,
    label: '本部门数据权限',
    description: '只能访问当前用户所在部门的数据',
    icon: <TeamOutlined />,
    color: '#fa8c16',
  },
  {
    value: DataScope.DEPARTMENT_AND_CHILD,
    label: '本部门及以下数据权限',
    description: '可以访问当前用户所在部门及其下级部门的数据',
    icon: <TeamOutlined />,
    color: '#722ed1',
  },
  {
    value: DataScope.CUSTOM,
    label: '自定义数据权限',
    description: '可以自定义访问特定部门的数据',
    icon: <EyeOutlined />,
    color: '#1890ff',
  },
  {
    value: DataScope.SELF,
    label: '仅本人数据权限',
    description: '只能访问自己创建或负责的数据',
    icon: <EyeOutlined />,
    color: '#eb2f96',
  },
];

interface RoleState {
  roleId: string;
  roleName: string;
  roleKey: string;
}

interface DataPermissionModalProps {
  visible: boolean;
  roleId: string;
  roleName: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function DataPermissionModal({
  visible,
  roleId,
  roleName,
  onCancel,
  onSuccess,
}: DataPermissionModalProps) {
  const [currentRole, setCurrentRole] = useState<RoleState | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [dataScope, setDataScope] = useState<DataScope>(DataScope.SELF);
  const [selectedDeptIds, setSelectedDeptIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const initializeData = async () => {
    setLoading(true);
    try {
      const [roleRes, dataScopesRes, departmentsRes] = await Promise.all([
        getRole(roleId),
        getRoleDataScopes(roleId),
        getDepartmentTree(),
      ]);
      setCurrentRole({
        ...roleRes.data,
      });

      // 设置当前数据权限配置
      if (dataScopesRes.data) {
        console.log('数据权限配置:', dataScopesRes.data);
        setDataScope(dataScopesRes.data.dataScope);
        if (dataScopesRes.data.dataScope === DataScope.CUSTOM) {
          setSelectedDeptIds(
            dataScopesRes.data.departments?.map(
              (item: any) => item.departmentId,
            ) || [],
          );
        }
      }

      setDepartments(departmentsRes.data || []);
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    if (visible && roleId) {
      initializeData();
    }
  }, [visible, roleId]);

  // 处理权限类型选择
  const handlePermissionTypeChange = (newDataScope: DataScope) => {
    setDataScope(newDataScope);
    // 如果不是自定义权限，清除部门选择
    if (newDataScope !== DataScope.CUSTOM) {
      setSelectedDeptIds([]);
    }
  };

  // 处理部门选择
  const handleDepartmentChange = (deptIds: string[]) => {
    setSelectedDeptIds(deptIds);
  };

  // 提交数据权限分配
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // 数据权限是角色的全局设置，包装成数组格式
      const dataScopesData: {
        dataScope: number;
        departmentIds?: string[];
      } = {
        dataScope: dataScope,
        departmentIds: selectedDeptIds,
      };
      if (dataScope !== DataScope.CUSTOM) {
        delete dataScopesData.departmentIds;
      }

      console.log('提交的数据权限配置:', dataScopesData);

      await assignRoleDataScopes(roleId, dataScopesData);
      message.success('数据权限分配成功');
      onSuccess?.();
      onCancel?.();
    } catch (error) {
      message.error('数据权限分配失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 重置选择
  const handleReset = () => {
    setDataScope(DataScope.SELF);
    setSelectedDeptIds([]);
  };

  // 将部门数据转换为树形结构
  const convertToTreeData = (deptList: any[]): any[] => {
    return deptList.map((dept) => ({
      title: (
        <Space>
          <span>{dept.name}</span>
          <Tag color="blue">{dept.description}</Tag>
        </Space>
      ),
      key: dept.departmentId,
      children: dept.children ? convertToTreeData(dept.children) : undefined,
    }));
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DatabaseOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          数据权限分配 - {currentRole?.roleName || roleName}
          {currentRole?.roleKey && (
            <Tag color="blue" style={{ marginLeft: '8px' }}>
              {currentRole.roleKey}
            </Tag>
          )}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="reset" onClick={handleReset}>
          重置
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={submitting}
          onClick={handleSubmit}
        >
          保存分配
        </Button>,
      ]}
      destroyOnClose
    >
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            加载中...
          </div>
        ) : (
          <div>
            {/* 数据权限类型选择 */}
            <div style={{ marginBottom: '24px' }}>
              <Text
                strong
                style={{
                  fontSize: '16px',
                  marginBottom: '16px',
                  display: 'block',
                }}
              >
                选择数据权限类型：
              </Text>

              <Radio.Group
                value={dataScope}
                onChange={(e) => handlePermissionTypeChange(e.target.value)}
              >
                <Row gutter={[16, 12]}>
                  {PERMISSION_TYPES.map((type) => {
                    return (
                      <Col span={24} key={type.value}>
                        <PermissionTypeOption
                          className={dataScope === type.value ? 'selected' : ''}
                          onClick={() => handlePermissionTypeChange(type.value)}
                        >
                          <div
                            className="option-icon"
                            style={{ color: type.color }}
                          >
                            {type.icon}
                          </div>
                          <div className="option-content">
                            <div className="option-title">{type.label}</div>
                            <div className="option-description">
                              {type.description}
                            </div>
                          </div>
                          <div className="option-radio">
                            <Radio value={type.value} />
                          </div>
                        </PermissionTypeOption>
                        {/* 自定义部门选择 - 在自定义权限选项内部 */}
                        {type.value === DataScope.CUSTOM &&
                          dataScope === DataScope.CUSTOM && (
                            <Col span={24}>
                              <div
                                style={{
                                  marginTop: '16px',
                                  paddingTop: '16px',
                                  borderTop: '1px solid #f0f0f0',
                                  width: '100%',
                                }}
                              >
                                <div style={{ marginBottom: '12px' }}>
                                  <Text strong>选择允许访问的部门：</Text>
                                  {selectedDeptIds.length > 0 && (
                                    <Tag
                                      color="blue"
                                      style={{ marginLeft: '8px' }}
                                    >
                                      已选 {selectedDeptIds.length} 个部门
                                    </Tag>
                                  )}
                                </div>
                                <DepartmentTreeContainer>
                                  <Tree
                                    checkable
                                    checkedKeys={selectedDeptIds}
                                    onCheck={(checkedKeys) =>
                                      handleDepartmentChange(
                                        checkedKeys as string[],
                                      )
                                    }
                                    treeData={convertToTreeData(departments)}
                                    defaultExpandAll
                                  />
                                </DepartmentTreeContainer>
                              </div>
                            </Col>
                          )}
                      </Col>
                    );
                  })}
                </Row>
              </Radio.Group>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
