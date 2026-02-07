import { createConfig, updateConfig } from '@/services/config';
import { Form, Input, InputNumber, Modal, Select, message } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { CONFIG_GROUP_OPTIONS } from './constants';

const { TextArea } = Input;

export interface UpdateFormRef {
  show: (title: string, data?: Record<string, unknown>) => void;
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
    const currentType = Form.useWatch('type', form);

    useImperativeHandle(ref, () => ({
      show: (title: string, data?: Record<string, unknown>) => {
        setTitle(title);
        setVisible(true);
        setIsEdit(!!data);

        if (data) {
          let parsedValue = data.value;
          if (data.type === 'number') {
            const n = Number(data.value);
            parsedValue = Number.isNaN(n) ? undefined : n;
          }
          form.setFieldsValue({
            ...data,
            value: parsedValue,
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

        if (values.type === 'number') {
          values.value =
            values.value === undefined || values.value === null
              ? ''
              : String(values.value);
        }
        if (values.type === 'json' && typeof values.value === 'string') {
          try {
            const normalized = JSON.stringify(JSON.parse(values.value));
            values.value = normalized;
          } catch {}
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

    const renderValueInput = () => {
      switch (currentType) {
        case 'number':
          return (
            <InputNumber
              placeholder="请输入数字"
              style={{ width: '100%' }}
              controls={false}
            />
          );
        case 'boolean':
          return (
            <Select
              placeholder="请选择布尔值"
              options={[
                { label: 'true', value: 'true' },
                { label: 'false', value: 'false' },
              ]}
            />
          );
        case 'json':
          return (
            <TextArea
              placeholder='请输入 JSON，如 {"key":"value"}'
              rows={6}
              showCount
              maxLength={2000}
              style={{ fontFamily: 'monospace', fontSize: '12px' }}
            />
          );
        default:
          return <Input placeholder="请输入配置值" maxLength={1000} />;
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
        destroyOnHidden
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
                options={CONFIG_GROUP_OPTIONS}
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
              {
                validator: (_, v) => {
                  if (currentType === 'json') {
                    try {
                      JSON.parse(typeof v === 'string' ? v : '');
                      return Promise.resolve();
                    } catch {
                      return Promise.reject(new Error('JSON 格式不合法'));
                    }
                  }
                  return Promise.resolve();
                },
              },
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
