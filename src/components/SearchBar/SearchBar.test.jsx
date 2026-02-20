import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import SearchBar from './index';

describe('<SearchBar />', () => {
  it('renders correctly', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByTestId('search-field')).toBeTruthy();
  });

  it('calls onSearch callback handler', () => {
    const mockOnSearchCallback = jest.fn();
    const { container } = render((
      <SearchBar
        onSearch={mockOnSearchCallback}
      />
    ));
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: 'foobar' } });
    const form = container.querySelector('input');
    fireEvent.submit(form);
    expect(mockOnSearchCallback).toHaveBeenCalledTimes(1);
  });
});
