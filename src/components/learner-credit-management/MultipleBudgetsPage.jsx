import React, { useContext } from 'react';
import {
  Card, Col, Container, Hyperlink, Row, Skeleton, Stack,
} from '@openedx/paragon';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useIntl, FormattedMessage } from '@edx/frontend-platform/i18n';

import Hero from '../Hero';
import MultipleBudgetsPicker from './MultipleBudgetsPicker';
import { EnterpriseSubsidiesContext } from '../EnterpriseSubsidiesContext';
import { configuration } from '../../config';
import { useEnterpriseBudgets } from '../EnterpriseSubsidiesContext/data/hooks';

const MultipleBudgetsPage = () => {
  const enterpriseUUID = useSelector(state => state.portalConfiguration.enterpriseId);
  const enterpriseSlug = useSelector(state => state.portalConfiguration.enterpriseSlug);
  const enableLearnerPortal = useSelector(state => state.portalConfiguration.enableLearnerPortal);
  const enablePortalLearnerCreditManagementScreen = useSelector(
    state => state.portalConfiguration.enablePortalLearnerCreditManagementScreen,
  );
  const intl = useIntl();
  const PAGE_TITLE = intl.formatMessage({
    id: 'lcm.page.title',
    defaultMessage: 'Learner Credit Management',
    description: 'Title for the Learner Credit Management page',
  });
  const { isLoading } = useContext(EnterpriseSubsidiesContext);
  const { data: budgetsOverview } = useEnterpriseBudgets({
    enterpriseId: enterpriseUUID,
    enablePortalLearnerCreditManagementScreen,
  });
  const {
    budgets = [],
  } = budgetsOverview || {};

  if (isLoading) {
    return (
      <>
        <h1><Skeleton /></h1>
        <Skeleton height={200} count={2} />
        <span className="sr-only">
          <FormattedMessage
            id="lcm.budgets.loading"
            defaultMessage="Loading budgets..."
            description="Loading budgets"
          />
        </span>
      </>
    );
  }

  if (budgets.length === 0) {
    return (
      <Stack>
        <Helmet title={PAGE_TITLE} />
        <Hero title={PAGE_TITLE} />
        <Card>
          <Card.Section className="text-center">
            <Row>
              <Col xs={12} lg={{ span: 8, offset: 2 }}>
                <h3 className="mb-3">
                  <FormattedMessage
                    id="lcm.budgets.no.budgets"
                    defaultMessage="No budgets for your organization"
                    description="No budgets for your organization"
                  />
                </h3>
                <p>
                  <FormattedMessage
                    id="lcm.budgets.no.budgets.description"
                    defaultMessage="We were unable to find any budgets for your organization. Please contact Customer Support if you have questions."
                    description="Description for no budgets found and guidance to contact support."
                  />
                </p>
                <Hyperlink
                  className="btn btn-brand"
                  target="_blank"
                  destination={configuration.ENTERPRISE_SUPPORT_URL}
                >
                  <FormattedMessage
                    id="lcm.budgets.contact.support"
                    defaultMessage="Contact support"
                    description="Contact support text for no budgets found."
                  />
                </Hyperlink>
              </Col>
            </Row>
          </Card.Section>
        </Card>
      </Stack>
    );
  }

  return (
    <>
      <Helmet title={PAGE_TITLE} />
      <Hero title={PAGE_TITLE} />
      <Container className="py-3" fluid>
        <MultipleBudgetsPicker
          budgets={budgets}
          enterpriseUUID={enterpriseUUID}
          enterpriseSlug={enterpriseSlug}
          enableLearnerPortal={enableLearnerPortal}
        />
      </Container>
    </>
  );
};

export default MultipleBudgetsPage;
