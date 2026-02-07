import { ROOT_PARENT_ID } from '@/constants';
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
  show: (title: string, data?: Record<string, unknown>) => void;
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
  const { data: departmentList } = useUpdataFormModel(visible);
  const reset = () => {
    form.resetFields();
    setConfirmLoading(false);
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const { parentId, ...values } = await form.validateFields();
      if (form.getFieldValue('departmentId') === undefined) {
        await createDepartment({
          ...values,
          parentId: parentId === '0' ? null : parentId,
        });
        message.success('新增成功');
      } else {
        const { departmentId, ...rest } = values;
        await updateDepartment(departmentId, {
          ...rest,
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
          parentId: ROOT_PARENT_ID,
          type: 'DIRECTORY',
          sort: 0,
        }}
        onValuesChange={handleValuesChange}
      >
        <Form.Item name="departmentId" label="部门Id" hidden>
          <Input />
        </Form.Item>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="parentId"
              label="上级部门"
              rules={[{ required: false, message: '上级部门不能为空' }]}
            >
              <TreeSelect
                treeDefaultExpandAll
                allowClear
                fieldNames={{
                  value: 'departmentId',
                  label: 'name',
                }}
                treeDataSimpleMode={{
                  id: 'departmentId',
                  pId: 'parentId',
                }}
                treeData={departmentList}
                placeholder="不选表示顶级部门"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="name"
              label="部门名称"
              rules={[{ required: true, message: '部门名称不能为空' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sort"
              label="排序"
              rules={[{ required: true, message: '排序不能为空' }]}
            >
              <InputNumber />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="manager"
              label="负责人"
              rules={[{ required: false, message: '负责人不能为空' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="联系电话"
              rules={[
                {
                  validator: (_, phone) => {
                    const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
                    if (!phone || reg.test(phone)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(new Error('请输入正确的手机号码'));
                    }
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: false, type: 'email', message: '邮箱不能为空' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
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
