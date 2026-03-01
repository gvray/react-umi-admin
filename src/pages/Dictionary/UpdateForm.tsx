import FormGrid from '@/components/FormGrid';
import { useFeedback } from '@/hooks';
import {
  createDictionaryType,
  updateDictionaryType,
} from '@/services/dictionary';
import type { DictOption } from '@/types/dict';
import { createFormLayout } from '@/utils';
import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

const { TextArea } = Input;

export interface UpdateFormRef {
  show: (title: string, data?: Record<string, unknown>) => void;
}

interface UpdateFormProps {
  onOk: () => void;
  dict: Record<string, DictOption[]>;
}

const UpdateForm = forwardRef<UpdateFormRef, UpdateFormProps>(
  ({ onOk, dict }, ref) => {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('未设置弹出层标题');
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const { message } = useFeedback();

    useImperativeHandle(ref, () => ({
      show: (title: string, data?: Record<string, unknown>) => {
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

        const typeId = values?.typeId;
        if (typeId === undefined || typeId === null || typeId === '') {
          await createDictionaryType(values as API.CreateDictionaryTypeDto);
          message.success('创建成功');
        } else {
          const { typeId: id, ...rest } = values;
          await updateDictionaryType(
            String(id),
            rest as API.UpdateDictionaryTypeDto,
          );
          message.success('更新成功');
        }

        setVisible(false);
        onOk();
      } catch (error) {
        message.error('数据验证失败不能提交');
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
          {...createFormLayout(4)}
          form={form}
          layout="horizontal"
          initialValues={{
            status: 'enabled',
            sort: 0,
          }}
        >
          <Form.Item name="typeId" label="字典类型ID" hidden />
          <FormGrid>
            <FormGrid.Item span={24}>
              <Form.Item
                name="code"
                label="字典编码"
                rules={[{ required: true, message: '请输入字典编码' }]}
              >
                <Input placeholder="请输入字典编码，例如：user_status" />
              </Form.Item>
            </FormGrid.Item>

            <FormGrid.Item span={24}>
              <Form.Item
                name="name"
                label="字典名称"
                rules={[{ required: true, message: '请输入字典名称' }]}
              >
                <Input placeholder="请输入字典名称" />
              </Form.Item>
            </FormGrid.Item>

            <FormGrid.Item span={24}>
              <Form.Item name="description" label="描述">
                <TextArea rows={3} placeholder="请输入描述信息" />
              </Form.Item>
            </FormGrid.Item>

            <FormGrid.Item span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
                {...createFormLayout(8)}
              >
                <Select placeholder="请选择" options={dict.dictionary_status} />
              </Form.Item>
            </FormGrid.Item>

            <FormGrid.Item span={12}>
              <Form.Item name="sort" label="排序权重" {...createFormLayout(8)}>
                <InputNumber style={{ width: '100%' }} min={0} max={9999} />
              </Form.Item>
            </FormGrid.Item>

            <FormGrid.Item span={24}>
              <Form.Item name="remark" label="备注">
                <TextArea rows={2} placeholder="请输入备注信息" />
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
