import React from 'react';
import { render, screen } from '@testing-library/react';

import ReduxFormCheckbox from './index';

describe('<ReduxFormCheckbox />', () => {
  it('renders checked correctly', () => {
    const inputProp = { checked: true };
    render(<ReduxFormCheckbox id="id" input={inputProp} label="Test label" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.checked).toBe(true);
  });
  it('renders unchecked correctly', () => {
    const inputProp = { checked: false };
    render(<ReduxFormCheckbox id="id" input={inputProp} label="Test label" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.checked).toBe(false);
  });
});
