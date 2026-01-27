import CodeRevokeModal from '../../components/CodeRevokeModal';

import sendCodeRevoke from '../../data/actions/codeRevoke';
import { EMAIL_TEMPLATE_SOURCE_NEW_EMAIL } from '../../data/constants/emailTemplate';
import { useDispatch, useSelector } from 'react-redux';

const CodeRevokeModalContainer = (props) => {
  const dispatch = useDispatch();
  const {
    initialValues,
    enterpriseSlug,
    enableLearnerPortal,
  } = useSelector((state) => {
    const initialValues = state.emailTemplate.emailTemplateSource === EMAIL_TEMPLATE_SOURCE_NEW_EMAIL
      ? state.emailTemplate.default.revoke : state.emailTemplate.revoke;

    return {
      initialValues,
      enterpriseSlug: state.portalConfiguration.enterpriseSlug,
      enableLearnerPortal: state.portalConfiguration.enableLearnerPortal,
    };
  });

  const sendCodeRevokeAction = (couponId, options) => new Promise((resolve, reject) => {
    dispatch(sendCodeRevoke({
      couponId,
      options,
      onSuccess: (response) => { resolve(response); },
      onError: (error) => { reject(error); },
    }));
  });

  return (
    <CodeRevokeModal
      {...props}
      initialValues={initialValues}
      enableReinitialize
      enterpriseSlug={enterpriseSlug}
      enableLearnerPortal={enableLearnerPortal}
      sendCodeRevoke={sendCodeRevokeAction}
    />
  );
};

export default CodeRevokeModalContainer;
