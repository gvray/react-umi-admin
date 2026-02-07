import { createRole, updateRole } from '@/services/role';
import { createFormLayout, logger } from '@/utils';
import {
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Radio,
  message,
} from 'antd';
import React, { useImperativeHandle, useState } from 'react';

interface UpdateFormProps {
  onCancel?: () => void;
  onOk?: () => void;
}

export interface UpdateFormRef {
  show: (title: string, data?: Record<string, any>) => void;
  hide: () => void;
  form: FormInstance;
}

const UpdateFormFunction: React.ForwardRefRenderFunction<
  UpdateFormRef,
  UpdateFormProps
> = ({ onOk, onCancel }, ref) => {
  const [title, setTitle] = useState('未设置弹出层标题');
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  // 重置弹出层表单
  const reset = () => {
    form.resetFields();
    setConfirmLoading(false);
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      if (form.getFieldValue('roleId') === undefined) {
        await createRole(values);
        message.success('新增成功');
      } else {
        await updateRole(values);
        message.success('修改成功');
      }
      setVisible(false);
      onOk?.();
      reset();
    } catch (errorInfo: unknown) {
      console.log(errorInfo);
      const msg =
        errorInfo instanceof Error ? errorInfo.message : String(errorInfo);
      logger.error(`更新角色失败：${msg}`);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setVisible(false);
    reset();
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        show: (title, data) => {
          setTitle(title);
          setVisible(true);
          reset();
          if (data) {
            form.setFieldsValue(data);
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
      width={600}
      title={title}
      open={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      okText="确认"
      cancelText="取消"
    >
      <Form
        {...createFormLayout(4)}
        form={form}
        layout="horizontal"
        name="form_in_modal"
        initialValues={{
          status: 1,
          sort: 0,
        }}
        style={{ marginTop: 16 }}
      >
        <Form.Item name="roleId" label="角色Id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label="角色名称"
          rules={[{ required: true, message: '角色名称不能为空' }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item
          name="roleKey"
          label="角色标识"
          rules={[{ required: true, message: '角色标识不能为空' }]}
        >
          <Input placeholder="请输入角色标识" maxLength={50} />
        </Form.Item>
        <Form.Item
          name="sort"
          label="排序"
          rules={[{ required: true, message: '排序不能为空' }]}
        >
          <InputNumber placeholder="请输入排序" style={{ width: 180 }} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Radio.Group
            options={[
              { value: 0, label: '停用' },
              { value: 1, label: '启用' },
              { value: 2, label: '审核中' },
            ]}
          />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea
            placeholder="请输入备注信息"
            rows={3}
            showCount
            maxLength={200}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const UpdateForm = React.forwardRef<UpdateFormRef, UpdateFormProps>(
  UpdateFormFunction,
);

UpdateForm.displayName = 'UpdateForm';

export default UpdateForm;
