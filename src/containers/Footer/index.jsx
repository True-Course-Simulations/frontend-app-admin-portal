import { useSelector } from 'react-redux';

import Footer from '../../components/Footer';

const FooterContainer = (props) => {
  const { enterpriseName, enterpriseSlug, enterpriseLogo } = useSelector(state => ({
    enterpriseName: state.portalConfiguration.enterpriseName,
    enterpriseSlug: state.portalConfiguration.enterpriseSlug,
    enterpriseLogo: state.portalConfiguration.enterpriseBranding?.logo,
  }));

  return (
    <Footer
      {...props}
      enterpriseName={enterpriseName}
      enterpriseSlug={enterpriseSlug}
      enterpriseLogo={enterpriseLogo}
    />
  );
};

export default FooterContainer;
