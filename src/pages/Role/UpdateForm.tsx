import { PermissionTree } from '@/components';
import { addRole, updateRole } from '@/services/role';
import { logger } from '@/utils';
import { mapTree } from '@gvray/eskit';
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

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
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
  const { data } = useUpdataFormModel(visible);
  // 重置弹出层表单
  const reset = () => {
    form.resetFields();
    setConfirmLoading(false);
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      if (form.getFieldValue('roleId') === undefined) {
        await addRole(values);
        message.success('新增成功');
      } else {
        await updateRole(values);
        message.success('修改成功');
      }
      setVisible(false);
      onOk?.();
      reset();
    } catch (errorInfo: any) {
      console.log(errorInfo);
      logger.error(`更新角色失败：${errorInfo?.message}`);
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
        show: (title, data) => {
          setTitle(title);
          setVisible(true);
          reset();
          if (data) {
            // setIsEdit(true);
            form.setFieldsValue(data);
            const permissionsIds = new Set(
              data.permissions.map((item: any) => item.permissionId),
            );
            // each(data.permissions, (item: any) => {
            //   permissionsIds.add(item.resource.resourceId);
            // });
            form.setFieldsValue({ permissionIds: Array.from(permissionsIds) });
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
        {...formItemLayout}
        form={form}
        layout="horizontal"
        name="form_in_modal"
        initialValues={{
          status: 1,
          sort: 0,
        }}
      >
        <Form.Item name="roleId" label="角色Id" hidden>
          <Input />
        </Form.Item>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="角色名称"
              rules={[{ required: true, message: '角色名称不能为空' }]}
            >
              <Input placeholder="请输入角色名称" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="roleKey"
              label="角色标识"
              rules={[{ required: true, message: '角色标识不能为空' }]}
            >
              <Input placeholder="请输入角色标识" maxLength={50} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="sort"
              label="排序"
              rules={[{ required: true, message: '排序不能为空' }]}
            >
              <InputNumber placeholder="请输入排序" />
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item name="dataScope" label="数据范围" rules={[{ required: true, message: '数据范围不能为空' }]}>
              <Radio.Group>
                <Radio value="1">全部数据</Radio>
                <Radio value="2">本部门数据</Radio>
                <Radio value="3">本部门及子部门数据</Radio>
              </Radio.Group>
            </Form.Item>
          </Col> */}
          <Col span={24}>
            <Form.Item name="permissionIds" label="权限点分配">
              <PermissionTree
                value={form.getFieldValue('permissionIds') || []}
                onChange={(values: any[]) =>
                  form.setFieldsValue({ permissionIds: values })
                }
                treeData={mapTree(data, (item: any) => ({
                  ...item,
                  key: item.permissionId ?? item.resourceId,
                  title: item.name,
                  children: item.children,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="status" label="角色状态">
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
