import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Hyperlink, Stack } from '@openedx/paragon';
import { sendEnterpriseTrackEvent } from '@edx/frontend-enterprise-utils';

import { configuration } from '../../config';
import EmailAddressTableCell from './EmailAddressTableCell';
import EVENT_NAMES from '../../eventTracking';

const RequestDetailsTableCell = ({ row }) => {
  const enterpriseId = useSelector(state => state.portalConfiguration.enterpriseId);
  const enterpriseSlug = useSelector(state => state.portalConfiguration.enterpriseSlug);
  const { ENTERPRISE_LEARNER_PORTAL_URL } = configuration;
  const handleOnViewCourseClick = () => sendEnterpriseTrackEvent(
    enterpriseId,
    EVENT_NAMES.LEARNER_CREDIT_MANAGEMENT.BUDGET_DETAILS_REQUEST_DATATABLE_VIEW_COURSE,
    {
      courseKey: row.original.courseId,
      amount: row.original.amount,
      requestStatus: row.original.requestStatus,
      requestUuid: row.original.uuid,
    },
  );

  return (
    <Stack gap={1}>
      <EmailAddressTableCell
        tableId="approved-requests"
        userEmail={row.original.email}
        contentAssignmentUUID={row.original.uuid}
      />
      <div>
        <Hyperlink
          className="x-small"
          destination={`${ENTERPRISE_LEARNER_PORTAL_URL}/${enterpriseSlug}/course/${row.original.courseId}`}
          onClick={handleOnViewCourseClick}
          target="_blank"
          isInline
        >
          {row.original.courseTitle || 'View Course'}
        </Hyperlink>
      </div>
    </Stack>
  );
};

RequestDetailsTableCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      uuid: PropTypes.string,
      email: PropTypes.string,
      courseId: PropTypes.string.isRequired,
      courseTitle: PropTypes.string,
      amount: PropTypes.number,
      requestStatus: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default RequestDetailsTableCell;
