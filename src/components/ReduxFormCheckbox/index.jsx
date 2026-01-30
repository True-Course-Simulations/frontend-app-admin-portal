import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const ReduxFormCheckbox = (props) => {
  const {
    id,
    label,
    helpText,
    input,
    defaultChecked,
  } = props;
  const hasOnChange = typeof input.onChange === 'function';

  return (
    <Form.Group as="div">
      <Form.Checkbox
        {...input}
        id={id}
        checked={input.checked ?? defaultChecked}
        readOnly={!hasOnChange}
        description={helpText}
      >
        {label}
      </Form.Checkbox>
    </Form.Group>
  );
};

ReduxFormCheckbox.defaultProps = {
  helpText: null,
  defaultChecked: false,
};

ReduxFormCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  input: PropTypes.shape({
    checked: PropTypes.bool,
  }).isRequired,
  helpText: PropTypes.string,
  defaultChecked: PropTypes.bool,
};

export default ReduxFormCheckbox;
