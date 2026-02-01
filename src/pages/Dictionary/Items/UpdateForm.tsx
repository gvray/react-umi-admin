import {
  createDictionaryItem,
  updateDictionaryItem,
} from '@/services/dictionary';
import { Form, Input, InputNumber, Modal, Select, message } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

const { TextArea } = Input;

export interface UpdateFormRef {
  show: (title: string, data?: any) => void;
}

interface UpdateFormProps {
  onOk: () => void;
  typeCode?: string;
}

const UpdateForm = forwardRef<UpdateFormRef, UpdateFormProps>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    show: (title: string, data?: any) => {
      setTitle(title);
      setVisible(true);
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

      if (values?.itemId) {
        const { itemId, ...rest } = values;
        // 更新
        await updateDictionaryItem(itemId, rest);
        message.success('更新成功');
      } else {
        // 新增
        await createDictionaryItem(values);
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
          typeCode: props.typeCode,
        }}
      >
        <Form.Item name="itemId" label="字典项ID" hidden></Form.Item>
        <Form.Item name="typeCode" label="字典类型">
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="value"
          label="字典项值"
          rules={[{ required: true, message: '请输入字典项值' }]}
        >
          <Input placeholder="请输入字典项值" />
        </Form.Item>

        <Form.Item
          name="label"
          label="显示标签"
          rules={[{ required: true, message: '请输入显示标签' }]}
        >
          <Input placeholder="请输入显示标签" />
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
