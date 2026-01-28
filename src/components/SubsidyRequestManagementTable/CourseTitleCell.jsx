import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  OverlayTrigger,
  Popover,
  Button,
  Hyperlink,
  Skeleton,
} from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform/config';

import { useCourseDetails } from './data/hooks';

const CourseDetailsPopoverContentBase = ({ courseId }) => {
  const enterpriseSlug = useSelector(state => state.portalConfiguration.enterpriseSlug);
  const { ENTERPRISE_LEARNER_PORTAL_URL } = getConfig();
  const [courseDetails, isCourseDetailsLoading] = useCourseDetails(courseId);

  if (isCourseDetailsLoading) {
    return (
      <>
        <Skeleton count={2} />
        <span className="sr-only">Loading course details...</span>
      </>
    );
  }

  return (
    <div>
      {(courseDetails?.shortDescription) && (
        <>
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: courseDetails.shortDescription }}
          />
          <hr />
        </>
      )}
      <div>
        <Hyperlink
          target="_blank"
          destination={`${ENTERPRISE_LEARNER_PORTAL_URL}/${enterpriseSlug}/course/${courseId}`}
        >
          Learn more about this course
        </Hyperlink>
      </div>
    </div>
  );
};

CourseDetailsPopoverContentBase.propTypes = {
  courseId: PropTypes.string.isRequired,
};

const CourseTitleCell = ({ row }) => (
  <OverlayTrigger
    trigger="click"
    placement="top"
    rootClose
    overlay={(
      <Popover id="popover-requests-table-course-details">
        <Popover.Title as="h5">{row.original.courseTitle}</Popover.Title>
        <Popover.Content>
          <CourseDetailsPopoverContentBase courseId={row.original.courseId} />
        </Popover.Content>
      </Popover>
    )}
  >
    <Button
      variant="link"
      className="text-left px-0"
      size="sm"
    >
      {row.original.courseTitle}
    </Button>
  </OverlayTrigger>
);

CourseTitleCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      courseTitle: PropTypes.string,
      courseId: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default CourseTitleCell;
