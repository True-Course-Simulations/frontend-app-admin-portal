import React from 'react';
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

const SubscriptionRoutes = () => {
  const enterpriseSlug = useSelector(state => state.portalConfiguration.enterpriseSlug);
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={`/${enterpriseSlug}/admin/subscriptions/${DEFAULT_TAB}`} />}
      />
      <Route
        path={`/:${SUBSCRIPTIONS_TAB_PARAM}?/*`}
        element={<SubscriptionTabs />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default SubscriptionRoutes;
