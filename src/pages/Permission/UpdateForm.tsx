import { DictionarySelect, FormGrid, IconSelector } from '@/components';
import { DEFAULT_MODAL_TITLE } from '@/constants';
import { useFeedback } from '@/hooks';
import { createPermission, updatePermission } from '@/services/permission';
import type { DictOption } from '@/types/dict';
import { createFormLayout } from '@/utils';
import { VIRTUAL_ROOT_ID } from '@/utils/tree';
import {
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Switch,
  TreeSelect,
} from 'antd';
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { useUpdataFormModel } from './model';
import { normalizeToBackend, withVirtualRoot } from './util';

interface UpdateFormProps {
  onCancel?: () => void;
  onOk?: () => void;
  dict: Record<string, DictOption[]>;
}

export interface UpdateFormRef {
  show: (title: string, data?: Record<string, unknown>) => void;
  hide: () => void;
  form: FormInstance;
}

const UpdateFormFunction: React.ForwardRefRenderFunction<
  UpdateFormRef,
  UpdateFormProps
> = ({ onOk, onCancel, dict }, ref) => {
  const { message } = useFeedback();
  const [title, setTitle] = useState(DEFAULT_MODAL_TITLE);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const { data: permissionParentList } = useUpdataFormModel(visible);
  const typeValue = Form.useWatch('type', form);
  const permissionId = Form.useWatch('permissionId', form);

  // 处理父级权限列表：添加虚拟根节点 + 根据类型过滤 + 禁用节点
  const processedParentList = useMemo(() => {
    if (!permissionParentList?.length) return [];

    // 添加虚拟根节点
    let list = withVirtualRoot(permissionParentList);

    // 根据当前类型过滤
    if (typeValue === 'DIRECTORY') {
      // 目录类型：过滤掉菜单类型
      list = list.filter((item) => item.type !== 'MENU');
    } else if (typeValue === 'MENU') {
      // 菜单类型：过滤掉菜单类型（菜单不能放在菜单下）
      list = list.filter((item) => item.type !== 'MENU');
    }

    // 按钮类型：禁用目录节点
    if (typeValue === 'BUTTON') {
      list = list.map((item) => ({
        ...item,
        disabled:
          (item as any).type === 'DIRECTORY' &&
          item.permissionId !== VIRTUAL_ROOT_ID,
      }));
    }

    return list;
  }, [permissionParentList, typeValue]);

  // 当类型切换时，检查当前选中的父级权限是否仍然有效
  useEffect(() => {
    const currentParentId = form.getFieldValue('parentPermissionId');
    if (!currentParentId || currentParentId === VIRTUAL_ROOT_ID) return;

    // 检查当前选中的父级是否在处理后的列表中
    const isValid = processedParentList.some(
      (item) =>
        item.permissionId === currentParentId && !(item as any).disabled,
    );

    // 如果当前选中的父级不再有效，重置为虚拟根节点
    if (!isValid) {
      form.setFieldsValue({ parentPermissionId: VIRTUAL_ROOT_ID });
    }
  }, [typeValue, processedParentList, form]);

  // 重置弹出层表单
  const reset = () => {
    form.resetFields();
    setConfirmLoading(false);
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      // 处理虚拟根节点：将 __root__ 转换为 null
      const normalizedValues = normalizeToBackend(values);

      if (!form.getFieldValue('permissionId')) {
        await createPermission(normalizedValues);
        message.success('新增成功');
      } else {
        const { permissionId, ...rest } = normalizedValues;
        await updatePermission(permissionId, rest);
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
            // 编辑模式
            form.setFieldsValue({
              ...data,
              // 如果 parentPermissionId 为 null，设置为虚拟根节点
              parentPermissionId: data.parentPermissionId ?? VIRTUAL_ROOT_ID,
              type: data.type ?? 'BUTTON',
              menuMeta: data.menuMeta ?? {},
            });
          } else {
            // 新增模式
            form.setFieldsValue({
              type: 'BUTTON',
              action: 'view',
              parentPermissionId: VIRTUAL_ROOT_ID,
              menuMeta: { hidden: false, sort: 0 },
            });
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
        {...createFormLayout()}
        form={form}
        layout="horizontal"
        name="form_in_modal"
        initialValues={{
          type: 'BUTTON',
          action: 'view',
          menuMeta: { hidden: false, sort: 0 },
        }}
        onValuesChange={handleValuesChange}
      >
        <Form.Item name="permissionId" label="权限Id" hidden>
          <Input />
        </Form.Item>
        <FormGrid>
          <FormGrid.Item span={24}>
            <Form.Item
              name="parentPermissionId"
              label="上级权限"
              {...createFormLayout(3)}
              rules={[{ required: true, message: '请选择上级权限' }]}
            >
              <TreeSelect
                treeDefaultExpandAll
                fieldNames={{ value: 'permissionId', label: 'name' }}
                treeDataSimpleMode={{
                  id: 'permissionId',
                  pId: 'parentPermissionId',
                }}
                treeData={processedParentList}
                treeNodeFilterProp="name"
                placeholder="请选择上级权限"
              />
            </Form.Item>
          </FormGrid.Item>
          <FormGrid.Item span={12}>
            <Form.Item
              name="name"
              label="权限名称"
              rules={[{ required: true, message: '权限名称不能为空' }]}
            >
              <Input />
            </Form.Item>
          </FormGrid.Item>
          <FormGrid.Item span={12}>
            <Form.Item
              name="type"
              label="权限类型"
              rules={[{ required: true, message: '权限类型不能为空' }]}
            >
              <DictionarySelect
                disabled={Boolean(permissionId)}
                options={dict['permission_type']?.filter(
                  (item) => item.value !== 'API',
                )}
              />
            </Form.Item>
          </FormGrid.Item>
          <FormGrid.Item span={12}>
            <Form.Item
              name="code"
              label="权限代码"
              rules={[{ required: true, message: '权限代码不能为空' }]}
            >
              <Input placeholder="如 user:view" />
            </Form.Item>
          </FormGrid.Item>
          {typeValue === 'BUTTON' && (
            <FormGrid.Item span={12}>
              <Form.Item
                name="action"
                label="权限动作"
                rules={[{ required: true, message: '权限动作不能为空' }]}
              >
                <DictionarySelect options={dict['permission_action']} />
              </Form.Item>
            </FormGrid.Item>
          )}
          {typeValue === 'MENU' && (
            <>
              <FormGrid.Item span={12}>
                <Form.Item name={['menuMeta', 'path']} label="菜单路径">
                  <Input placeholder="/system/permission" />
                </Form.Item>
              </FormGrid.Item>
              <FormGrid.Item span={12}>
                <Form.Item name={['menuMeta', 'icon']} label="菜单图标">
                  <IconSelector />
                </Form.Item>
              </FormGrid.Item>
              <FormGrid.Item span={12}>
                <Form.Item name={['menuMeta', 'component']} label="菜单组件">
                  <Input placeholder="如 Permission" />
                </Form.Item>
              </FormGrid.Item>
              <FormGrid.Item span={12}>
                <Form.Item name={['menuMeta', 'sort']} label="排序">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </FormGrid.Item>
              <FormGrid.Item span={12}>
                <Form.Item
                  name={['menuMeta', 'hidden']}
                  label="隐藏菜单"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </FormGrid.Item>
            </>
          )}
          <FormGrid.Item span={24}>
            <Form.Item
              name="description"
              label="描述信息"
              {...createFormLayout(3)}
            >
              <Input.TextArea placeholder="请输入内容"></Input.TextArea>
            </Form.Item>
          </FormGrid.Item>
        </FormGrid>
      </Form>
    </Modal>
  );
};

const UpdateForm = React.forwardRef<UpdateFormRef, UpdateFormProps>(
  UpdateFormFunction,
);

UpdateForm.displayName = 'UpdateForm';

export default UpdateForm;
