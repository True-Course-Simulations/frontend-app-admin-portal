import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import {
  screen,
  render,
} from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import CodeManagementRoutes from '../CodeManagementRoutes';
import { initializeMocks } from '../../../testUtils';

const COUPON_CODE_TABS_MOCK_CONTENT = 'coupon code tabs';
const MANAGE_CODES_MOCK_CONTENT = 'manage codes';
const NOT_FOUND_MOCK_CONTENT = 'not found';

jest.mock(
  '../CouponCodeTabs',
  () => function CouponCodeTabs() {
    return <div>{COUPON_CODE_TABS_MOCK_CONTENT}</div>;
  },
);

jest.mock(
  '../../NotFoundPage',
  () => function NotFoundPage() {
    return <div>{NOT_FOUND_MOCK_CONTENT}</div>;
  },
);

jest.mock(
  '../ManageCodesTab',
  () => function ManageCodesTab() {
    return <div>{MANAGE_CODES_MOCK_CONTENT}</div>;
  },
);

const enterpriseId = 'test-enterprise';
const enterpriseSlug = 'sluggy';
const initialStore = {
  portalConfiguration: {
    enterpriseId,
    enterpriseSlug,
    enableLearnerPortal: false,
  },
};

const CodeManagementRoutesWithRouter = ({
  initialState,
  initialEntries,
  routePath,
}) => {
  const { reduxStore } = initializeMocks(initialState);
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <Provider store={reduxStore}>
        <Routes>
          <Route path={`${routePath}*`} element={<CodeManagementRoutes />} />
        </Routes>
      </Provider>
    </MemoryRouter>
  );
};

CodeManagementRoutesWithRouter.propTypes = {
  initialState: PropTypes.shape(),
  initialEntries: PropTypes.arrayOf(PropTypes.string),
  routePath: PropTypes.string,
};

CodeManagementRoutesWithRouter.defaultProps = {
  initialState: { ...initialStore },
  initialEntries: [`/${enterpriseSlug}/admin/coupons`],
  routePath: '/',
};

describe('<CodeManagementRoutes />', () => {
  it('redirects to default tab', () => {
    render(<CodeManagementRoutesWithRouter initialState={initialStore} />);
    expect(screen.getByText(COUPON_CODE_TABS_MOCK_CONTENT));
  });
});
