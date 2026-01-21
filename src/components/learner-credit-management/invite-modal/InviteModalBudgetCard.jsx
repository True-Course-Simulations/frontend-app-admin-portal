import React from 'react';
import {
  Card, Col, Row, Skeleton,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useSelector } from 'react-redux';
import { makePlural } from '../../../utils';

import {
  useBudgetDetailHeaderData,
  useBudgetId,
  useEnterpriseGroupLearners,
  useEnterpriseOffer, useSubsidyAccessPolicy,
  useSubsidySummaryAnalyticsApi,
} from '../data';
import BudgetDetail from '../BudgetDetail';
import { BUDGET_TYPES } from '../../EnterpriseApp/data/constants';
import BudgetStatusSubtitle from '../BudgetStatusSubtitle';

const InviteModalBudgetCard = () => {
  const enterpriseUUID = useSelector(state => state.portalConfiguration.enterpriseId);
  const intl = useIntl();
  const { subsidyAccessPolicyId, enterpriseOfferId } = useBudgetId();
  const { data: subsidyAccessPolicy } = useSubsidyAccessPolicy(subsidyAccessPolicyId);
  const { data } = useEnterpriseGroupLearners(subsidyAccessPolicy?.groupAssociations[0]);

  const memberSubtitle = data?.count ? `${makePlural(data?.count, 'current member')}` : '';
  const budgetType = (enterpriseOfferId !== null) ? BUDGET_TYPES.ecommerce : BUDGET_TYPES.policy;

  const { isLoading: isLoadingSubsidySummary, subsidySummary } = useSubsidySummaryAnalyticsApi(
    enterpriseUUID,
    enterpriseOfferId,
    budgetType,
  );

  // Fetch enterprise offer with graceful error handling
  const { isLoading: isLoadingEnterpriseOffer, data: enterpriseOfferMetadata } = useEnterpriseOffer(enterpriseOfferId);

  const policyOrOfferId = subsidyAccessPolicyId || enterpriseOfferId;
  const {
    budgetDisplayName,
    budgetTotalSummary,
    status,
    badgeVariant,
    term,
    date,
    isAssignable,
  } = useBudgetDetailHeaderData({
    intl,
    subsidyAccessPolicy,
    subsidySummary,
    budgetId: policyOrOfferId,
    enterpriseOfferMetadata,
  });

  if (!subsidyAccessPolicy && (isLoadingSubsidySummary || isLoadingEnterpriseOffer)) {
    return (
      <div data-testid="budget-detail-skeleton">
        <Skeleton height={180} />
        <span className="sr-only">Loading budget header data</span>
      </div>
    );
  }

  const { available, utilized, limit } = budgetTotalSummary;
  return (
    <Card className="budget-overview-card">
      <Card.Section>
        <Row>
          <Col lg={5}>
            <h4>{budgetDisplayName}</h4>
            <p>{memberSubtitle}</p>
            <BudgetStatusSubtitle
              badgeVariant={badgeVariant}
              status={status}
              isAssignable={isAssignable}
              term={term}
              date={date}
              policy={subsidyAccessPolicy}
              enterpriseUUID={enterpriseUUID}
            />
          </Col>
          <Col lg={7}>
            <BudgetDetail available={available} utilized={utilized} limit={limit} status={status} />
          </Col>
        </Row>
      </Card.Section>
    </Card>
  );
};

export default InviteModalBudgetCard;
