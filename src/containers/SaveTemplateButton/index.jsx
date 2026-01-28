import { useDispatch, useSelector } from 'react-redux';

import { saveTemplate } from '../../data/actions/emailTemplate';
import SaveTemplateButton from '../../components/SaveTemplateButton';

const SaveTemplateButtonContainer = (props) => {
  const dispatch = useDispatch();
  const { saving, emailTemplateSource, emailTemplates } = useSelector(state => ({
    saving: state.emailTemplate.saving,
    emailTemplateSource: state.emailTemplate.emailTemplateSource,
    emailTemplates: state.emailTemplate,
  }));

  const saveTemplateAction = options => new Promise((resolve, reject) => {
    dispatch(saveTemplate({
      options,
      onSuccess: (response) => { resolve(response); },
      onError: (error) => { reject(error); },
    }));
  });

  return (
    <SaveTemplateButton
      {...props}
      saving={saving}
      emailTemplateSource={emailTemplateSource}
      emailTemplates={emailTemplates}
      saveTemplate={saveTemplateAction}
    />
  );
};

export default SaveTemplateButtonContainer;
