import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import SubscriptionTabs from './SubscriptionTabs';
import {
  DEFAULT_TAB,
  SUBSCRIPTIONS_TAB_PARAM,
} from './data/constants';
import NotFoundPage from '../NotFoundPage';
import { ROUTE_NAMES } from '../EnterpriseApp/data/constants';

const SubscriptionRoutes = ({ routePath }) => {
  const enterpriseSlug = useSelector(state => state.portalConfiguration.enterpriseSlug);
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={`/${enterpriseSlug}/admin/${routePath}/${DEFAULT_TAB}`} />}
      />
      <Route
        path={`/:${SUBSCRIPTIONS_TAB_PARAM}?/*`}
        element={<SubscriptionTabs routePath={routePath} />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

SubscriptionRoutes.defaultProps = {
  routePath: ROUTE_NAMES.subscriptionManagement,
};

SubscriptionRoutes.propTypes = {
  routePath: PropTypes.string,
};

export default SubscriptionRoutes;
