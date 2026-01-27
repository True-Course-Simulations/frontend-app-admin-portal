import { useDispatch, useSelector } from 'react-redux';

import { fetchCsv, clearCsv } from '../../data/actions/csv';
import DownloadCsvButton from '../../components/DownloadCsvButton';

const DownloadCsvButtonContainer = (props) => {
  const dispatch = useDispatch();
  const { enterpriseId, csvLoading } = useSelector((state) => {
    const csvState = state.csv[props.id] || {};
    return {
      enterpriseId: state.portalConfiguration.enterpriseId,
      csvLoading: csvState.csvLoading,
    };
  });

  const fetchCsvAction = (fetchMethod) => {
    dispatch(fetchCsv(props.id, fetchMethod));
  };

  const clearCsvAction = () => {
    dispatch(clearCsv(props.id));
  };

  return (
    <DownloadCsvButton
      {...props}
      enterpriseId={enterpriseId}
      csvLoading={csvLoading}
      fetchCsv={fetchCsvAction}
      clearCsv={clearCsvAction}
    />
  );
};

export default DownloadCsvButtonContainer;
