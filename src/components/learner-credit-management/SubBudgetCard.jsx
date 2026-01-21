import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import classNames from 'classnames';
import {
  Card,
  Button,
  Badge,
  Stack,
} from '@openedx/paragon';

import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { BUDGET_STATUSES, ROUTE_NAMES } from '../EnterpriseApp/data/constants';
import {
  getBudgetStatus, getTranslatedBudgetStatus, getTranslatedBudgetTerm,
} from './data';
import { isBudgetRetiredOrExpired } from './data/utils';
import { useEnterpriseBudgets } from '../EnterpriseSubsidiesContext/data/hooks';
import SubBudgetCardUtilization from './SubBudgetCardUtilization';
import { ALLOCATE_LEARNING_BUDGETS_TARGETS } from '../ProductTours/AdminOnboardingTours/constants';

const BaseBackgroundFetchingWrapper = ({
  children,
}) => {
  const enterpriseId = useSelector(state => state.portalConfiguration.enterpriseId);
  const enablePortalLearnerCreditManagementScreen = useSelector(
    state => state.portalConfiguration.enablePortalLearnerCreditManagementScreen,
  );
  const { isFetching: isFetchingBudgets } = useEnterpriseBudgets({
    enablePortalLearnerCreditManagementScreen,
    enterpriseId,
  });
  return <span style={{ opacity: isFetchingBudgets ? 0.5 : 1 }}>{children}</span>;
};

BaseBackgroundFetchingWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

BaseBackgroundFetchingWrapper.defaultProps = {
};
const BackgroundFetchingWrapper = BaseBackgroundFetchingWrapper;

const BaseSubBudgetCard = ({
  id,
  start,
  end,
  available,
  pending,
  spent,
  displayName,
  isLoading,
  isAssignable,
  isBnREnabled,
  isRetired,
  retiredAt,
}) => {
  const enterpriseId = useSelector(state => state.portalConfiguration.enterpriseId);
  const enterpriseSlug = useSelector(state => state.portalConfiguration.enterpriseSlug);
  const enablePortalLearnerCreditManagementScreen = useSelector(
    state => state.portalConfiguration.enablePortalLearnerCreditManagementScreen,
  );
  const { isFetching: isFetchingBudgets } = useEnterpriseBudgets({
    enablePortalLearnerCreditManagementScreen,
    enterpriseId,
  });
  const intl = useIntl();
  const budgetLabel = getBudgetStatus({
    intl,
    startDateStr: start,
    endDateStr: end,
    isBudgetRetired: isRetired,
    retiredDateStr: retiredAt,
  });
  const {
    status, term, badgeVariant, date,
  } = budgetLabel;
  const formattedDate = date ? intl.formatDate(
    dayjs(date).toDate(),
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
  ) : undefined;
  const isRetiredOrExpired = isBudgetRetiredOrExpired(status);

  const hasBudgetAggregatesSection = () => {
    const statusesWithoutAggregates = [
      BUDGET_STATUSES.scheduled,
    ];
    return !statusesWithoutAggregates.includes(status);
  };

  const renderActions = (budgetId) => (
    <Button
      data-testid="view-budget"
      id={ALLOCATE_LEARNING_BUDGETS_TARGETS.VIEW_BUDGET}
      as={Link}
      to={`/${enterpriseSlug}/admin/${ROUTE_NAMES.learnerCredit}/${budgetId}`}
      variant={isRetiredOrExpired ? 'outline-primary' : 'primary'}
    >
      {isRetiredOrExpired ? (
        <FormattedMessage
          id="lcm.budgets.budget.card.view.budget.history"
          defaultMessage="View budget history"
          description="Button text to view budget history"
        />
      ) : (
        <FormattedMessage
          id="lcm.budgets.budget.card.view.budget"
          defaultMessage="View budget"
          description="Button text to view a budget"
        />
      )}
    </Button>
  );

  const renderCardHeader = (budgetType, budgetId) => {
    const subtitle = (
      <Stack direction="horizontal" gap={2.5}>
        <Badge variant={badgeVariant}>{getTranslatedBudgetStatus(intl, status)}</Badge>
        {(term && formattedDate) && (
          <span data-testid="budget-date">
            {getTranslatedBudgetTerm(intl, term)} {formattedDate}
          </span>
        )}
      </Stack>
    );

    const showActions = status !== BUDGET_STATUSES.scheduled;

    return (
      <Card.Header
        title={<BackgroundFetchingWrapper>{budgetType}</BackgroundFetchingWrapper>}
        subtitle={<BackgroundFetchingWrapper>{subtitle}</BackgroundFetchingWrapper>}
        actions={showActions ? renderActions(budgetId) : undefined}
        className={classNames('align-items-center', { 'mb-4.5': !hasBudgetAggregatesSection() })}
      />
    );
  };

  return (
    <Card
      orientation="horizontal"
      isLoading={isLoading}
      data-testid="balance-detail-section"
    >
      <Card.Body>
        <Stack gap={4.5}>
          {renderCardHeader(displayName || 'Overview', id)}
          {hasBudgetAggregatesSection() && (
            <SubBudgetCardUtilization
              isFetchingBudgets={isFetchingBudgets}
              isAssignable={isAssignable}
              isBnREnabled={isBnREnabled}
              status={status}
              available={available}
              pending={pending}
              spent={spent}
            />
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
};

BaseSubBudgetCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  start: PropTypes.string,
  end: PropTypes.string,
  spent: PropTypes.number,
  isLoading: PropTypes.bool,
  available: PropTypes.number,
  pending: PropTypes.number,
  displayName: PropTypes.string,
  isAssignable: PropTypes.bool,
  isBnREnabled: PropTypes.bool,
  isRetired: PropTypes.bool,
  retiredAt: PropTypes.string,
};

BaseSubBudgetCard.defaultProps = {
};

export default BaseSubBudgetCard;
