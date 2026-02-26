import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Container } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useSelector } from 'react-redux';

import Hero from '../Hero';
import SubscriptionData from './SubscriptionData';
import SubscriptionRoutes from './SubscriptionRoutes';
import { ADMINISTER_SUBSCRIPTIONS_TARGETS } from '../ProductTours/AdminOnboardingTours/constants';
import { ROUTE_NAMES } from '../EnterpriseApp/data/constants';

const SubscriptionManagementPage = ({ routePath, titleMessage }) => {
  const enterpriseId = useSelector(state => state.portalConfiguration.enterpriseId);
  const intl = useIntl();
  const PAGE_TITLE = intl.formatMessage({
    ...titleMessage,
  });

  return (
    <SubscriptionData enterpriseId={enterpriseId}>
      <Helmet title={PAGE_TITLE} />
      <Hero title={PAGE_TITLE} />
      <main role="main" className="manage-subscription">
        <Container id={ADMINISTER_SUBSCRIPTIONS_TARGETS.SUBSCRIPTION_PLANS_LIST} className="py-3" fluid>
          <SubscriptionRoutes routePath={routePath} />
        </Container>
      </main>
    </SubscriptionData>
  );
};

SubscriptionManagementPage.defaultProps = {
  routePath: ROUTE_NAMES.subscriptionManagement,
  titleMessage: {
    id: 'admin.portal.subscription.management.page.title',
    defaultMessage: 'Subscription Management',
    description: 'Title for the subscription management page.',
  },
};

SubscriptionManagementPage.propTypes = {
  routePath: PropTypes.string,
  titleMessage: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }),
};

export default SubscriptionManagementPage;
