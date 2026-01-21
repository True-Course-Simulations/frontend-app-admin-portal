import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import {
  screen,
  render,
} from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import SubscriptionRoutes from '../SubscriptionRoutes';
import { initializeMocks } from '../../../testUtils';

const SUBSCRIPTION_TABS_MOCK_CONTENT = 'subcription tabs';
const SUBSCRIPTION_PLAN_ROUTES_MOCK_CONTENT = 'subscription plan routes';
const NOT_FOUND_MOCK_CONTENT = 'not found';

jest.mock(
  '../SubscriptionTabs',
  () => function SubscriptionTabs() {
    return <div>{SUBSCRIPTION_TABS_MOCK_CONTENT}</div>;
  },
);

jest.mock(
  '../../NotFoundPage',
  () => function NotFoundPage() {
    return <div>{NOT_FOUND_MOCK_CONTENT}</div>;
  },
);

jest.mock(
  '../SubscriptionPlanRoutes',
  () => function SubscriptionPlanRoutes() {
    return <div>{SUBSCRIPTION_PLAN_ROUTES_MOCK_CONTENT}</div>;
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

const getStore = storeState => initializeMocks(storeState).reduxStore;
const store = getStore({ ...initialStore });

const SubscriptionRoutesWithRouter = ({
  store: storeProp,
  initialEntries,
  routePath,
}) => (
  <MemoryRouter initialEntries={initialEntries}>
    <Provider store={storeProp}>
      <Routes>
        <Route path={`${routePath}*`} element={<SubscriptionRoutes />} />
      </Routes>
    </Provider>
  </MemoryRouter>
);

SubscriptionRoutesWithRouter.propTypes = {
  store: PropTypes.shape(),
  initialEntries: PropTypes.arrayOf(PropTypes.string),
  routePath: PropTypes.string,
};

SubscriptionRoutesWithRouter.defaultProps = {
  store,
  initialEntries: [`/${enterpriseSlug}/admin/subscriptions`],
  routePath: '/',
};

describe('<SubscriptionRoutes />', () => {
  it('redirects to default tab', () => {
    const newStore = getStore({
      ...initialStore,
      portalConfiguration: {
        ...initialStore.portalConfiguration,
      },
    });
    render(<SubscriptionRoutesWithRouter store={newStore} />);
    expect(screen.getByText(SUBSCRIPTION_TABS_MOCK_CONTENT));
  });
});
