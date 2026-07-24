import { FormGrid, FormLoading } from '@/components';
import { DEFAULT_MODAL_TITLE } from '@/constants';
import { useFeedback } from '@/hooks';
import { createNotice, getNoticeById, updateNotice } from '@/services/notice';
import { logger } from '@/utils';
import { createFormLayout } from '@gvray/adminkit';
import { Form, FormInstance, Input, InputNumber, Modal, Select } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

const { TextArea } = Input;

interface UpdateFormProps {
  onOk?: () => void;
  onCancel?: () => void;
}

export interface UpdateFormRef {
  show: (title: string, noticeId?: string) => void;
  hide: () => void;
  form: FormInstance;
}

const noticeTypeOptions = [
  { label: '通知', value: 'notice' },
  { label: '通告', value: 'announcement' },
];

const statusOptions = [
  { label: '启用', value: 'enabled' },
  { label: '禁用', value: 'disabled' },
];

const UpdateForm = forwardRef<UpdateFormRef, UpdateFormProps>(
  ({ onOk, onCancel }, ref) => {
    const [title, setTitle] = useState(DEFAULT_MODAL_TITLE);
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>();
    const [form] = Form.useForm();

    const { message } = useFeedback();

    useEffect(() => {
      if (!visible) return;

      const load = async () => {
        setFormLoading(true);
        try {
          if (editingId) {
            const { data } = await getNoticeById(editingId);
            if (data) {
              form.setFieldsValue({
                ...data,
              });
            }
          } else {
            form.setFieldsValue({
              type: 'notice',
              status: 'enabled',
              sort: 0,
            });
          }
        } catch (error) {
          logger.error(error);
          message.error('数据加载失败');
        } finally {
          setFormLoading(false);
        }
      };

      load();
    }, [visible, editingId, form, message]);

    const reset = () => {
      form.resetFields();
      setConfirmLoading(false);
      setEditingId(undefined);
    };

    const handleOk = async () => {
      try {
        setConfirmLoading(true);
        const values = await form.validateFields();

        if (!editingId) {
          await createNotice(values);
          message.success('创建成功');
        } else {
          const rest = { ...values };
          delete rest.noticeId;
          await updateNotice(editingId, rest);
          message.success('更新成功');
        }

        setVisible(false);
        onOk?.();
        reset();
      } catch (error) {
        logger.error(error);
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
        show: (modalTitle, id) => {
          setTitle(modalTitle);
          setEditingId(id);
          setVisible(true);
        },
        hide: () => {
          setVisible(false);
          reset();
        },
        form,
      }),
      [],
    );

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
        <FormLoading loading={formLoading}>
          <Form
            {...createFormLayout()}
            form={form}
            layout="horizontal"
            name="notice_form"
            initialValues={{
              type: 'notice',
              status: 'enabled',
              sort: 0,
            }}
          >
            <Form.Item name="noticeId" hidden>
              <Input />
            </Form.Item>

            <FormGrid>
              <FormGrid.Item span={24}>
                <Form.Item
                  name="title"
                  label="标题"
                  rules={[
                    { required: true, message: '请输入标题' },
                    { max: 200, message: '不能超过200个字符' },
                  ]}
                  {...createFormLayout(3)}
                >
                  <Input placeholder="请输入标题" disabled={formLoading} />
                </Form.Item>
              </FormGrid.Item>

              <FormGrid.Item span={12}>
                <Form.Item
                  name="type"
                  label="类型"
                  rules={[{ required: true, message: '请选择类型' }]}
                >
                  <Select
                    placeholder="请选择"
                    options={noticeTypeOptions}
                    disabled={formLoading}
                  />
                </Form.Item>
              </FormGrid.Item>

              <FormGrid.Item span={12}>
                <Form.Item
                  name="status"
                  label="状态"
                  rules={[{ required: true, message: '请选择状态' }]}
                >
                  <Select
                    placeholder="请选择"
                    options={statusOptions}
                    disabled={formLoading}
                  />
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
                    disabled={formLoading}
                  />
                </Form.Item>
              </FormGrid.Item>

              <FormGrid.Item span={24}>
                <Form.Item
                  name="content"
                  label="内容"
                  rules={[
                    { required: true, message: '请输入内容' },
                    { max: 2000, message: '不能超过2000个字符' },
                  ]}
                  {...createFormLayout(3)}
                >
                  <TextArea
                    placeholder="请输入内容"
                    rows={6}
                    showCount
                    maxLength={2000}
                    disabled={formLoading}
                  />
                </Form.Item>
              </FormGrid.Item>
            </FormGrid>
          </Form>
        </FormLoading>
      </Modal>
    );
  },
);

UpdateForm.displayName = 'NoticeUpdateForm';

export default UpdateForm;
