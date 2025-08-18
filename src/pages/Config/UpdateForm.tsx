import { createConfig, updateConfig } from '@/services/config';
import { Form, Input, InputNumber, Modal, Select, Switch, message } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

const { TextArea } = Input;

export interface UpdateFormRef {
  show: (title: string, data?: any) => void;
  hide: () => void;
}

interface UpdateFormProps {
  onOk?: () => void;
}

const UpdateForm = forwardRef<UpdateFormRef, UpdateFormProps>(
  ({ onOk }, ref) => {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState(false);

    useImperativeHandle(ref, () => ({
      show: (title: string, data?: any) => {
        setTitle(title);
        setVisible(true);
        setIsEdit(!!data);

        if (data) {
          form.setFieldsValue({
            ...data,
            // 处理布尔值类型
            value: data.type === 'boolean' ? data.value === 'true' : data.value,
          });
        } else {
          form.resetFields();
          form.setFieldsValue({
            type: 'string',
            group: 'system',
            status: 1,
            sort: 0,
          });
        }
      },
      hide: () => {
        setVisible(false);
        form.resetFields();
      },
    }));

    const handleOk = async () => {
      try {
        const values = await form.validateFields();
        setLoading(true);

        // 处理布尔值类型
        if (values.type === 'boolean') {
          values.value = values.value ? 'true' : 'false';
        }

        if (isEdit) {
          const { configId, ...rest } = values;
          await updateConfig(configId, rest);
          message.success('配置更新成功');
        } else {
          await createConfig(values);
          message.success('配置创建成功');
        }

        setVisible(false);
        form.resetFields();
        onOk?.();
      } catch (error) {
        console.error('保存配置失败:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleCancel = () => {
      setVisible(false);
      form.resetFields();
    };

    // 根据类型渲染不同的值输入组件
    const renderValueInput = () => {
      const type = form.getFieldValue('type');

      switch (type) {
        case 'number':
          return (
            <InputNumber
              placeholder="请输入数字值"
              style={{ width: '100%' }}
              precision={0}
              min={0}
            />
          );
        case 'boolean':
          return <Switch checkedChildren="是" unCheckedChildren="否" />;
        case 'json':
          return (
            <TextArea
              placeholder="请输入JSON格式的值，例如：{'key': 'value'}"
              rows={6}
              showCount
              maxLength={2000}
              style={{ fontFamily: 'monospace', fontSize: '12px' }}
            />
          );
        default:
          return <Input placeholder="请输入配置值" showCount maxLength={500} />;
      }
    };

    return (
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {title}
            </span>
          </div>
        }
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={700}
        destroyOnClose
        okText="保存"
        cancelText="取消"
        style={{ top: 50 }}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Form.Item name="configId" hidden>
            <Input />
          </Form.Item>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            <Form.Item
              label="配置名称"
              name="name"
              rules={[
                { required: true, message: '请输入配置名称' },
                { max: 100, message: '配置名称不能超过100个字符' },
              ]}
            >
              <Input placeholder="请输入配置名称" />
            </Form.Item>

            <Form.Item
              label="配置键"
              name="key"
              rules={[
                { required: true, message: '请输入配置键' },
                {
                  pattern: /^[a-zA-Z][a-zA-Z0-9.]*$/,
                  message: '配置键只能包含字母、数字和点，且必须以字母开头',
                },
                { max: 50, message: '配置键不能超过50个字符' },
              ]}
            >
              <Input placeholder="请输入配置键" />
            </Form.Item>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
            }}
          >
            <Form.Item
              label="配置类型"
              name="type"
              rules={[{ required: true, message: '请选择配置类型' }]}
            >
              <Select
                placeholder="请选择配置类型"
                options={[
                  { label: '字符串', value: 'string' },
                  { label: '数字', value: 'number' },
                  { label: '布尔值', value: 'boolean' },
                  { label: 'JSON', value: 'json' },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="配置分组"
              name="group"
              rules={[{ required: true, message: '请选择配置分组' }]}
            >
              <Select
                placeholder="请选择配置分组"
                options={[
                  { label: '系统', value: 'system' },
                  { label: '业务', value: 'business' },
                  { label: '安全', value: 'security' },
                  { label: '界面', value: 'ui' },
                  { label: '接口', value: 'api' },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="排序权重"
              name="sort"
              rules={[{ required: true, message: '请输入排序权重' }]}
            >
              <InputNumber
                placeholder="请输入排序权重"
                min={0}
                max={999}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="配置值"
            name="value"
            rules={[
              { required: true, message: '请输入配置值' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const type = getFieldValue('type');
                  if (type === 'json' && value) {
                    try {
                      JSON.parse(value);
                    } catch (error) {
                      return Promise.reject(new Error('请输入有效的JSON格式'));
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            {renderValueInput()}
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select
              placeholder="请选择状态"
              options={[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
            rules={[{ max: 200, message: '描述不能超过200个字符' }]}
          >
            <TextArea
              placeholder="请输入配置描述"
              rows={2}
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            label="备注"
            name="remark"
            rules={[{ max: 500, message: '备注不能超过500个字符' }]}
          >
            <TextArea
              placeholder="请输入备注信息"
              rows={3}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  },
);

UpdateForm.displayName = 'UpdateForm';

export default UpdateForm;
