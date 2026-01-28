import { useDispatch, useSelector } from 'react-redux';

import Sidebar from '../../components/Sidebar';

import {
  expandSidebar,
  collapseSidebar,
} from '../../data/actions/sidebar';

const SidebarContainer = (props) => {
  const dispatch = useDispatch();
  const {
    isExpanded,
    isExpandedByToggle,
    enableCodeManagementScreen,
    enableReportingConfigScreen,
    enableSubscriptionManagementScreen,
    enableSamlConfigurationScreen,
    enableLearnerPortal,
    enableLmsConfigurationsScreen,
    enableAnalyticsScreen,
  } = useSelector(state => ({
    isExpanded: state.sidebar.isExpanded,
    isExpandedByToggle: state.sidebar.isExpandedByToggle,
    enableCodeManagementScreen: state.portalConfiguration.enableCodeManagementScreen,
    enableReportingConfigScreen: state.portalConfiguration.enableReportingConfigScreen,
    enableSubscriptionManagementScreen: state.portalConfiguration.enableSubscriptionManagementScreen,
    enableSamlConfigurationScreen: state.portalConfiguration.enableSamlConfigurationScreen,
    enableLearnerPortal: state.portalConfiguration.enableLearnerPortal,
    enableLmsConfigurationsScreen: state.portalConfiguration.enableLmsConfigurationsScreen,
    enableAnalyticsScreen: state.portalConfiguration.enableAnalyticsScreen,
  }));

  const expandSidebarAction = () => dispatch(expandSidebar());
  const collapseSidebarAction = (usingToggle = false) => dispatch(collapseSidebar(usingToggle));

  return (
    <Sidebar
      {...props}
      isExpanded={isExpanded}
      isExpandedByToggle={isExpandedByToggle}
      enableCodeManagementScreen={enableCodeManagementScreen}
      enableReportingConfigScreen={enableReportingConfigScreen}
      enableSubscriptionManagementScreen={enableSubscriptionManagementScreen}
      enableSamlConfigurationScreen={enableSamlConfigurationScreen}
      enableLearnerPortal={enableLearnerPortal}
      enableLmsConfigurationsScreen={enableLmsConfigurationsScreen}
      enableAnalyticsScreen={enableAnalyticsScreen}
      expandSidebar={expandSidebarAction}
      collapseSidebar={collapseSidebarAction}
    />
  );
};

export default SidebarContainer;
