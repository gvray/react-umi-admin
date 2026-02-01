import { IconSelector } from '@/components';
import { createResource, updateResource } from '@/services/resource';
import {
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  TreeSelect,
  message,
} from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { useUpdataFormModel } from './model';

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
//     span: 4,
//   },
//   wrapperCol: {
//     span: 20,
//   },
// };
// const formItemFullLayout = {
//   labelCol: {
//     span: 4,
//   },
//   wrapperCol: {
//     span: 20,
//   },
// };

const UpdateFormFunction: React.ForwardRefRenderFunction<
  UpdateFormRef,
  UpdateFormProps
> = ({ onOk, onCancel }, ref) => {
  const [title, setTitle] = useState('未设置弹出层标题');
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const { data: resourceList } = useUpdataFormModel(visible);

  // 重置弹出层表单
  const reset = () => {
    form.resetFields();
    setConfirmLoading(false);
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const { parentId, ...values } = await form.validateFields();
      if (form.getFieldValue('resourceId') === undefined) {
        await createResource({
          ...values,
          parentId: parentId === '0' ? null : parentId,
        });
        message.success('新增成功');
      } else {
        await updateResource({
          ...values,
          parentId: parentId === '0' ? null : parentId,
        });
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

  const handleValuesChange = () => {};

  useImperativeHandle(
    ref,
    () => {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        show: (title, data) => {
          setTitle(title);
          setVisible(true);
          reset();
          if (data) {
            // setIsEdit(true);
            form.setFieldsValue(data);
          } else {
            // setIsEdit(false);
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
      width={820}
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
        // layout="vertical"
        form={form}
        layout="horizontal"
        name="form_in_modal"
        initialValues={{
          status: 1,
          parentId: null,
          type: 'DIRECTORY',
          sort: 0,
        }}
        onValuesChange={handleValuesChange}
      >
        <Form.Item name="resourceId" label="资源Id" hidden>
          <Input />
        </Form.Item>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="parentId"
              label="上级资源"
              rules={[{ required: false, message: '上级资源不能为空' }]}
            >
              <TreeSelect
                treeDefaultExpandAll
                allowClear
                fieldNames={{
                  value: 'resourceId',
                  label: 'name',
                }}
                treeDataSimpleMode={{
                  id: 'resourceId',
                  pId: 'parentId',
                }}
                treeData={resourceList}
                placeholder="不选表示顶级资源"
              />
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item name="type" label="资源类型">
              <Radio.Group
                optionType="button"
                options={[
                  { value: 'DIRECTORY', label: '目录' },
                  { value: 'MENU', label: '菜单' },
                ]}
              ></Radio.Group>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="sort"
              label="排序"
              rules={[{ required: true, message: '排序不能为空' }]}
            >
              <InputNumber />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="icon" label="资源图标">
              <IconSelector />
            </Form.Item>
          </Col>

          <Col span={14}>
            <Form.Item
              name="name"
              label="资源名称"
              rules={[{ required: true, message: '资源名称不能为空' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="status"
              label="资源状态"
              rules={[{ required: true, message: '资源状态不能为空' }]}
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

          <Col span={14}>
            <Form.Item
              name="path"
              label="资源路径"
              rules={[{ required: true, message: '资源路径不能为空' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="code"
              label="资源编码"
              rules={[{ required: true, message: '资源编码不能为空' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="description" label="描述信息">
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
