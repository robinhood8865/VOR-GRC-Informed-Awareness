import { Card, Grid } from '@mui/material';
import { i18n } from 'src/i18n';
import { selectMuiSettings } from 'src/modules/mui/muiSelectors';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import campaignReviewSelectors from 'src/modules/campaign/review/campaignReviewSelectors';
import MDBox from 'src/mui/components/MDBox';
import MDButton from 'src/mui/components/MDButton';
import MDTypography from 'src/mui/components/MDTypography';
import moment from 'moment';
import ReminderEmailSettingsModal from 'src/view/campaign/form/components/ReminderEmailSettingsModal';
import Spinner from 'src/view/shared/Spinner';
import StepContent from 'src/view/shared/components/StepContent';
import TuneIcon from '@mui/icons-material/Tune';

const ReviewAndSend = ({ visible = false }) => {
  const { sidenavColor } = selectMuiSettings();
  const loading = useSelector(
    campaignReviewSelectors.selectLoading,
  );
  const review = useSelector(
    campaignReviewSelectors.selectRecord,
  );
  const { getValues, setValue, register } =
    useFormContext();
  const {
    useReminderEmailAfterCampaignEnrollment,
    campaignEnrollmentEmailTemplate,
    daysAfterCampaignEnrollment,

    useRepeatReminderEmail,
    repeatReminderEmailTemplate,
    intervalDaysForRepeatReminderEmail,

    useReminderEmailComingDue,
    emailTemplateComingDue,
    daysBeforeComingDue,

    useReminderEmailOverdue,
    emailTemplateOverdue,
    daysAfterOverdue,
  } = getValues() ?? {};
  const [
    showReminderEmailSettingsModal,
    setShowReminderEmailSettingsModal,
  ] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const onSettingUpForReminderEmail = (values) => {
    for (const key of Object.keys(values)) {
      register(key);
      setValue(key, values[key], {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
    setRefresh(!refresh);
  };
  const CardSection = ({ title, description }) => (
    <Grid item md={4} xs={12}>
      <Card sx={{ height: '100%' }}>
        <MDBox p={2.4}>
          <MDTypography
            variant="h2"
            color={sidenavColor}
            textAlign="center"
          >
            {title}
          </MDTypography>
          <MDTypography
            variant="body2"
            fontWeight="bold"
            textAlign="center"
          >
            {description}
          </MDTypography>
        </MDBox>
      </Card>
    </Grid>
  );
  const Description = ({ children }) => (
    <MDTypography
      fontWeight="regular"
      textAlign="center"
      variant="body1"
    >
      {children}
    </MDTypography>
  );
  return (
    <StepContent
      title={i18n(
        'entities.campaign.sections.reviewAndSend',
      )}
      visible={visible}
    >
      {loading && <Spinner />}
      {!loading && review && (
        <>
          <Grid container spacing={2.4}>
            <CardSection
              title={review.totalVendorsOrClients}
              description={i18n(
                'entities.campaign.placeholders.willReceiveThis',
                review.audience,
                review.type,
              )}
            />
            <CardSection
              title={review.noEmailVendorsOrClients}
              description={i18n(
                'entities.campaign.placeholders.withoutEmailAddress',
                review.audience,
                i18n(
                  `entities.campaign.placeholders.emailNames.${review.audience.toLowerCase()}`,
                ),
              )}
            />
            <CardSection
              title={moment(review.dueDate).format(
                'Do MMM YYYY',
              )}
              description={i18n(
                'entities.campaign.fields.dueDate',
                review.audience,
              )}
            />
            <Grid item xs={12}>
              <Description>
                {i18n(
                  'entities.campaign.placeholders.reminderEmails',
                )}
              </Description>
              {useReminderEmailAfterCampaignEnrollment && (
                <Description>
                  {i18n(
                    'entities.campaign.placeholders.firstReminder',
                    daysAfterCampaignEnrollment,
                    campaignEnrollmentEmailTemplate.name ??
                      campaignEnrollmentEmailTemplate.label,
                  )}
                </Description>
              )}
              {useRepeatReminderEmail && (
                <Description>
                  {i18n(
                    'entities.campaign.placeholders.gentleReminder',
                    intervalDaysForRepeatReminderEmail,
                    repeatReminderEmailTemplate.name ??
                      repeatReminderEmailTemplate.label,
                  )}
                </Description>
              )}
              <Description>
                {i18n(
                  'entities.campaign.placeholders.comingDue',
                  review.comingDueDays,
                )}
              </Description>
              {useReminderEmailComingDue && (
                <Description>
                  {i18n(
                    'entities.campaign.placeholders.reminderComingDue',
                    daysBeforeComingDue,
                    emailTemplateComingDue.name ??
                      emailTemplateComingDue.label,
                  )}
                </Description>
              )}
              {useReminderEmailOverdue && (
                <Description>
                  {i18n(
                    'entities.campaign.placeholders.reminderOverdue',
                    daysAfterOverdue,
                    emailTemplateOverdue.name ??
                      emailTemplateOverdue.label,
                  )}
                </Description>
              )}
              <MDBox
                display="flex"
                justifyContent="center"
                mt={1.6}
              >
                <MDButton
                  color={sidenavColor}
                  onClick={() =>
                    setShowReminderEmailSettingsModal(true)
                  }
                  startIcon={<TuneIcon />}
                  variant="contained"
                >
                  {i18n('common.settings')}
                </MDButton>
              </MDBox>
            </Grid>
          </Grid>
          {showReminderEmailSettingsModal && (
            <ReminderEmailSettingsModal
              onClose={() =>
                setShowReminderEmailSettingsModal(false)
              }
              onConfirm={onSettingUpForReminderEmail}
              record={getValues() ?? {}}
              review={review ?? {}}
            />
          )}
        </>
      )}
    </StepContent>
  );
};

export default ReviewAndSend;
