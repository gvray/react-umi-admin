import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

interface AdvancedSearchFormProps {
  searchFields: any[];
  onSearchFinish: (params: FinishedParams) => void;
  resetSearch?: () => void;
}

export interface AdvancedSearchItem<T> {
  type: 'INPUT' | 'SELECT' | 'DATE_RANGE';
  value?: T[];
  optionMeta?: {
    value: string | number;
    label: string;
  };
}

type FinishedParams = {
  [key: string]: any;
};

const { Option } = Select;

const AdvancedSearchForm = forwardRef(
  (
    { searchFields = [], onSearchFinish, resetSearch }: AdvancedSearchFormProps,
    ref,
  ) => {
    const [expand, setExpand] = useState(false);
    const [form] = Form.useForm();

    const updateFieldsValue = (row: any) => {
      form.setFieldsValue(row);
    };

    useImperativeHandle(ref, () => ({
      // 暴露给父组件的方法
      updateFieldsValue,
    }));

    const getFieldElement = (item: any) => {
      const value = item.advancedSearch?.optionMeta?.value || 'value';
      const label = item.advancedSearch?.optionMeta?.label || 'label';
      switch (item.advancedSearch.type) {
        case 'INPUT':
          return <Input placeholder={`输入${item.title}`} />;
        case 'SELECT':
          return (
            <Select allowClear>
              {item.advancedSearch.value?.map((item: any) => (
                <Option key={item[value]} value={item[value]}>
                  {item[label]}
                </Option>
              ))}
            </Select>
          );
        case 'DATE_RANGE':
          return <DatePicker.RangePicker />;
        default:
          return null;
      }
    };
    const getFormItems = () => {
      if (searchFields.length === 0) {
        return [];
      }
      const count = expand ? searchFields.length : 2;
      const children = [];
      for (let i = 0; i < count; i++) {
        if (searchFields[i]) {
          children.push(
            <Col span={8} key={searchFields[i].dataIndex}>
              <Form.Item
                name={searchFields[i].dataIndex}
                label={searchFields[i].title}
              >
                {getFieldElement(searchFields[i])}
              </Form.Item>
            </Col>,
          );
        }
      }
      children.push(
        <Col
          span={8 * (3 - (count % 3))}
          key={'operation'}
          style={{
            textAlign: 'right',
          }}
        >
          <Space size={5}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button
              style={{
                margin: '0 8px',
              }}
              onClick={() => {
                form.resetFields();
                resetSearch?.();
              }}
            >
              重置
            </Button>
            {searchFields.length > 2 && (
              <Button
                type="link"
                onClick={() => {
                  setExpand(!expand);
                }}
              >
                {expand ? (
                  <span>
                    <UpOutlined />
                    收起
                  </span>
                ) : (
                  <span>
                    <DownOutlined />
                    展开
                  </span>
                )}
              </Button>
            )}
          </Space>
        </Col>,
      );

      return children;
    };

    const handleFinish = (values: FinishedParams) => {
      const { createdAt, ...rest } = values;
      if (!createdAt || createdAt.length === 0) {
        onSearchFinish?.({
          ...rest,
          createdAtStart: undefined,
          createdAtEnd: undefined,
        });
        return;
      }
      // 处理日期范围
      const createdAtStart = createdAt[0].format('YYYY-MM-DD');
      const createdAtEnd = createdAt[1].format('YYYY-MM-DD');
      onSearchFinish?.({ ...rest, createdAtStart, createdAtEnd });
    };

    return (
      <Form form={form} name="advanced_search" onFinish={handleFinish}>
        <Row gutter={24}>{getFormItems()}</Row>
      </Form>
    );
  },
);

AdvancedSearchForm.displayName = 'AdvancedSearchForm';
export default AdvancedSearchForm;
