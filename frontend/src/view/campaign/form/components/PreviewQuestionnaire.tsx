import { i18n } from 'src/i18n';
import Questionnaire from 'src/view/Questionnaire';
import StepContent from 'src/view/shared/components/StepContent';

const PreviewQuestionnaire = ({ visible = false }) => {
  return (
    <StepContent
      title={i18n(
        'entities.campaign.sections.previewQuestionnaire',
      )}
      visible={visible}
    >
      <Questionnaire name="questionnaire" preview />
    </StepContent>
  );
};

export default PreviewQuestionnaire;
