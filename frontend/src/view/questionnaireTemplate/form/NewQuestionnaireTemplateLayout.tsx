import { Grid } from '@mui/material';
import { i18n } from 'src/i18n';
import { selectMuiSettings } from 'src/modules/mui/muiSelectors';
import { useState } from 'react';
import GradientTitle from 'src/view/shared/components/GradientTitle';
import InputFormItem from 'src/view/shared/form/items/InputFormItem';
import MDBox from 'src/mui/components/MDBox';
import MDButton from 'src/mui/components/MDButton';
import Questionnaire from 'src/view/Questionnaire';

function NewQuestionnaireTemplateLayout(props) {
  const { sidenavColor } = selectMuiSettings();
  const { title, initialValues, hiddenImpossibleFields } =
    props;
  const [preview, setPreview] = useState(false);

  return (
    <MDBox px={0.8}>
      <Grid spacing={1.6} container>
        <Grid item xs={12}>
          <GradientTitle>
            {title ??
              i18n(
                'entities.questionnaireTemplate.new.title',
              )}
          </GradientTitle>
        </Grid>
        <Grid item xs={3}>
          <InputFormItem
            name="name"
            label={i18n(
              'entities.questionnaireTemplate.fields.name',
            )}
            variant="standard"
            required
            autoFocus
          />
        </Grid>
        <Grid item xs={9} textAlign="right">
          <MDButton
            variant={preview ? 'outlined' : 'contained'}
            color={sidenavColor}
            onClick={() => setPreview(!preview)}
          >
            {i18n(
              `common.${preview ? 'cancel' : 'preview'}`,
            )}
          </MDButton>
        </Grid>
        <Grid item xs={12}>
          <Questionnaire
            name="questionnaire"
            preview={preview}
          />
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default NewQuestionnaireTemplateLayout;
