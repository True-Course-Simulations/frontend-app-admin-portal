import { useDispatch, useSelector } from 'react-redux';
import CodeAssignmentModal from '../../components/CodeAssignmentModal';

import sendCodeAssignment from '../../data/actions/codeAssignment';
import createPendingEnterpriseUsers from '../../data/actions/createPendingEnterpriseUsers';
import { EMAIL_TEMPLATE_SOURCE_NEW_EMAIL } from '../../data/constants/emailTemplate';
import { setEmailAddress } from '../../data/actions/emailTemplate';

const CodeAssignmentModalContainer = (props) => {
  const dispatch = useDispatch();
  const {
    currentEmail,
    couponDetailsTable,
    initialValues,
    enterpriseSlug,
    enterpriseUuid,
    enableLearnerPortal,
  } = useSelector((state) => {
    let initialValues = state.emailTemplate.emailTemplateSource === EMAIL_TEMPLATE_SOURCE_NEW_EMAIL
      ? state.emailTemplate.default.assign : state.emailTemplate.assign;

    // By default `Automate reminders` are enabled for code assignments
    initialValues = { ...initialValues, 'enable-nudge-emails': true };

    return {
      currentEmail: state.form['code-assignment-modal-form']?.values['email-address'],
      couponDetailsTable: state.table['coupon-details'],
      initialValues,
      enterpriseSlug: state.portalConfiguration.enterpriseSlug,
      enterpriseUuid: state.portalConfiguration.enterpriseId,
      enableLearnerPortal: state.portalConfiguration.enableLearnerPortal,
    };
  });

  const sendCodeAssignmentAction = (couponId, options) => new Promise((resolve, reject) => {
    dispatch(sendCodeAssignment({
      couponId,
      options,
      onSuccess: (response) => { resolve(response); },
      onError: (error) => { reject(error); },
    }));
  });

  const createPendingEnterpriseUsersAction = (users, uuid) => new Promise((resolve, reject) => {
    dispatch(createPendingEnterpriseUsers({
      users,
      uuid,
      onSuccess: (response) => { resolve(response); },
      onError: (error) => { reject(error); },
    }));
  });

  const setEmailAddressAction = (emailAddress, emailType) => dispatch(setEmailAddress(emailAddress, emailType));

  return (
    <CodeAssignmentModal
      {...props}
      currentEmail={currentEmail}
      couponDetailsTable={couponDetailsTable}
      initialValues={initialValues}
      enableReinitialize
      enterpriseSlug={enterpriseSlug}
      enterpriseUuid={enterpriseUuid}
      enableLearnerPortal={enableLearnerPortal}
      sendCodeAssignment={sendCodeAssignmentAction}
      createPendingEnterpriseUsers={createPendingEnterpriseUsersAction}
      setEmailAddress={setEmailAddressAction}
    />
  );
};

export default CodeAssignmentModalContainer;
