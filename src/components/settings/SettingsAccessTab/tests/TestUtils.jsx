/* eslint-disable react/prop-types */
import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { EnterpriseSubsidiesContext } from '../../../EnterpriseSubsidiesContext';
import { initializeMocks } from '../../../../testUtils';

const ENTERPRISE_ID = 'test-enterprise';
const NET_DAYS_UNTIL_EXPIRATION = 100;

export const MOCK_CONSTANTS = {
  ENTERPRISE_ID,
  NET_DAYS_UNTIL_EXPIRATION,
};

const basicStore = {
  portalConfiguration: {
    enterpriseId: ENTERPRISE_ID,
    enterpriseSlug: 'test-enterprise',
    enableUniversalLink: true,
  },
};

/**
 * Generates Store from `basicStore`
 * @param {portalConfiguration: Object, coupons: Object} Object custom store data
 * @returns {Object} Generated store
 */
export const generateStore = ({
  portalConfiguration,
  coupons,
}) => {
  const { reduxStore } = initializeMocks({
    ...basicStore,
    portalConfiguration: {
      ...basicStore.portalConfiguration,
      ...portalConfiguration,
    },
    coupons: {
      loading: false,
      ...coupons,
    },
  });
  return reduxStore;
};

const MockSettingsContext = ({
  store,
  enterpriseSubsidiesContextValue,
  children,
}) => (
  <Provider store={store}>
    <EnterpriseSubsidiesContext.Provider value={enterpriseSubsidiesContextValue}>
      {children}
    </EnterpriseSubsidiesContext.Provider>
  </Provider>
);

MockSettingsContext.propTypes = {
  children: PropTypes.node.isRequired,
  store: PropTypes.shape(),
};

MockSettingsContext.defaultProps = {
  store: basicStore,
};

export default MockSettingsContext;
