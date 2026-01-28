import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Color from 'color';
import { SCHOLAR_THEME } from '../settings/data/constants';

import { configuration } from '../../config';

const Hero = ({ title }) => {
  const enterpriseBranding = useSelector(state => state.portalConfiguration.enterpriseBranding);
  const edxWhiteSemiTransparentLogo = configuration.LOGO_WHITE_URL;
  const edxLogoDark = configuration.LOGO_URL;

  const secondaryColor = enterpriseBranding?.secondary_color || SCHOLAR_THEME.banner;
  const color = useMemo(() => Color(secondaryColor), [secondaryColor]);
  const logo = color.isDark() ? edxWhiteSemiTransparentLogo : edxLogoDark;

  return (
    <div className="hero hero-brand">
      <div>
        <h1>{title}</h1>
      </div>
      <div>
        <img src={logo} alt="edX logo" />
      </div>
    </div>
  );
};

Hero.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Hero;
