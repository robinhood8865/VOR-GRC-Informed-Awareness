import {
  Card,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
import { getHistory } from 'src/modules/store';
import { i18n } from 'src/i18n';
import { selectMuiSettings } from 'src/modules/mui/muiSelectors';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import About from 'src/view/campaign/form/components/About';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import campaignEnumerators from 'src/modules/campaign/campaignEnumerators';
import campaignFormActions from 'src/modules/campaign/form/campaignFormActions';
import campaignReviewActions from 'src/modules/campaign/review/campaignReviewActions';
import CloseIcon from '@mui/icons-material/Close';
import CreateQuestionnaire from 'src/view/campaign/form/components/CreateQuestionnaire';
import EmailTemplate from 'src/view/campaign/form/components/EmailTemplate';
import formActions from 'src/modules/form/formActions';
import FormWrapper from 'src/view/shared/styles/FormWrapper';
import GradientTitle from 'src/view/shared/components/GradientTitle';
import MDBox from 'src/mui/components/MDBox';
import MDButton from 'src/mui/components/MDButton';
import moment from 'moment';
import PreviewQuestionnaire from 'src/view/campaign/form/components/PreviewQuestionnaire';
import PromptModal from 'src/view/shared/modals/PromptModal';
import ReviewAndSend from 'src/view/campaign/form/components/ReviewAndSend';
import SaveIcon from '@mui/icons-material/Save';
import SelectClients from 'src/view/campaign/form/components/SelectClients';
import SelectVendors from 'src/view/campaign/form/components/SelectVendors';
import SendIcon from '@mui/icons-material/Send';
import Spinner from 'src/view/shared/Spinner';
import StartCampaign from 'src/view/campaign/form/components/StartCampaign';
import yupFormSchemas from 'src/modules/shared/yup/yupFormSchemas';

const schema = yup.object().shape({
  name: yupFormSchemas.string(
    i18n('entities.campaign.fields.name'),
    {
      required: true,
      min: 1,
      max: 100,
    },
  ),
  description: yupFormSchemas.string(
    i18n('entities.campaign.fields.description'),
    {
      min: 0,
      max: 500,
    },
  ),
  type: yupFormSchemas.enumerator(
    i18n('entities.campaign.fields.type'),
    {
      required: true,
      options: campaignEnumerators.type,
    },
  ),
  audience: yupFormSchemas.enumerator(
    i18n('entities.campaign.fields.audience'),
    {
      required: true,
      options: campaignEnumerators.audience,
    },
  ),
  dueDate: yupFormSchemas.datetime(
    i18n('entities.campaign.fields.dueDate'),
    {
      required: true,
    },
  ),
  progress: yupFormSchemas.integer(
    i18n('entities.campaign.fields.progress'),
    {
      min: 0,
      max: 100,
    },
  ),
  totalRecipients: yupFormSchemas.integer(
    i18n('entities.campaign.fields.totalRecipients'),
    {
      min: 1,
    },
  ),
  questionnaireId: yupFormSchemas.string(
    i18n('entities.campaign.fields.questionnaireId'),
    {},
  ),
  questionnaire: yupFormSchemas.generic(
    i18n('entities.campaign.fields.questionnaire'),
  ),
  vendors: yupFormSchemas.stringArray(
    i18n('entities.campaign.fields.vendors'),
    {},
  ),
  clients: yupFormSchemas.stringArray(
    i18n('entities.campaign.fields.clients'),
    {},
  ),
  emailTemplateId: yupFormSchemas.relationToOne(
    i18n('entities.campaign.fields.emailTemplateId'),
    {},
  ),
  to: yupFormSchemas.stringArray(
    i18n('entities.campaign.fields.to'),
    {},
  ),
  cc: yupFormSchemas.stringArray(
    i18n('entities.campaign.fields.cc'),
    {},
  ),
  bcc: yupFormSchemas.stringArray(
    i18n('entities.campaign.fields.bcc'),
    {},
  ),
  fromEmailAddress: yupFormSchemas.email(
    i18n('entities.campaign.fields.fromEmailAddress'),
    {
      min: 1,
      max: 100,
    },
  ),
  subject: yupFormSchemas.string(
    i18n('entities.campaign.fields.subject'),
    {
      min: 1,
      max: 200,
    },
  ),
  body: yupFormSchemas.string(
    i18n('entities.campaign.fields.body'),
    {
      min: 1,
      max: 5000,
    },
  ),
  attachments: yupFormSchemas.files(
    i18n('entities.campaign.fields.attachments'),
    {},
  ),

  useReminderEmailAfterCampaignEnrollment:
    yupFormSchemas.boolean(
      i18n(
        'entities.campaign.fields.useReminderEmailAfterCampaignEnrollment',
      ),
    ),
  campaignEnrollmentEmailTemplate:
    yupFormSchemas.relationToOne(
      i18n(
        'entities.campaign.fields.campaignEnrollmentEmailTemplate',
      ),
    ),
  daysAfterCampaignEnrollment: yupFormSchemas.integer(
    i18n(
      'entities.campaign.fields.daysAfterCampaignEnrollment',
    ),
  ),

  useRepeatReminderEmail: yupFormSchemas.boolean(
    i18n('entities.campaign.fields.useRepeatReminderEmail'),
  ),
  repeatReminderEmailTemplate: yupFormSchemas.relationToOne(
    i18n(
      'entities.campaign.fields.repeatReminderEmailTemplate',
    ),
  ),
  intervalDaysForRepeatReminderEmail:
    yupFormSchemas.integer(
      i18n(
        'entities.campaign.fields.intervalDaysForRepeatReminderEmail',
      ),
    ),

  useReminderEmailComingDue: yupFormSchemas.boolean(
    i18n(
      'entities.campaign.fields.useReminderEmailComingDue',
    ),
  ),
  emailTemplateComingDue: yupFormSchemas.relationToOne(
    i18n('entities.campaign.fields.emailTemplateComingDue'),
  ),
  daysBeforeComingDue: yupFormSchemas.integer(
    i18n('entities.campaign.fields.daysBeforeComingDue'),
  ),

  useReminderEmailOverdue: yupFormSchemas.boolean(
    i18n(
      'entities.campaign.fields.useReminderEmailOverdue',
    ),
  ),
  emailTemplateOverdue: yupFormSchemas.relationToOne(
    i18n('entities.campaign.fields.emailTemplateOverdue'),
  ),
  daysAfterOverdue: yupFormSchemas.integer(
    i18n('entities.campaign.fields.daysAfterOverdue'),
  ),
});

function CampaignForm(props) {
  const dispatch = useDispatch();

  const {
    initLoading,
    isEditing,
    modal,
    onCancel,
    onSubmit: doSubmit,
    record,
    saveLoading,
    sendLoading,
  } = props;

  const { sidenavColor } = selectMuiSettings();

  const [initialValues] = useState(() => {
    return {
      type: record.type,
      audience: record.audience,
      name: record.name,
      dueDate: record.dueDate
        ? moment(record.dueDate)
        : null,
      description: record.description,
      questionnaireId: record.questionnaireId,
      existingQuestionnaire: !!record.questionnaireId,
      questionnaire: record.questionnaire || {},
      progress: record.progress,
      totalRecipients: record.totalRecipients,
      vendors: record.vendors || [],
      clients: record.clients || [],
      emailTemplateId: record.emailTemplateId,
      tmpEmailTemplateId: record.emailTemplateId,
      emailTemplate: record.emailTemplate || {},
      to: record.emailTemplate?.to,
      cc: record.emailTemplate?.cc,
      bcc: record.emailTemplate?.bcc,
      fromEmailAddress:
        record.emailTemplate?.fromEmailAddress,
      subject: record.emailTemplate?.subject,
      body: record.emailTemplate?.body,
      attachments: record.emailTemplate?.attachments || [],

      /**
       * Configuration of Reminder Email
       */

      useReminderEmailAfterCampaignEnrollment:
        record.useReminderEmailAfterCampaignEnrollment,
      campaignEnrollmentEmailTemplate:
        record.campaignEnrollmentEmailTemplate,
      daysAfterCampaignEnrollment:
        record.daysAfterCampaignEnrollment,

      useRepeatReminderEmail: record.useRepeatReminderEmail,
      repeatReminderEmailTemplate:
        record.repeatReminderEmailTemplate,
      intervalDaysForRepeatReminderEmail:
        record.intervalDaysForRepeatReminderEmail,

      useReminderEmailComingDue:
        record.useReminderEmailComingDue,
      emailTemplateComingDue: record.emailTemplateComingDue,
      daysBeforeComingDue: record.daysBeforeComingDue,

      useReminderEmailOverdue:
        record.useReminderEmailOverdue,
      emailTemplateOverdue: record.emailTemplateOverdue,
      daysAfterOverdue: record.daysAfterOverdue,
    };
  });

  const form = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: initialValues as any,
  });

  const isQuestionnaire =
    form.getValues('type') === 'Questionnaire';
  const isVendors =
    form.getValues('audience') === 'Vendors';

  const getSteps = (): {
    label: string;
    content: any;
  }[] => {
    return [
      {
        label: i18n('entities.campaign.sections.about'),
        content: About,
      },
      isQuestionnaire && {
        label: i18n(
          'entities.campaign.sections.createQuestionnaire',
        ),
        content: CreateQuestionnaire,
      },
      isQuestionnaire && {
        label: i18n(
          'entities.campaign.sections.previewQuestionnaire',
        ),
        content: PreviewQuestionnaire,
      },
      isVendors
        ? {
            label: i18n(
              'entities.campaign.sections.selectVendors',
            ),
            content: SelectVendors,
          }
        : {
            label: i18n(
              'entities.campaign.sections.selectClients',
            ),
            content: SelectClients,
          },
      {
        label: i18n(
          'entities.campaign.sections.emailTemplate',
        ),
        content: EmailTemplate,
      },
      {
        label: i18n(
          'entities.campaign.sections.reviewAndSend',
        ),
        content: ReviewAndSend,
      },
    ].filter(Boolean);
  };

  const steps = getSteps();
  const [activeStep, setActiveStep] = useState(0);
  const isLastStep = activeStep === steps.length - 1;

  const [id, setId] = useState(record?.id);
  const defaultFuncSuccess = (record) => {
    setId(record?.id);
  };

  const onSave = (
    values,
    doReturnToList = true,
    fnSuccess = null,
  ) => {
    doSubmit &&
      doSubmit(
        id,
        values,
        doReturnToList,
        fnSuccess ?? defaultFuncSuccess,
      );
  };

  const [emailTemplateName, setEmailTemplateNamePrompt] =
    useState(null);

  const onReview = (result) => {
    defaultFuncSuccess(result);
    dispatch(campaignReviewActions.doFind(result?.id));
  };

  const onConfirmEmailTemplateName = (value) => {
    onSave(
      {
        ...emailTemplateName,
        emailTemplateName: value,
        doServerValidation: true,
      },
      false,
      (result) => {
        form.register('emailTemplateId');
        form.setValue(
          'emailTemplateId',
          result?.emailTemplateId,
          {
            shouldValidate: false,
            shouldDirty: true,
          },
        );
        form.register('tmpEmailTemplateId');
        form.setValue(
          'tmpEmailTemplateId',
          result?.emailTemplateId,
          {
            shouldValidate: false,
            shouldDirty: true,
          },
        );
        dispatch(formActions.doRefresh());
        onReview(result);
        setActiveStep(activeStep + 1);
      },
    );
    setEmailTemplateNamePrompt(null);
  };

  const onSubmit = (values) => {
    if (isLastStep) {
      dispatch(campaignFormActions.doSend(id));
      return;
    } else if (activeStep === steps.length - 2) {
      if (!values.emailTemplateId) {
        setEmailTemplateNamePrompt(values);
        return;
      }
      onSave(values, false, onReview);
    }
    setActiveStep(activeStep + 1);
  };

  const onClickBack = () => setActiveStep(activeStep - 1);

  const onSelectCampaign = (values, doStart = true) => {
    for (const key of Object.keys(values ?? {})) {
      form.register(key);
      form.setValue(key, values[key], {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
    setDoStarted(doStart);
  };

  useEffect(() => {
    onSelectCampaign(initialValues, isEditing);
  }, [isEditing, record]);

  const isStartup =
    !initialValues.type || !initialValues.audience;
  const [doStarted, setDoStarted] = useState(false);
  const doShowSteps = !isStartup || doStarted;

  useEffect(() => {
    dispatch(campaignReviewActions.doReset());
  }, [dispatch]);

  return (
    <>
      <FormWrapper>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            autoComplete="off"
            noValidate
          >
            <Card sx={{ height: '100%' }}>
              <MDBox position="relative">
                <GradientTitle>
                  {!isStartup || doStarted ? (
                    <Stepper
                      activeStep={activeStep}
                      alternativeLabel
                    >
                      {steps.map(({ label }, idx) => (
                        <Step key={`step-${idx}`}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  ) : (
                    i18n('entities.campaign.sections.start')
                  )}
                </GradientTitle>
              </MDBox>
              <MDBox p={2.4}>
                {doShowSteps ? (
                  <>
                    {steps.map(
                      (
                        { content: StepContentComponent },
                        idx,
                      ) => (
                        <StepContentComponent
                          key={`step-content-${idx}`}
                          visible={activeStep === idx}
                        />
                      ),
                    )}
                    <MDBox
                      mt={1.6}
                      width="100%"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <MDBox
                        display="inline-flex"
                        flexWrap="wrap"
                        gap={0.8}
                      >
                        {activeStep > 0 && (
                          <MDButton
                            variant="outlined"
                            color={sidenavColor}
                            onClick={onClickBack}
                            startIcon={<ArrowBackIcon />}
                          >
                            {i18n('common.back')}
                          </MDButton>
                        )}
                        <MDButton
                          type="button"
                          variant="outlined"
                          color={sidenavColor}
                          onClick={() =>
                            getHistory().push('/campaign')
                          }
                          startIcon={<CloseIcon />}
                        >
                          {i18n('common.cancel')}
                        </MDButton>
                      </MDBox>
                      <MDBox
                        display="inline-flex"
                        flexWrap="wrap"
                        gap={0.8}
                      >
                        <MDButton
                          type="button"
                          variant="gradient"
                          color={sidenavColor}
                          startIcon={<SaveIcon />}
                          onClick={form.handleSubmit(
                            (values) => onSave(values),
                          )}
                        >
                          {i18n(`common.save`)}
                        </MDButton>
                        <MDButton
                          type="button"
                          variant="gradient"
                          color={sidenavColor}
                          endIcon={
                            isLastStep ? (
                              <SendIcon />
                            ) : (
                              <ArrowForwardIcon />
                            )
                          }
                          onClick={form.handleSubmit(
                            onSubmit,
                          )}
                        >
                          {i18n(
                            `common.${
                              isLastStep ? 'send' : 'next'
                            }`,
                          )}
                        </MDButton>
                      </MDBox>
                    </MDBox>
                  </>
                ) : (
                  <StartCampaign
                    onSelect={onSelectCampaign}
                  />
                )}
                {(saveLoading || sendLoading) && (
                  <MDBox
                    display="flex"
                    position="absolute"
                    left="0"
                    top="0"
                    right="0"
                    bottom="0"
                  >
                    <Spinner />
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </form>
        </FormProvider>
      </FormWrapper>
      {emailTemplateName && (
        <PromptModal
          title={i18n(
            'entities.campaign.placeholders.emailTemplateName',
          )}
          onConfirm={onConfirmEmailTemplateName}
          onClose={() => setEmailTemplateNamePrompt(null)}
          okText={i18n('common.ok')}
          cancelText={i18n('common.cancel')}
        />
      )}
    </>
  );
}

export default CampaignForm;
