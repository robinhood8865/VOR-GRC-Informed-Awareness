import { i18n } from 'src/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import actions from 'src/modules/questionnaireTemplate/list/questionnaireTemplateListActions';
import BorderedCardButton from 'src/view/shared/components/BorderedCardButton';
import Grid2 from '@mui/material/Unstable_Grid2';
import MDTypography from 'src/mui/components/MDTypography';
import Pagination from 'src/view/shared/table/Pagination';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Questionnaire from 'src/view/Questionnaire';
import selectors from 'src/modules/questionnaireTemplate/list/questionnaireTemplateListSelectors';
import StepContent from 'src/view/shared/components/StepContent';

const CreateQuestionnaire = ({ visible = false }) => {
  const dispatch = useDispatch();
  const { getValues, setValue, register } =
    useFormContext();
  const isExistingQuestionnaire = getValues(
    'existingQuestionnaire',
  );
  const questionnaireId = getValues('questionnaireId');
  const loading = useSelector(selectors.selectLoading);
  const rows = useSelector(selectors.selectRows);
  const pagination = useSelector(
    selectors.selectPagination,
  );
  const hasRows = useSelector(selectors.selectHasRows);
  const doChangePagination = (pagination) => {
    dispatch(actions.doChangePagination(pagination));
  };
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    if (!Boolean(questionnaireId)) {
      dispatch(actions.doFetch({ export: 1 }, {}, false));
    }
  }, [dispatch, questionnaireId]);
  return (
    <StepContent
      title={i18n(
        questionnaireId
          ? 'entities.campaign.sections.createQuestionnaire'
          : 'entities.campaign.placeholders.selectExistingQuestionnaireTemplate',
      )}
      visible={visible}
    >
      {isExistingQuestionnaire &&
      !Boolean(questionnaireId) ? (
        <>
          <Grid2 container spacing={1.6} columns={5}>
            {!loading && !hasRows && (
              <Grid2 xs={5}>
                <MDTypography
                  variant="body2"
                  fontWeight="regular"
                  align="center"
                >
                  {i18n('table.noData')}
                </MDTypography>
              </Grid2>
            )}
            {!loading &&
              rows.map((row) => (
                <Grid2 key={row.id} xs={1}>
                  <BorderedCardButton
                    onClick={() => {
                      register('questionnaire');
                      setValue(
                        'questionnaire',
                        row.questionnaire,
                        {
                          shouldValidate: false,
                          shouldDirty: true,
                        },
                      );
                      register('questionnaireId');
                      setValue('questionnaireId', row.id, {
                        shouldValidate: false,
                        shouldDirty: true,
                      });
                      setRefresh(!refresh);
                    }}
                    content={
                      <QuestionAnswerIcon fontSize="large" />
                    }
                    title={
                      <>
                        {row.name}
                        <br />
                        {i18n(
                          'entities.questionnaireTemplate.labels.questions',
                          row.totalQuestions,
                        )}
                      </>
                    }
                    innerTitle
                  />
                </Grid2>
              ))}
          </Grid2>
          <Pagination
            onChange={doChangePagination}
            disabled={loading}
            pagination={pagination}
            entriesPerPage
            showTotalEntries
          />
        </>
      ) : (
        <Questionnaire name="questionnaire" />
      )}
    </StepContent>
  );
};

export default CreateQuestionnaire;
