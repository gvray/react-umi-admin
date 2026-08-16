import { Dropdown, Input } from 'antd';
import React, { useState } from 'react';
import { styled } from 'umi';
import type { IconKey } from '../fullMap';
import IconPreview from '../IconPreview';
import Icon from '../index';

interface IconPickerProps {
  value?: IconKey;
  onChange?: (icon: IconKey) => void;
  placement?: 'bottomLeft' | 'bottomRight';
}

const DropdownPanel = styled.div`
  background-color: var(--gvray-bg-container);
  width: 680px;
  max-height: 500px;
  padding-left: 10px;
  padding-right: 10px;
  box-shadow: var(--gvray-box-shadow);
`;

const CustomPanel: React.FC<{ onChange?: (icon: IconKey) => void }> = ({
  onChange,
}) => {
  return (
    <DropdownPanel>
      <IconPreview onChange={onChange} />
    </DropdownPanel>
  );
};

const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onChange,
  placement = 'bottomLeft',
}) => {
  const [open, setOpen] = useState(false);
  const handleChange = (icon: IconKey) => {
    onChange?.(icon);
    setOpen(false);
  };
  return (
    <Dropdown
      popupRender={() => <CustomPanel onChange={handleChange} />}
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
      placement={placement}
    >
      <Input
        readOnly
        prefix={value ? <Icon name={value} /> : null}
        placeholder="选择图标"
        value={value}
      />
    </Dropdown>
  );
};

export default IconPicker;
