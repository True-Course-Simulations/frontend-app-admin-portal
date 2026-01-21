import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { sendEnterpriseTrackEvent } from '@edx/frontend-enterprise-utils';
import ContentHighlightCardItem from '../ContentHighlightCardItem';
import { generateAboutPageUrl } from '../data/utils';
import EVENT_NAMES from '../../../eventTracking';

const ContentSearchResultCard = ({ original }) => {
  const enterpriseId = useSelector(state => state.portalConfiguration.enterpriseId);
  const enterpriseSlug = useSelector(state => state.portalConfiguration.enterpriseSlug);
  const {
    aggregationKey,
    title,
    contentType,
    partners,
    cardImageUrl,
    originalImageUrl,
    firstEnrollablePaidSeatPrice,
  } = original;
  const trackClickEvent = () => {
    const trackInfo = {
      aggregation_key: aggregationKey,
    };
    sendEnterpriseTrackEvent(
      enterpriseId,
      `${EVENT_NAMES.CONTENT_HIGHLIGHTS.STEPPER_SELECT_CONTENT_ABOUT_PAGE}`,
      trackInfo,
    );
  };
  return (
    <ContentHighlightCardItem
      title={title}
      hyperlinkAttrs={{
        href: generateAboutPageUrl({
          enterpriseSlug,
          contentType: contentType.toLowerCase(),
          contentKey: aggregationKey.split(':')[1],
        }),
        target: '_blank',
        onClick: trackClickEvent,
      }}
      contentType={contentType}
      partners={partners}
      cardImageUrl={cardImageUrl || originalImageUrl}
      price={firstEnrollablePaidSeatPrice}
    />
  );
};

ContentSearchResultCard.propTypes = {
  original: PropTypes.shape({
    aggregationKey: PropTypes.string,
    title: PropTypes.string,
    contentType: PropTypes.string,
    partners: PropTypes.arrayOf(PropTypes.shape()),
    cardImageUrl: PropTypes.string,
    originalImageUrl: PropTypes.string,
    firstEnrollablePaidSeatPrice: PropTypes.number,
  }).isRequired,
};

export default ContentSearchResultCard;
