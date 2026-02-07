export const createFormLayout = (labelSpan = 6) => {
  const span = Math.max(0, Math.min(24, labelSpan));

  return {
    labelCol: { span },
    wrapperCol: { span: 24 - span },
  };
};
