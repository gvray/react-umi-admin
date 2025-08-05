import { createDepartment, updateDepartment } from '@/services/department';
import {
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
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
  const resourceType = Form.useWatch('type', form);
  const { data: departmentList } = useUpdataFormModel(visible);
  const reset = () => {
    form.resetFields();
    setConfirmLoading(false);
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const { parentDepartmentId, ...values } = await form.validateFields();
      if (form.getFieldValue('departmentId') === undefined) {
        await createDepartment({
          ...values,
          parentDepartmentId:
            parentDepartmentId === '0' ? null : parentDepartmentId,
        });
        message.success('新增成功');
      } else {
        await updateDepartment({
          ...values,
          parentDepartmentId:
            parentDepartmentId === '0' ? null : parentDepartmentId,
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
      destroyOnClose
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
          parentResourceId: '0',
          type: 'DIRECTORY',
          sort: 0,
        }}
        onValuesChange={handleValuesChange}
      >
        <Form.Item name="resourceId" label="部门Id" hidden>
          <Input />
        </Form.Item>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="parentResourceId"
              label="上级部门"
              rules={[{ required: true, message: '上级部门不能为空' }]}
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
                  pId: 'parentResourceId',
                }}
                treeData={[
                  {
                    resourceId: '0',
                    name: '顶级部门',
                    parentResourceId: null,
                  },
                ].concat(
                  departmentList
                    .filter(
                      (item: any) =>
                        item.type === 'MENU' || item.type === 'DIRECTORY',
                    )
                    .map((item: any) => ({
                      ...item,
                      parentResourceId: item.parentResourceId || '0',
                    })),
                )}
                placeholder="请选择上级部门"
              />
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item name="type" label="部门类型">
              <Radio.Group
                options={[
                  { value: 'DIRECTORY', label: '目录' },
                  { value: 'MENU', label: '菜单' },
                  { value: 'BUTTON', label: '按钮' },
                  { value: 'DATA', label: '数据' },
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
          {(resourceType === 'DIRECTORY' || resourceType === 'MENU') && (
            <Col span={24}>
              <Form.Item name="icon" label="部门图标">
                <Input />
              </Form.Item>
            </Col>
          )}

          <Col span={14}>
            <Form.Item
              name="name"
              label="部门名称"
              rules={[{ required: true, message: '部门名称不能为空' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="status"
              label="部门状态"
              rules={[{ required: true, message: '部门状态不能为空' }]}
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

          {resourceType !== 'BUTTON' && (
            <Col span={14}>
              <Form.Item
                name="path"
                label="部门路径"
                rules={[{ required: true, message: '部门路径不能为空' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          )}
          {resourceType === 'DATA' && (
            <Col span={10}>
              <Form.Item
                name="method"
                label="部门方法"
                rules={[{ required: true, message: '部门方法不能为空' }]}
              >
                <Select
                  options={[
                    { value: 'GET', label: 'GET' },
                    { value: 'POST', label: 'POST' },
                    { value: 'PUT', label: 'PUT' },
                    { value: 'PATCH', label: 'PATCH' },
                    { value: 'DELETE', label: 'DELETE' },
                  ]}
                />
              </Form.Item>
            </Col>
          )}

          <Col span={10}>
            <Form.Item
              name="code"
              label="部门编码"
              rules={[{ required: true, message: '部门编码不能为空' }]}
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
