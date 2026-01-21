import React from 'react';
import { Button } from '@openedx/paragon';
import PropTypes from 'prop-types';
import { sendEnterpriseTrackEvent } from '@edx/frontend-enterprise-utils';
import { useSelector } from 'react-redux';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import EVENT_NAMES from '../../eventTracking';
import { applyFiltersToOptions, applySortByToOptions } from './data/hooks/useBudgetContentAssignments';

const AssignmentsTableRefreshAction = ({ tableInstance, refresh }) => {
  const enterpriseId = useSelector(state => state.portalConfiguration.enterpriseId);
  const handleRefresh = () => {
    const { state: dataTableState } = tableInstance;
    refresh(dataTableState);

    // Construct track event data with a identical syntax to useBudgetContentAssignments
    const options = {
      page: dataTableState.pageIndex + 1, // `DataTable` uses zero-indexed array
      pageSize: dataTableState.pageSize,
    };
    applyFiltersToOptions(dataTableState.filters, options);
    applySortByToOptions(dataTableState.sortBy, options);
    const trackEventMetadata = {
      filters: {
        learnerState: options.learnerState || null,
        search: options.search || null,
      },
      ordering: options.ordering || null,
      page: options.page || null,
      pageSize: options.pageSize || null,
    };
    sendEnterpriseTrackEvent(
      enterpriseId,
      EVENT_NAMES.LEARNER_CREDIT_MANAGEMENT.BUDGET_DETAILS_ASSIGNED_DATATABLE_ACTIONS_REFRESH,
      trackEventMetadata,
    );
  };

  return (
    <Button
      variant="outline-primary"
      onClick={handleRefresh}
    >
      <FormattedMessage
        id="lcm.budget.detail.page.catalog.tab.course.card.refresh"
        defaultMessage="Refresh"
        description="Button text to refresh the assignment table"
      />
    </Button>
  );
};

AssignmentsTableRefreshAction.propTypes = {
  refresh: PropTypes.func.isRequired,
  tableInstance: PropTypes.shape({
    state: PropTypes.shape(),
  }),
};

export default AssignmentsTableRefreshAction;
