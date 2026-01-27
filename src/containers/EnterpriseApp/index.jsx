import { useDispatch, useSelector } from 'react-redux';

import EnterpriseApp from '../../components/EnterpriseApp';

import { toggleSidebarToggle } from '../../data/actions/sidebar';
import { fetchEnterpriseAppData } from '../../data/actions/enterpriseApp';

const EnterpriseAppContainer = (props) => {
  const dispatch = useDispatch();
  const {
    adminPortalLearnerProfileViewEnabled,
    disableExpiryMessagingForLearnerCredit,
    enableAnalyticsScreen,
    enableCodeManagementScreen,
    enableLearnerPortal,
    enableLmsConfigurationsScreen,
    enablePortalLearnerCreditManagementScreen,
    enableReportingConfigurationsScreen,
    enableSamlConfigurationScreen,
    enableSubscriptionManagementScreen,
    enterpriseBranding,
    enterpriseFeatures,
    enterpriseId,
    enterpriseName,
    enterprises,
    error,
    loading,
  } = useSelector((state) => {
    const enterpriseListState = state.table['enterprise-list'] || {};
    return {
      adminPortalLearnerProfileViewEnabled: state.portalConfiguration.adminPortalLearnerProfileViewEnabled,
      disableExpiryMessagingForLearnerCredit: state.portalConfiguration.disableExpiryMessagingForLearnerCredit,
      enableAnalyticsScreen: state.portalConfiguration.enableAnalyticsScreen,
      enableCodeManagementScreen: state.portalConfiguration.enableCodeManagementScreen,
      enableLearnerPortal: state.portalConfiguration.enableLearnerPortal,
      enableLmsConfigurationsScreen: state.portalConfiguration.enableLmsConfigurationsScreen,
      enablePortalLearnerCreditManagementScreen: state.portalConfiguration.enablePortalLearnerCreditManagementScreen,
      enableReportingConfigurationsScreen: state.portalConfiguration.enableReportingConfigScreen,
      enableSamlConfigurationScreen: state.portalConfiguration.enableSamlConfigurationScreen,
      enableSubscriptionManagementScreen: state.portalConfiguration.enableSubscriptionManagementScreen,
      enterpriseBranding: state.portalConfiguration.enterpriseBranding,
      enterpriseFeatures: state.portalConfiguration.enterpriseFeatures,
      enterpriseId: state.portalConfiguration.enterpriseId,
      enterpriseName: state.portalConfiguration.enterpriseName,
      enterprises: enterpriseListState.data,
      error: state.portalConfiguration.error,
      loading: state.portalConfiguration.loading,
    };
  });

  const fetchEnterpriseAppDataAction = (slug) => {
    dispatch(fetchEnterpriseAppData(slug));
  };

  const toggleSidebarToggleAction = () => {
    dispatch(toggleSidebarToggle());
  };

  return (
    <EnterpriseApp
      {...props}
      adminPortalLearnerProfileViewEnabled={adminPortalLearnerProfileViewEnabled}
      disableExpiryMessagingForLearnerCredit={disableExpiryMessagingForLearnerCredit}
      enableAnalyticsScreen={enableAnalyticsScreen}
      enableCodeManagementScreen={enableCodeManagementScreen}
      enableLearnerPortal={enableLearnerPortal}
      enableLmsConfigurationsScreen={enableLmsConfigurationsScreen}
      enablePortalLearnerCreditManagementScreen={enablePortalLearnerCreditManagementScreen}
      enableReportingConfigurationsScreen={enableReportingConfigurationsScreen}
      enableSamlConfigurationScreen={enableSamlConfigurationScreen}
      enableSubscriptionManagementScreen={enableSubscriptionManagementScreen}
      enterpriseBranding={enterpriseBranding}
      enterpriseFeatures={enterpriseFeatures}
      enterpriseId={enterpriseId}
      enterpriseName={enterpriseName}
      enterprises={enterprises}
      error={error}
      loading={loading}
      fetchEnterpriseAppData={fetchEnterpriseAppDataAction}
      toggleSidebarToggle={toggleSidebarToggleAction}
    />
  );
};

export default EnterpriseAppContainer;
