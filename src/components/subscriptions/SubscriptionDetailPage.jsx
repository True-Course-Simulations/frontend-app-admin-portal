import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import SubscriptionExpirationModals from './expiration/SubscriptionExpirationModals';
import SubscriptionDetails from './SubscriptionDetails';
import LicenseAllocationDetails from './licenses/LicenseAllocationDetails';
import SubscriptionDetailContextProvider from './SubscriptionDetailContextProvider';
import { useSubscriptionFromParams } from './data/contextHooks';
import SubscriptionDetailsSkeleton from './SubscriptionDetailsSkeleton';
import { ROUTE_NAMES } from '../EnterpriseApp/data/constants';
import { MANAGE_LEARNERS_TAB } from './data/constants';

export const SubscriptionDetailPage = ({ routePath }) => {
  const { subscriptionUUID } = useParams();
  const enterpriseSlug = useSelector(state => state.portalConfiguration.enterpriseSlug);
  const [subscription, loadingSubscription] = useSubscriptionFromParams({ subscriptionUUID });

  if (!subscription && !loadingSubscription) {
    return (
      <Navigate
        to={`/${enterpriseSlug}/admin/${routePath}/${MANAGE_LEARNERS_TAB}`}
        replace
      />
    );
  }

  if (loadingSubscription) {
    return (
      <SubscriptionDetailsSkeleton data-testid="skelly" />
    );
  }
  return (
    <SubscriptionDetailContextProvider subscription={subscription}>
      <SubscriptionExpirationModals />
      <SubscriptionDetails />
      <LicenseAllocationDetails />
    </SubscriptionDetailContextProvider>
  );
};

SubscriptionDetailPage.defaultProps = {
  routePath: ROUTE_NAMES.subscriptionManagement,
};

SubscriptionDetailPage.propTypes = {
  routePath: PropTypes.string,
};

export default SubscriptionDetailPage;
