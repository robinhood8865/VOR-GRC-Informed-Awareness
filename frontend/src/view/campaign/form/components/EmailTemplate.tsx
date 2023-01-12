import { i18n } from 'src/i18n';
import { selectMuiSettings } from 'src/modules/mui/muiSelectors';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import campaignEnumerators from 'src/modules/campaign/campaignEnumerators';
import Card from '@mui/material/Card';
import ColorBadge from 'src/view/shared/components/ColorBadge';
import ColorBadgeSelectFormItem, {
  generateColorBadgeSelectOptions,
} from 'src/view/shared/form/items/ColorBadgeSelectFormItem';
import EmailTemplateAutocompleteFormItem from 'src/view/emailTemplate/autocomplete/EmailTemplateAutocompleteFormItem';
import emailTemplateViewActions from 'src/modules/emailTemplate/view/emailTemplateViewActions';
import emailTemplateViewSelectors from 'src/modules/emailTemplate/view/emailTemplateViewSelectors';
import FieldSetViewItem from 'src/view/shared/view/FieldSetViewItem';
import FilesFormItem from 'src/view/shared/form/items/FilesFormItem';
import formActions from 'src/modules/form/formActions';
import Grid from '@mui/material/Grid';
import HtmlEditorFormItem from 'src/view/shared/form/items/HtmlEditorFormItem';
import HtmlViewItem from 'src/view/shared/view/HtmlViewItem';
import InputFormItem from 'src/view/shared/form/items/InputFormItem';
import MDBox from 'src/mui/components/MDBox';
import MDButton from 'src/mui/components/MDButton';
import MDTypography from 'src/mui/components/MDTypography';
import Spinner from 'src/view/shared/Spinner';
import StepContent from 'src/view/shared/components/StepContent';
import Storage from 'src/security/storage';
import emailTemplateEnumerators from 'src/modules/emailTemplate/emailTemplateEnumerators';
import { Tooltip } from '@mui/material';

