import React from 'react';
import PropTypes from 'prop-types';
import { CardGrid } from '@openedx/paragon';
import { useSelector } from 'react-redux';
import { sendEnterpriseTrackEvent } from '@edx/frontend-enterprise-utils';
import ContentHighlightSetCard from './ContentHighlightSetCard';
import { HIGHLIGHTS_CARD_GRID_COLUMN_SIZES } from './data/constants';
import EVENT_NAMES from '../../eventTracking';

const HighlightSetSection = ({
  title: sectionTitle,
  highlightSets,
}) => {
  const enterpriseId = useSelector(state => state.portalConfiguration.enterpriseId);
  if (highlightSets.length === 0) {
    return null;
  }
  const trackClickEvent = ({
    uuid, title, isPublished, highlightedContentUuids,
  }) => {
    const trackInfo = {
      highlight_set_uuid: uuid,
      highlight_set_title: title,
      highlight_set_is_published: isPublished,
      highlight_set_item_count: highlightedContentUuids.length,
    };
    sendEnterpriseTrackEvent(
      enterpriseId,
      `${EVENT_NAMES.CONTENT_HIGHLIGHTS.HIGHLIGHT_DASHBOARD_PUBLISHED_HIGHLIGHT_SET_CARD}`,
      trackInfo,
    );
  };
  return (
    <div data-testid="highlight-set-section">
      <h3 className="mb-3">{sectionTitle}</h3>
      <CardGrid columnSizes={HIGHLIGHTS_CARD_GRID_COLUMN_SIZES}>
        {highlightSets.map(({
          title,
          uuid,
          isPublished,
          highlightedContentUuids,
          cardImageUrl,
          archivedContentCount,
        }) => (
          <ContentHighlightSetCard
            key={uuid}
            title={title}
            highlightSetUUID={uuid}
            isPublished={isPublished}
            itemCount={highlightedContentUuids.length}
            archivedItemCount={archivedContentCount}
            imageCapSrc={cardImageUrl}
            onClick={() => trackClickEvent({
              uuid, title, isPublished, highlightedContentUuids,
            })}
          />
        ))}
      </CardGrid>
    </div>
  );
};

HighlightSetSection.propTypes = {
  title: PropTypes.string.isRequired,
  highlightSets: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    isPublished: PropTypes.bool.isRequired,
    highlightedContentUuids: PropTypes.arrayOf(PropTypes.string).isRequired,
  })).isRequired,
};
export default HighlightSetSection;
