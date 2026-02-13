import { createConfig, updateConfig } from '@/services/config';
import { logger } from '@/utils';
import {
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  message,
} from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { CONFIG_STATUS_OPTIONS, CONFIG_TYPE_OPTIONS } from './constants';

const { TextArea } = Input;

interface UpdateFormProps {
  onCancel?: () => void;
  onOk?: () => void;
  dict: Record<string, { label: string; value: string | number }[]>;
}

export interface UpdateFormRef {
  show: (title: string, data?: Record<string, unknown>) => void;
  hide: () => void;
  form: FormInstance;
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const formItemFullLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const UpdateFormFunction: React.ForwardRefRenderFunction<
  UpdateFormRef,
  UpdateFormProps
> = ({ onOk, onCancel, dict }, ref) => {
  const [title, setTitle] = useState('');
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const currentType = Form.useWatch('type', form);

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

      if (isEdit) {
        const { configId, ...rest } = values;
        await updateConfig(configId, rest);
        message.success('修改成功');
      } else {
        await createConfig(values);
        message.success('新增成功');
      }
      setVisible(false);
      onOk?.();
      reset();
    } catch (error) {
      logger.error(`保存配置失败：${error}`);
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
          setIsEdit(true);
          let parsedValue = data.value;
          if (data.type === 'number') {
            const n = Number(data.value);
            parsedValue = Number.isNaN(n) ? undefined : n;
          }
          form.setFieldsValue({ ...data, value: parsedValue });
        } else {
          setIsEdit(false);
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
        {...formItemLayout}
        form={form}
        layout="horizontal"
        name="config_form"
        initialValues={{
          type: 'string',
          status: 1,
          sort: 0,
        }}
      >
        <Form.Item name="configId" hidden>
          <Input />
        </Form.Item>

        <Row gutter={24}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
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
              <Input placeholder="如 app.siteName" disabled={isEdit} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label="配置类型"
              rules={[{ required: true, message: '请选择配置类型' }]}
            >
              <Select placeholder="请选择" options={CONFIG_TYPE_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="group"
              label="配置分组"
              rules={[{ required: true, message: '请选择配置分组' }]}
            >
              <Select placeholder="请选择" options={dict['config_group']} />
            </Form.Item>
          </Col>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择" options={CONFIG_STATUS_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              {...formItemFullLayout}
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
            >
              {renderValueInput()}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              {...formItemFullLayout}
              name="description"
              label="描述"
              rules={[{ max: 200, message: '不能超过200个字符' }]}
            >
              <TextArea
                placeholder="请输入描述"
                rows={2}
                showCount
                maxLength={200}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              {...formItemFullLayout}
              name="remark"
              label="备注"
              rules={[{ max: 500, message: '不能超过500个字符' }]}
            >
              <TextArea
                placeholder="请输入备注"
                rows={2}
                showCount
                maxLength={500}
              />
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
