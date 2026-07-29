import { Dropdown, Input } from 'antd';
import React, { useState } from 'react';
import { styled } from 'umi';
import IconPreview from '../IconPreview';
import Icon from '../index';
import type { IconKey } from '../map';

interface IconPickerProps {
  value?: IconKey;
  onChange?: (icon: IconKey) => void;
}

const DropdownPanel = styled.div`
  background-color: var(--gvray-bg-container);
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

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
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
