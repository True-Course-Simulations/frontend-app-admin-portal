import React from 'react';
import { useSelector } from 'react-redux';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import NotFoundPage from '../NotFoundPage';
import CouponCodeTabs from './CouponCodeTabs';
import {
  DEFAULT_TAB,
  COUPON_CODE_TAB_PARAM,
} from './data/constants';

const CodeManagementRoutes = () => {
  const enterpriseSlug = useSelector(state => state.portalConfiguration.enterpriseSlug);
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={`/${enterpriseSlug}/admin/coupons/${DEFAULT_TAB}`} replace />}
      />
      <Route
        path={`/:${COUPON_CODE_TAB_PARAM}?/*`}
        element={<CouponCodeTabs />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default CodeManagementRoutes;
