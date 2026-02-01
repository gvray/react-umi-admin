import {
  createDictionaryType,
  updateDictionaryType,
} from '@/services/dictionary';
import { Form, Input, InputNumber, Modal, Select, message } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

const { TextArea } = Input;

export interface UpdateFormRef {
  show: (title: string, data?: any) => void;
}

interface UpdateFormProps {
  onOk: () => void;
}

const UpdateForm = forwardRef<UpdateFormRef, UpdateFormProps>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [initialData, setInitialData] = useState<any>(null);

  useImperativeHandle(ref, () => ({
    show: (title: string, data?: any) => {
      setTitle(title);
      setVisible(true);
      setInitialData(data);
      if (data) {
        form.setFieldsValue(data);
      } else {
        form.resetFields();
      }
    },
  }));

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (initialData) {
        // 更新
        await updateDictionaryType(initialData.typeId, values);
        message.success('更新成功');
      } else {
        // 新增
        await createDictionaryType(values);
        message.success('创建成功');
      }

      setVisible(false);
      props.onOk();
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 1,
          sort: 0,
        }}
      >
        <Form.Item
          name="code"
          label="字典类型编码"
          rules={[
            { required: true, message: '请输入字典类型编码' },
            {
              pattern: /^[a-zA-Z0-9_]+$/,
              message: '编码只能包含字母、数字和下划线',
            },
          ]}
        >
          <Input placeholder="请输入字典类型编码" />
        </Form.Item>

        <Form.Item
          name="name"
          label="字典类型名称"
          rules={[{ required: true, message: '请输入字典类型名称' }]}
        >
          <Input placeholder="请输入字典类型名称" />
        </Form.Item>

        <Form.Item name="description" label="描述">
          <TextArea rows={3} placeholder="请输入描述信息" />
        </Form.Item>

        <Form.Item name="sort" label="排序权重">
          <InputNumber
            placeholder="请输入排序权重"
            style={{ width: '100%' }}
            min={0}
            max={9999}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select placeholder="请选择状态">
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={0}>禁用</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="remark" label="备注">
          <TextArea rows={2} placeholder="请输入备注信息" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

UpdateForm.displayName = 'UpdateForm';

export default UpdateForm;
