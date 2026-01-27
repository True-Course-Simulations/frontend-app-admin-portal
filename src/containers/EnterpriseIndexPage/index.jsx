import { useDispatch } from 'react-redux';
import EnterpriseList from '../../components/EnterpriseList';
import { clearPortalConfiguration } from '../../data/actions/portalConfiguration';

const EnterpriseIndexPage = (props) => {
  const dispatch = useDispatch();

  const clearPortalConfigurationAction = () => {
    dispatch(clearPortalConfiguration());
  };

  return (
    <EnterpriseList
      {...props}
      clearPortalConfiguration={clearPortalConfigurationAction}
    />
  );
};

export default EnterpriseIndexPage;
