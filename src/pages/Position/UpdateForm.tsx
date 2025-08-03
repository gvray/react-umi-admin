import { createPosition, updatePosition } from '@/services/position';
import {
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
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

// const formItemLayout = {
//   labelCol: {
//     span: 6,
//   },
//   wrapperCol: {
//     span: 18,
//   },
// };
const formItemFullLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
};

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
      if (form.getFieldValue('positionId') === undefined) {
        await createPosition(values);
        message.success('新增成功');
      } else {
        await updatePosition(values);
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

  useImperativeHandle(
    ref,
    () => {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        show: (title, _data) => {
          setTitle(title);
          setVisible(true);
          reset();
          // if (data) {
          //   setIsEdit(true);
          //   form.setFieldsValue(data);
          // } else {
          //   setIsEdit(false);
          // }
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
      width={520}
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
        form={form}
        layout="horizontal"
        name="form_in_modal"
        initialValues={{
          status: 1,
          sort: 0,
        }}
      >
        <Form.Item name="positionId" label="职位Id" hidden>
          <Input />
        </Form.Item>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="职位名称"
              rules={[{ required: true, message: '职位名称不能为空' }]}
            >
              <Input placeholder="请输入职位名称" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="code"
              label="职位编码"
              rules={[{ required: true, message: '职位编码不能为空' }]}
            >
              <Input placeholder="请输入职位编码" />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="status"
              label="用户状态"
              rules={[{ required: true, message: '用户状态不能为空' }]}
            >
              <Radio.Group
                options={[
                  { value: 0, label: '停用' },
                  { value: 1, label: '启用' },
                  { value: 2, label: '审核中' },
                  // { value: 3, label: '封禁' },
                ]}
              ></Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="sort"
              label="排序"
              rules={[{ required: true, message: '排序不能为空' }]}
            >
              <InputNumber placeholder="请输入排序" />
            </Form.Item>
          </Col>
          {/* <Col span={24}>
            <Form.Item name="description" label="描述">
              <Input.TextArea placeholder="请输入内容"></Input.TextArea>
            </Form.Item>
          </Col> */}
          <Col span={24}>
            <Form.Item name="remark" label="备注" {...formItemFullLayout}>
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
