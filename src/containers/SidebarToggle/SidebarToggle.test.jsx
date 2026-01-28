import React from 'react';
import PropTypes from 'prop-types';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';

import SidebarToggle from './index';
import {
  EXPAND_SIDEBAR,
  COLLAPSE_SIDEBAR,
} from '../../data/constants/sidebar';
import { initializeMocks } from '../../testUtils';

const initialState = {
  sidebar: {
    isExpandedByToggle: false,
  },
};

const createStore = (state = initialState) => initializeMocks(state).reduxStore;

const SidebarToggleWrapper = ({ store, ...props }) => {
  const resolvedStore = store || createStore();
  return (
    <Provider store={resolvedStore}>
      <SidebarToggle
        baseUrl="/test-enterprise-slug"
        {...props}
      />
    </Provider>
  );
};

SidebarToggleWrapper.propTypes = {
  store: PropTypes.shape({}),
};

describe('<Sidebar />', () => {
  it('renders correctly with menu icon', async () => {
    render(<SidebarToggleWrapper />);
    const menuIcon = await screen.findByTestId('menu-icon');
    expect(menuIcon).toBeInTheDocument();
  });

  it('renders correctly with close icon', async () => {
    const store = createStore({
      sidebar: {
        ...initialState.sidebar,
        isExpandedByToggle: true,
      },
    });
    render(<SidebarToggleWrapper store={store} />);
    const closeIcon = await screen.findByTestId('close-icon');
    expect(closeIcon).toBeInTheDocument();
  });

  it('dispatches expandSidebar action', async () => {
    const store = createStore({
      ...initialState,
    });
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    render((
      <SidebarToggleWrapper store={store} />
    ));

    const toggleButton = await screen.findByTestId('menu-icon');
    fireEvent.click(toggleButton);
    expect(dispatchSpy.mock.calls.some((call) => call[0]?.type === EXPAND_SIDEBAR
      && call[0]?.payload?.usingToggle === true)).toBe(true);
  });

  it('dispatches collapseSidebar action', async () => {
    const store = createStore({
      ...initialState,
      sidebar: {
        ...initialState.sidebar,
        isExpandedByToggle: true,
      },
    });
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    render((
      <SidebarToggleWrapper store={store} />
    ));

    const toggleButton = await screen.findByTestId('close-icon');
    fireEvent.click(toggleButton);
    expect(dispatchSpy.mock.calls.some((call) => call[0]?.type === COLLAPSE_SIDEBAR
      && call[0]?.payload?.usingToggle === true)).toBe(true);
  });
});
