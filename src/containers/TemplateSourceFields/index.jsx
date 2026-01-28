import { useDispatch, useSelector } from 'react-redux';

import TemplateSourceFields from '../../components/TemplateSourceFields';

import fetchEmailTemplates, { setEmailTemplateSource, currentFromTemplate, setEmailAddress } from '../../data/actions/emailTemplate';

const TemplateSourceFieldsContainer = (props) => {
  const dispatch = useDispatch();
  const { emailTemplateSource, allEmailTemplates } = useSelector(state => ({
    emailTemplateSource: state.emailTemplate.emailTemplateSource,
    allEmailTemplates: state.emailTemplate.allTemplates,
  }));

  const setEmailTemplateSourceAction = templateSource => dispatch(setEmailTemplateSource(templateSource));
  const setEmailAddressAction = (emailAddress, emailType) => dispatch(setEmailAddress(emailAddress, emailType));
  const currentFromTemplateAction = (type, template) => dispatch(currentFromTemplate(type, template));
  const fetchEmailTemplatesAction = (options) => {
    dispatch(fetchEmailTemplates(options));
  };

  return (
    <TemplateSourceFields
      {...props}
      emailTemplateSource={emailTemplateSource}
      allEmailTemplates={allEmailTemplates}
      setEmailTemplateSource={setEmailTemplateSourceAction}
      setEmailAddress={setEmailAddressAction}
      currentFromTemplate={currentFromTemplateAction}
      fetchEmailTemplates={fetchEmailTemplatesAction}
    />
  );
};

export default TemplateSourceFieldsContainer;
