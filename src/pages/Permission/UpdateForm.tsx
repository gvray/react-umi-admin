import { IconSelector } from '@/components';
import { createPermission, updatePermission } from '@/services/permission';
import {
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Switch,
  TreeSelect,
} from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { useUpdataFormModel } from './model';

interface UpdateFormProps {
  onCancel?: () => void;
  onOk?: () => void;
}

export interface UpdateFormRef {
  show: (title: string, data?: Record<string, any>) => void;
  hide: () => void;
  form: FormInstance;
}

// const formItemLayout = {
//   labelCol: {
//     span: 4,
//   },
//   wrapperCol: {
//     span: 20,
//   },
// };
// const formItemFullLayout = {
//   labelCol: {
//     span: 4,
//   },
//   wrapperCol: {
//     span: 20,
//   },
// };

const UpdateFormFunction: React.ForwardRefRenderFunction<
  UpdateFormRef,
  UpdateFormProps
> = ({ onOk, onCancel }, ref) => {
  const [title, setTitle] = useState('未设置弹出层标题');
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const { data: permissionTree } = useUpdataFormModel(visible);
  const typeValue = Form.useWatch('type', form);

  // 重置弹出层表单
  const reset = () => {
    form.resetFields();
    setConfirmLoading(false);
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      if (!form.getFieldValue('permissionId')) {
        await createPermission(values as any);
        message.success('新增成功');
      } else {
        await updatePermission(values as any);
        message.success('修改成功');
      }
      setVisible(false);
      onOk?.();
      reset();
    } catch (errorInfo) {
      message.error('数据验证失败不能提交');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setVisible(false);
    reset();
  };

  const handleValuesChange = () => {};

  useImperativeHandle(
    ref,
    () => {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        show: (title, data) => {
          setTitle(title);
          setVisible(true);
          reset();
          if (data) {
            form.setFieldsValue({
              ...data,
              parentPermissionId: data.parentPermissionId ?? null,
              type: data.type ?? 'BUTTON',
              menuMeta: data.menuMeta ?? {},
            });
          } else {
            form.setFieldsValue({
              type: 'BUTTON',
              action: 'view',
              menuMeta: { hidden: false, sort: 0 },
            });
          }
        },
        hide: () => {
          setVisible(false);
          reset();
        },
        form,
      };
    },
    [],
  );

  return (
    <Modal
      destroyOnHidden
      forceRender
      width={820}
      title={title}
      open={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      okText="确认"
      cancelText="取消"
    >
      <Form
        // {...formItemLayout}
        // layout="vertical"
        form={form}
        layout="horizontal"
        name="form_in_modal"
        initialValues={{
          type: 'BUTTON',
          action: 'view',
          menuMeta: { hidden: false, sort: 0 },
        }}
        onValuesChange={handleValuesChange}
      >
        <Form.Item name="permissionId" label="权限Id" hidden>
          <Input />
        </Form.Item>
        <Row gutter={24}>
          <Col span={14}>
            <Form.Item
              name="name"
              label="权限名称"
              rules={[{ required: true, message: '权限名称不能为空' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="action"
              label="权限动作"
              rules={[{ required: true, message: '权限动作不能为空' }]}
            >
              <Select
                options={[
                  { value: 'view', label: '查看' },
                  { value: 'create', label: '新增' },
                  { value: 'update', label: '修改' },
                  { value: 'delete', label: '删除' },
                  { value: 'export', label: '导出' },
                  { value: 'import', label: '导入' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="code"
              label="权限代码"
              rules={[{ required: true, message: '权限代码不能为空' }]}
            >
              <Input placeholder="如 user:view" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label="权限类型"
              rules={[{ required: true, message: '权限类型不能为空' }]}
            >
              <Select
                options={[
                  { value: 'MENU', label: '菜单' },
                  { value: 'BUTTON', label: '按钮' },
                  { value: 'API', label: '接口' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="parentPermissionId" label="上级权限">
              <TreeSelect
                allowClear
                treeDefaultExpandAll
                fieldNames={{ value: 'permissionId', label: 'name' }}
                treeDataSimpleMode={{
                  id: 'permissionId',
                  pId: 'parentPermissionId',
                }}
                treeData={permissionTree}
                placeholder="不选表示顶级权限"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="description" label="描述信息">
              <Input.TextArea placeholder="请输入内容"></Input.TextArea>
            </Form.Item>
          </Col>
          {typeValue === 'MENU' && (
            <>
              <Col span={12}>
                <Form.Item name={['menuMeta', 'path']} label="菜单路径">
                  <Input placeholder="/system/permission" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['menuMeta', 'icon']} label="菜单图标">
                  <IconSelector />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['menuMeta', 'component']} label="菜单组件">
                  <Input placeholder="如 Permission" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['menuMeta', 'sort']} label="排序">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name={['menuMeta', 'hidden']}
                  label="隐藏菜单"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
      </Form>
    </Modal>
  );
};

const UpdateForm = React.forwardRef<UpdateFormRef, UpdateFormProps>(
  UpdateFormFunction,
);

UpdateForm.displayName = 'UpdateForm';

export default UpdateForm;
