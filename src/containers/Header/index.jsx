import { useSelector } from 'react-redux';

import Header from '../../components/Header';

const HeaderContainer = (props) => {
  const {
    enterpriseName,
    enterpriseSlug,
    enterpriseLogo,
    hasSidebarToggle,
  } = useSelector((state) => ({
    enterpriseName: state.portalConfiguration.enterpriseName,
    enterpriseSlug: state.portalConfiguration.enterpriseSlug,
    enterpriseLogo: state.portalConfiguration.enterpriseBranding?.logo,
    hasSidebarToggle: state.sidebar.hasSidebarToggle,
  }));

  return (
    <Header
      {...props}
      enterpriseName={enterpriseName}
      enterpriseSlug={enterpriseSlug}
      enterpriseLogo={enterpriseLogo}
      hasSidebarToggle={hasSidebarToggle}
    />
  );
};

export default HeaderContainer;
