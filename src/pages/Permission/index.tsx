import {
  AuthButton,
  DateTimeFormat,
  Icon,
  PageContainer,
  TablePro,
} from '@/components';
import { TableProRef } from '@/components/TablePro';
import { PERM } from '@/constants';
import { useFeedback } from '@/hooks';
import { callRef, logger } from '@/utils';
import { Space, Tag, Tooltip, Typography } from 'antd';
import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import UpdateForm, { UpdateFormRef } from './UpdateForm';
import { getPermissionColumns } from './columns';
import './index.less';
import {
  getDefaultExpandedKeys,
  type PermissionTreeNode,
  usePermissionModel,
} from './model';

const PermissionPage = () => {
  const updateFormRef = useRef<UpdateFormRef>(null);
  const tableProRef = useRef<TableProRef>(null);
  const { message } = useFeedback();
  const intl = useIntl();
  const { scanning, fetchPermissionList, syncPermissions } =
    usePermissionModel();

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const tableReload = () => {
    callRef(tableProRef, (t) => t.reload());
  };

  const handleSync = async () => {
    try {
      await syncPermissions();
      message.success(
        intl.formatMessage({ id: 'permission.message.scanSuccess' }),
      );
      tableReload();
    } catch (error) {
      logger.error(error);
    }
  };

  const handleUpdate = (record: PermissionTreeNode) => {
    if (record.isVirtual) return;
    callRef(updateFormRef, (t) => t.show('修改权限描述', record));
  };

  const handleOk = () => {
    tableReload();
  };

  const columns = getPermissionColumns(intl.formatMessage).map(
    (column: any) => {
      if ('dataIndex' in column && column.dataIndex === 'name') {
        return {
          ...column,
          render: (_: string, record: PermissionTreeNode) => {
            const name = record.intlId
              ? intl.formatMessage({
                  id: record.intlId,
                  defaultMessage: record.name,
                })
              : record.name;
            if (record.nodeType === 'DOMAIN') {
              return (
                <Typography.Text strong className="domain-name">
                  {name}
                </Typography.Text>
              );
            }
            if (record.nodeType === 'RESOURCE') {
              return (
                <Typography.Text strong type="secondary">
                  {name}
                </Typography.Text>
              );
            }
            return (
              <Tooltip title={name} placement="topLeft">
                <span>{name}</span>
              </Tooltip>
            );
          },
        };
      }
      if ('dataIndex' in column && column.dataIndex === 'code') {
        return {
          ...column,
          render: (code: string, record: PermissionTreeNode) => {
            if (!code) return '-';
            return (
              <Tooltip title={code} placement="topLeft">
                <Typography.Text
                  code
                  copyable={
                    record.isVirtual
                      ? false
                      : {
                          text: code,
                          tooltips: [
                            intl.formatMessage({ id: 'permission.copy.copy' }),
                            intl.formatMessage({
                              id: 'permission.copy.copied',
                            }),
                          ],
                        }
                  }
                >
                  {code}
                </Typography.Text>
              </Tooltip>
            );
          },
        };
      }
      if ('dataIndex' in column && column.dataIndex === 'origin') {
        return {
          ...column,
          render: (origin: string, record: PermissionTreeNode) => {
            if (record.isVirtual) {
              return (
                <Tag color="default">
                  {intl.formatMessage({ id: 'permission.tag.group' })}
                </Tag>
              );
            }
            return (
              <Tag color={origin === 'SYSTEM' ? 'blue' : 'green'}>
                {origin === 'SYSTEM'
                  ? intl.formatMessage({ id: 'permission.origin.system' })
                  : intl.formatMessage({ id: 'permission.origin.user' })}
              </Tag>
            );
          },
        };
      }
      if ('dataIndex' in column && column.dataIndex === 'updatedAt') {
        return {
          ...column,
          render: (time: string, record: PermissionTreeNode) => {
            if (record.isVirtual || !time) return '-';
            return <DateTimeFormat value={time} />;
          },
        };
      }
      if ('dataIndex' in column && column.dataIndex === 'description') {
        return {
          ...column,
          render: (desc: string, record: PermissionTreeNode) => {
            if (record.isVirtual) {
              const defaultDesc =
                record.nodeType === 'DOMAIN'
                  ? intl.formatMessage({ id: 'permission.desc.domain' })
                  : intl.formatMessage({ id: 'permission.desc.resource' });
              return (
                <Typography.Text type="secondary">
                  {defaultDesc}
                </Typography.Text>
              );
            }
            if (!desc)
              return <Typography.Text type="secondary">-</Typography.Text>;
            return (
              <Tooltip title={desc} placement="topLeft">
                <span>{desc}</span>
              </Tooltip>
            );
          },
        };
      }
      return column;
    },
  );

  const actionColumn = {
    title: intl.formatMessage({ id: 'permission.column.action' }),
    key: 'action',
    width: 100,
    render: (record: PermissionTreeNode) => {
      if (record.isVirtual) return null;
      return (
        <Space size={0}>
          <AuthButton
            type="link"
            icon={<Icon name="EditOutlined" />}
            onClick={() => handleUpdate(record)}
            perms={[PERM.PERMISSION_UPDATE]}
          >
            {intl.formatMessage({ id: 'permission.action.edit' })}
          </AuthButton>
        </Space>
      );
    },
  };

  return (
    <PageContainer>
      <TablePro
        tree
        ref={tableProRef}
        rowKey="permissionId"
        columns={[...columns, actionColumn] as any}
        request={async () => {
          const result = await fetchPermissionList();
          setExpandedKeys(getDefaultExpandedKeys(result.data));
          return result;
        }}
        expandable={{
          rowExpandable: (record) =>
            Boolean(record.children && record.children.length > 0),
          expandedRowKeys: expandedKeys,
          onExpandedRowsChange: (keys) => setExpandedKeys(keys as string[]),
        }}
        toolbarRender={() => (
          <AuthButton
            type="primary"
            icon={<Icon name="SyncOutlined" spin={scanning} />}
            onClick={handleSync}
            loading={scanning}
            perms={[PERM.PERMISSION_SCAN]}
          >
            {intl.formatMessage({ id: 'permission.action.scan' })}
          </AuthButton>
        )}
      />
      <UpdateForm ref={updateFormRef} onOk={handleOk} />
    </PageContainer>
  );
};

export default PermissionPage;
