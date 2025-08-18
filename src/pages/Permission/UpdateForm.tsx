import { createPermission, updatePermission } from '@/services/permission';
import {
  Col,
  Form,
  FormInstance,
  Input,
  Modal,
  Row,
  Select,
  TreeSelect,
  message,
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
  const [isEdit, setIsEdit] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const { data: resourceList } = useUpdataFormModel(visible);

  // 重置弹出层表单
  const reset = () => {
    form.resetFields();
    setConfirmLoading(false);
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const { ...values } = await form.validateFields();
      if (form.getFieldValue('permissionId') === undefined) {
        await createPermission({
          ...values,
        });
        message.success('新增成功');
      } else {
        // 在编辑模式下，移除不可修改的字段
        delete values.resourceId;
        delete values.action;
        await updatePermission({
          ...values,
        });
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
            setIsEdit(true);
            form.setFieldsValue(data);
          } else {
            setIsEdit(false);
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
      destroyOnClose
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
        initialValues={{}}
        onValuesChange={handleValuesChange}
      >
        <Form.Item name="permissionId" label="权限Id" hidden>
          <Input />
        </Form.Item>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="resourceId"
              label="绑定资源"
              rules={[{ required: true, message: '绑定资源不能为空' }]}
            >
              <TreeSelect
                disabled={isEdit}
                treeDefaultExpandAll
                allowClear
                fieldNames={{
                  value: 'resourceId',
                  label: 'name',
                }}
                treeDataSimpleMode={{
                  id: 'resourceId',
                  pId: 'parentResourceId',
                }}
                treeData={resourceList.map((item: any) => ({
                  ...item,
                  disabled: item.type !== 'MENU',
                  // parentResourceId: item.parentResourceId || '0',
                }))}
                placeholder="请选择绑定资源"
              />
            </Form.Item>
          </Col>

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
                disabled={isEdit}
                options={[
                  { value: 'view', label: '查看' },
                  { value: 'create', label: '新增' },
                  { value: 'update', label: '修改' },
                  { value: 'delete', label: '删除' },
                  { value: 'export', label: '导出' },
                  { value: 'import', label: '导入' },
                  { value: 'print', label: '打印' },
                  { value: 'download', label: '下载' },
                  { value: 'upload', label: '上传' },
                  { value: 'batch', label: '批量' },
                  { value: 'batchDelete', label: '批量删除' },
                  { value: 'batchUpdate', label: '批量修改' },
                  { value: 'batchImport', label: '批量导入' },
                  { value: 'batchExport', label: '批量导出' },
                  { value: 'batchPrint', label: '批量打印' },
                  { value: 'batchDownload', label: '批量下载' },
                  { value: 'batchUpload', label: '批量上传' },
                  { value: 'other', label: '其他' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="description" label="描述信息">
              <Input.TextArea placeholder="请输入内容"></Input.TextArea>
            </Form.Item>
          </Col>
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
