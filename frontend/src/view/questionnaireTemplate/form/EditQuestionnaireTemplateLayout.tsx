import { Card, Grid } from '@mui/material';
import { i18n } from 'src/i18n';
import { selectMuiSettings } from 'src/modules/mui/muiSelectors';
import { useState } from 'react';
import InputFormItem from 'src/view/shared/form/items/InputFormItem';
import MDBox from 'src/mui/components/MDBox';
import MDButton from 'src/mui/components/MDButton';
import Questionnaire from 'src/view/Questionnaire';

function EditQuestionnaireTemplateLayout(props) {
  const { sidenavColor } = selectMuiSettings();
  const { initialValues } = props;
  const [preview, setPreview] = useState(false);

  return (
    <Card>
      <MDBox p={2.4}>
        <Grid spacing={1.6} container>
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
          <Grid
            item
            xs={9}
            justifyContent="end"
            gap={0.8}
            display="flex"
            alignItems="end"
          >
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
    </Card>
  );
}

export default EditQuestionnaireTemplateLayout;
