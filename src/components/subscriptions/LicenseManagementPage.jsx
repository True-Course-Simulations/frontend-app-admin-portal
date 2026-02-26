import SubscriptionManagementPage from './SubscriptionManagementPage';
import { ROUTE_NAMES } from '../EnterpriseApp/data/constants';

const LicenseManagementPage = () => (
  <SubscriptionManagementPage
    routePath={ROUTE_NAMES.licenseManagement}
    titleMessage={{
      id: 'admin.portal.license.management.page.title',
      defaultMessage: 'License Management',
      description: 'Title for the license management page.',
    }}
  />
);

export default LicenseManagementPage;
