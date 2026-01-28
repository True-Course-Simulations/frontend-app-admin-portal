import { useDispatch, useSelector } from 'react-redux';

import InviteLearnersModal from '../../components/InviteLearnersModal';

import addLicensesForUsers from '../../data/actions/userSubscription';

const InviteLearnersModalContainer = (props) => {
  const dispatch = useDispatch();
  const contactEmail = useSelector(state => state.portalConfiguration.contactEmail);

  const addLicensesForUsersAction = (options, subscriptionUUID) => new Promise((resolve, reject) => {
    dispatch(addLicensesForUsers({
      options,
      subscriptionUUID,
      onSuccess: (response) => { resolve(response); },
      onError: (error) => { reject(error); },
    }));
  });

  return (
    <InviteLearnersModal
      {...props}
      contactEmail={contactEmail}
      addLicensesForUsers={addLicensesForUsersAction}
    />
  );
};

export default InviteLearnersModalContainer;
