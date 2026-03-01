import FormGrid from '@/components/FormGrid';
import { useFeedback } from '@/hooks';
import { createConfig, updateConfig } from '@/services/config';
import type { DictOption } from '@/types/dict';
import { createFormLayout, logger } from '@/utils';
import { Form, FormInstance, Input, InputNumber, Modal, Select } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

const { TextArea } = Input;

interface UpdateFormProps {
  onOk?: () => void;
  onCancel?: () => void;
  dict: Record<string, DictOption[]>;
}

export interface UpdateFormRef {
  show: (title: string, data?: Record<string, unknown>) => void;
  hide: () => void;
  form: FormInstance;
}

const UpdateForm = forwardRef<UpdateFormRef, UpdateFormProps>(
  ({ onOk, onCancel, dict }, ref) => {
    const [title, setTitle] = useState('未设置弹窗标题');
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    const currentType = Form.useWatch('type', form);
    const configId = Form.useWatch('configId', form);

    const { message } = useFeedback();

    const reset = () => {
      form.resetFields();
      setConfirmLoading(false);
    };

    const handleOk = async () => {
      try {
        setConfirmLoading(true);
        const values = await form.validateFields();

        // 类型转换
        if (values.type === 'number') {
          values.value =
            values.value === undefined || values.value === null
              ? ''
              : String(values.value);
        }
        if (values.type === 'json' && typeof values.value === 'string') {
          try {
            values.value = JSON.stringify(JSON.parse(values.value));
          } catch {
            /* 校验已拦截 */
          }
        }

        const id = values?.configId;
        if (id === undefined || id === null || id === '') {
          await createConfig(values);
          message.success('创建成功');
        } else {
          const { configId: configIdValue, ...rest } = values;
          await updateConfig(String(configIdValue), rest);
          message.success('更新成功');
        }

        setVisible(false);
        onOk?.();
        reset();
      } catch (error) {
        logger.error('提交失败:', error);
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

    useImperativeHandle(
      ref,
      () => ({
        show: (title, data) => {
          setTitle(title);
          setVisible(true);
          reset();

          if (data) {
            let parsedValue = data.value;
            if (data.type === 'number') {
              const n = Number(data.value);
              parsedValue = Number.isNaN(n) ? undefined : n;
            }
            form.setFieldsValue({ ...data, value: parsedValue });
          }
        },
        hide: () => {
          setVisible(false);
          reset();
        },
        form,
      }),
      [],
    );

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
              style={{ fontFamily: 'monospace', fontSize: 12 }}
            />
          );
        default:
          return <Input placeholder="请输入配置值" maxLength={1000} />;
      }
    };

    return (
      <Modal
        destroyOnHidden
        forceRender
        width={720}
        title={title}
        open={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <Form
          {...createFormLayout()}
          form={form}
          layout="horizontal"
          name="config_form"
          initialValues={{
            type: 'string',
            status: 'enabled',
            sort: 0,
          }}
        >
          <Form.Item name="configId" hidden>
            <Input />
          </Form.Item>
          <FormGrid>
            <FormGrid.Item span={12}>
              <Form.Item
                name="name"
                label="配置名称"
                rules={[
                  { required: true, message: '请输入配置名称' },
                  { max: 100, message: '不能超过100个字符' },
                ]}
              >
                <Input placeholder="请输入配置名称" />
              </Form.Item>
            </FormGrid.Item>

            <FormGrid.Item span={12}>
              <Form.Item
                name="key"
                label="配置键"
                rules={[
                  { required: true, message: '请输入配置键' },
                  {
                    pattern: /^[a-zA-Z][a-zA-Z0-9._-]*$/,
                    message: '以字母开头，仅含字母、数字、点、下划线、横线',
                  },
                  { max: 50, message: '不能超过50个字符' },
                ]}
              >
                <Input
                  placeholder="如 app.siteName"
                  disabled={Boolean(configId)}
                />
              </Form.Item>
            </FormGrid.Item>

            <FormGrid.Item span={12}>
              <Form.Item
                name="type"
                label="配置类型"
                rules={[{ required: true, message: '请选择配置类型' }]}
              >
                <Select placeholder="请选择" options={dict.config_type} />
              </Form.Item>
            </FormGrid.Item>

            <FormGrid.Item span={12}>
              <Form.Item
                name="group"
                label="配置分组"
                rules={[{ required: true, message: '请选择配置分组' }]}
              >
                <Select placeholder="请选择" options={dict.config_group} />
              </Form.Item>
            </FormGrid.Item>

            <FormGrid.Item span={12}>
              <Form.Item
                name="sort"
                label="排序权重"
                rules={[{ required: true, message: '请输入排序权重' }]}
              >
                <InputNumber
                  placeholder="请输入"
                  min={0}
                  max={999}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </FormGrid.Item>

            <FormGrid.Item span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择" options={dict.config_status} />
              </Form.Item>
            </FormGrid.Item>

            <FormGrid.Item span={24}>
              <Form.Item
                name="value"
                label="配置值"
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
                {...createFormLayout(3)}
              >
                {renderValueInput()}
              </Form.Item>
            </FormGrid.Item>

            <FormGrid.Item span={24}>
              <Form.Item
                name="description"
                label="描述"
                rules={[{ max: 200, message: '不能超过200个字符' }]}
                {...createFormLayout(3)}
              >
                <TextArea
                  placeholder="请输入描述"
                  rows={2}
                  showCount
                  maxLength={200}
                />
              </Form.Item>
            </FormGrid.Item>

            <FormGrid.Item span={24}>
              <Form.Item
                name="remark"
                label="备注"
                rules={[{ max: 500, message: '不能超过500个字符' }]}
                {...createFormLayout(3)}
              >
                <TextArea
                  placeholder="请输入备注"
                  rows={2}
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </FormGrid.Item>
          </FormGrid>
        </Form>
      </Modal>
    );
  },
);

UpdateForm.displayName = 'UpdateForm';

export default UpdateForm;
