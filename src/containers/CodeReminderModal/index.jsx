import { useDispatch, useSelector } from 'react-redux';

import CodeReminderModal from '../../components/CodeReminderModal';

import sendCodeReminder from '../../data/actions/codeReminder';
import { EMAIL_TEMPLATE_SOURCE_NEW_EMAIL } from '../../data/constants/emailTemplate';

const CodeReminderModalContainer = (props) => {
  const dispatch = useDispatch();
  const {
    couponDetailsTable,
    initialValues,
    enterpriseSlug,
    enableLearnerPortal,
  } = useSelector(state => ({
    couponDetailsTable: state.table['coupon-details'],
    initialValues: state.emailTemplate.emailTemplateSource === EMAIL_TEMPLATE_SOURCE_NEW_EMAIL
      ? state.emailTemplate.default.remind : state.emailTemplate.remind,
    enterpriseSlug: state.portalConfiguration.enterpriseSlug,
    enableLearnerPortal: state.portalConfiguration.enableLearnerPortal,
  }));

  const sendCodeReminderAction = (couponId, options) => new Promise((resolve, reject) => {
    dispatch(sendCodeReminder({
      couponId,
      options,
      onSuccess: (response) => { resolve(response); },
      onError: (error) => { reject(error); },
    }));
  });

  return (
    <CodeReminderModal
      {...props}
      couponDetailsTable={couponDetailsTable}
      initialValues={initialValues}
      enableReinitialize
      enterpriseSlug={enterpriseSlug}
      enableLearnerPortal={enableLearnerPortal}
      sendCodeReminder={sendCodeReminderAction}
    />
  );
};

export default CodeReminderModalContainer;