const EmailTemplate = ({ visible = false }) => {
  const { sidenavColor } = selectMuiSettings();
  const dispatch = useDispatch();
  const { getValues, setValue, register } =
    useFormContext();
  const audience = getValues('audience');
  const isVendors = audience === 'Vendors';
  const emails = isVendors
    ? campaignEnumerators.emailVendor
    : campaignEnumerators.emailClient;
  const colors = isVendors
    ? campaignEnumerators.emailVendorColor
    : campaignEnumerators.emailClientColor;
  const [preview, setPreview] = useState(false);
  const loading = useSelector(
    emailTemplateViewSelectors.selectLoading,
  );
  const formEmailTemplateId = getValues('emailTemplateId');
  const formBody = getValues('body');
  const [body, setBody] = useState(formBody);
  const [emailTemplateId, setEmailTemplateId] = useState(
    formEmailTemplateId,
  );
  const onSelectEmailTemplate = () => {
    dispatch(
      emailTemplateViewActions.doFind(
        emailTemplateId.id,
        (result) => {
          ['fromEmailAddress', 'subject', 'body'].forEach(
            (key) =>
              setValue(key, result[key], {
                shouldValidate: false,
                shouldDirty: true,
              }),
          );
          register('emailTemplateId');
          setValue('emailTemplateId', emailTemplateId, {
            shouldValidate: false,
            shouldDirty: true,
          });
          dispatch(formActions.doRefresh());
          setBody(result.body);
        },
      ),
    );
  };
  useEffect(() => setBody(formBody), [formBody]);
  return (
    <StepContent
      title={i18n(
        'entities.campaign.sections.emailTemplate',
      )}
      visible={visible}
    >
      <Grid container spacing={1.6}>
        <Grid item md={3} xs={12}>
          <FieldSetViewItem>
            <MDTypography variant="body1" fontWeight="bold">
              {i18n('common.keywords')}
            </MDTypography>
            <MDBox
              alignItems="start"
              display="flex"
              flexDirection="column"
              gap={1.6}
              mt={1.6}
            >
              {emails.map((email, index) => (
                <ColorBadge
                  key={`keywords-${index}`}
                  color={colors[index]}
                  label={i18n(
                    `entities.campaign.enumerators.email.${email}`,
                  )}
                />
              ))}
            </MDBox>
            <MDTypography
              variant="body1"
              fontWeight="bold"
              mt={2.4}
            >
              {i18n('common.codes')}
            </MDTypography>
            <MDBox
              alignItems="start"
              display="flex"
              flexDirection="column"
              gap={1.6}
              mt={1.6}
              lineHeight={0}
            >
              {emailTemplateEnumerators.codes.map(
                (code, index) => (
                  <Tooltip
                    key={`short-code-${index}`}
                    title={i18n(
                      `entities.emailTemplate.hints.codes.${code}`,
                    )}
                    disableInteractive
                  >
                    <span>
                      <ColorBadge
                        label={i18n(
                          `entities.emailTemplate.enumerators.codes.${code}`,
                        )}
                      />
                    </span>
                  </Tooltip>
                ),
              )}
            </MDBox>
          </FieldSetViewItem>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card>
            <MDBox p={2.4} position="relative">
              <Grid container spacing={1.6}>
                <Grid item xs={12}>
                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    gap={1.6}
                  >
                    <MDBox flexGrow={1}>
                      <EmailTemplateAutocompleteFormItem
                        name="tmpEmailTemplateId"
                        label={i18n(
                          'entities.campaign.fields.selectEmailTemplate',
                        )}
                        onChange={setEmailTemplateId}
                        variant="standard"
                        showCreate
                        // required
                      />
                    </MDBox>
                    <MDButton
                      variant="contained"
                      color={sidenavColor}
                      onClick={() =>
                        onSelectEmailTemplate()
                      }
                    >
                      {i18n(
                        'entities.campaign.labels.selectTemplate',
                      )}
                    </MDButton>
                    <MDButton
                      variant={
                        preview ? 'outlined' : 'contained'
                      }
                      color={sidenavColor}
                      onClick={() => setPreview(!preview)}
                    >
                      {i18n(
                        `common.${
                          preview ? 'cancel' : 'preview'
                        }`,
                      )}
                    </MDButton>
                  </MDBox>
                </Grid>
                {preview ? (
                  !loading && (
                    <Grid item xs={12}>
                      <HtmlViewItem
                        value={body}
                        hiddenLabel
                      />
                    </Grid>
                  )
                ) : (
                  <>
                    <Grid item xs={12}>
                      <ColorBadgeSelectFormItem
                        name="to"
                        label={i18n(
                          'entities.campaign.fields.to',
                        )}
                        options={generateColorBadgeSelectOptions(
                          emails,
                          colors,
                          'entities.campaign.enumerators.email',
                        )}
                        variant="standard"
                        mode="multiple"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <ColorBadgeSelectFormItem
                        name="cc"
                        label={i18n(
                          'entities.campaign.fields.cc',
                        )}
                        options={generateColorBadgeSelectOptions(
                          emails,
                          colors,
                          'entities.campaign.enumerators.email',
                        )}
                        variant="standard"
                        mode="multiple"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <ColorBadgeSelectFormItem
                        name="bcc"
                        label={i18n(
                          'entities.campaign.fields.bcc',
                        )}
                        options={generateColorBadgeSelectOptions(
                          emails,
                          colors,
                          'entities.campaign.enumerators.email',
                        )}
                        variant="standard"
                        mode="multiple"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputFormItem
                        name="fromEmailAddress"
                        label={i18n(
                          'entities.campaign.fields.fromEmailAddress',
                        )}
                        variant="standard"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputFormItem
                        name="subject"
                        label={i18n(
                          'entities.campaign.fields.subject',
                        )}
                        variant="standard"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <HtmlEditorFormItem
                        name="body"
                        label={i18n(
                          'entities.campaign.fields.body',
                        )}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FilesFormItem
                        name="attachments"
                        label={i18n(
                          'entities.campaign.fields.attachments',
                        )}
                        storage={
                          Storage.values
                            .campaignEmailAttachment
                        }
                        max={undefined}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
              {loading && (
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
        </Grid>
      </Grid>
    </StepContent>
  );
};

export default EmailTemplate;
