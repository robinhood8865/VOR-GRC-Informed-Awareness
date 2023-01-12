import {
  EntityActionButtons,
  safeValue,
  toArray,
} from 'src/view/Questionnaire/common';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { i18n } from 'src/i18n';
import {
  INPUT_TYPE,
  questionnaireEnumerator,
} from 'src/view/Questionnaire/enumerators';
import { useEffect, useRef, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CheckboxFormItem from 'src/view/shared/form/items/CheckboxFormItem';
import FilesFormItem from 'src/view/shared/form/items/FilesFormItem';
import InputAdornment from '@mui/material/InputAdornment';
import InputFormItem from 'src/view/shared/form/items/InputFormItem';
import MDBox from 'src/mui/components/MDBox';
import MDButton from 'src/mui/components/MDButton';
import MDTypography from 'src/mui/components/MDTypography';
import Message from 'src/view/shared/message';
import OptionsModal from 'src/view/Questionnaire/components/OptionsModal';
import Questions from 'src/view/Questionnaire/components/Questions';
import SelectFormItem from 'src/view/shared/form/items/SelectFormItem';
import Storage from 'src/security/storage';
import FilesViewItem from 'src/view/shared/view/FilesViewItem';
import TextViewItem from 'src/view/shared/view/TextViewItem';

function QuestionItem(props) {
  const {
    color,
    darkMode,
    doChangeQuestion,
    doDeleteQuestion,
    doMoveDown,
    doMoveUp,
    doSaveQuestion,
    doSelect,
    entity,
    firstItem,
    index,
    lastItem,
    prefix,
    preview,
    readOnly,
    value,
  } = props;

  if (!entity) {
    return null;
  }

  const childRef = useRef(null);

  const [inputValue, setInputValue] = useState(null);
  const [answer, setAnswer] = useState(value.answer);
  const [additionalInformation, setAdditionalInformation] =
    useState(value.additionalInformation);
  const [visibleOptionsModal, setVisibleOptionsModal] =
    useState(false);

  useEffect(() => {
    setInputValue(value.title);
    setAdditionalInformation(value.additionalInformation);
  }, [value.key]);

  const doEdit = () => {
    doSaveQuestion &&
      doSaveQuestion(
        {
          isEditing: true,
        },
        index,
      );
  };

  const doDelete = () => {
    doDeleteQuestion && doDeleteQuestion(index);
  };

  const doSave = () => {
    if (!inputValue || inputValue.trim() === '') {
      Message.error(
        i18n(
          'entities.questionnaireTemplate.update.question.required',
        ),
      );
      return;
    }
    doSaveQuestion &&
      doSaveQuestion(
        {
          title: inputValue,
          isEditing: false,
        },
        index,
      );
  };

  const doSaveTitleOnly = () => {
    doSaveQuestion &&
      doSaveQuestion(
        {
          title: inputValue,
        },
        index,
      );
  };

  const doSaveProps = (props) => {
    doSaveQuestion && doSaveQuestion(props, index);
  };

  const doCancel = () => {
    doSaveQuestion &&
      doSaveQuestion(
        {
          isEditing: false,
        },
        index,
      );
  };

  const doCloseOptionsModal = () =>
    setVisibleOptionsModal(false);
  const doConfirmOptionsModal = (options) => {
    doSaveProps({ options: options });
    doCloseOptionsModal();
  };

  const renderQuestionItemBuilder = () => (
    <Grid container spacing={1.6}>
      <Grid item xs={6}>
        <SelectFormItem
          name={`${value.key}-type`}
          label={i18n(
            'entities.questionnaireTemplate.fields.type',
          )}
          options={questionnaireEnumerator.types.map(
            (value) => ({
              value,
              label: i18n(
                `entities.questionnaire.enumerators.types.${value}`,
              ),
            }),
          )}
          value={value.type}
          onChange={(value) =>
            doSaveProps({
              type: value,
              rightAnswer: [],
            })
          }
          required={true}
          variant="standard"
          forceValue
        />
        {!questionnaireEnumerator.noRightAnswerTypes.includes(
          value.type,
        ) && (
          <MDBox mt={1.6}>
            {questionnaireEnumerator.typeDefines[
              value.type
            ]?.render({
              ...value,
              title: i18n(
                'entities.questionnaireTemplate.fields.rightAnswer',
              ),
              answer: safeValue(value, 'rightAnswer'),
              onChange: (value) =>
                doSaveProps({
                  rightAnswer: toArray(value),
                }),
            })}
            {value.type === INPUT_TYPE.SELECT && (
              <>
                <Grid container mt={0.8}>
                  <Grid item xs={6}>
                    <CheckboxFormItem
                      name={`${value.key}-multi-select`}
                      label={i18n(
                        'entities.questionnaireTemplate.fields.multiSelect',
                      )}
                      value={value.multiSelect}
                      onChange={(value) =>
                        doSaveProps({
                          multiSelect: value,
                        })
                      }
                      forceValue
                    />
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <MDButton
                      variant="contained"
                      color={color}
                      onClick={() =>
                        setVisibleOptionsModal(true)
                      }
                    >
                      {i18n(
                        'entities.questionnaireTemplate.labels.editOptions',
                      )}
                    </MDButton>
                  </Grid>
                </Grid>
                {visibleOptionsModal && (
                  <OptionsModal
                    title={i18n(
                      'entities.questionnaireTemplate.labels.options',
                    )}
                    cancelText={i18n('common.cancel')}
                    okText={i18n('common.save')}
                    onClose={() => doCloseOptionsModal()}
                    onConfirm={(newOptions) =>
                      doConfirmOptionsModal(newOptions)
                    }
                    options={value.options}
                  />
                )}
              </>
            )}
          </MDBox>
        )}
      </Grid>
      <Grid item xs={6}>
        <CheckboxFormItem
          name={`${value.key}-question-mandatory`}
          label={i18n(
            'entities.questionnaireTemplate.fields.questionMandatory',
          )}
          value={value.questionMandatory}
          onChange={(value) =>
            doSaveProps({ questionMandatory: value })
          }
          forceValue
        />
        <CheckboxFormItem
          name={`${value.key}-attachment`}
          label={i18n(
            'entities.questionnaireTemplate.fields.attachment',
          )}
          value={value.attachment}
          onChange={(value) =>
            doSaveProps({ attachment: value })
          }
          forceValue
        />
        <CheckboxFormItem
          name={`${value.key}-attachment-mandatory`}
          label={i18n(
            'entities.questionnaireTemplate.fields.attachmentMandatory',
          )}
          value={value.attachmentMandatory}
          onChange={(value) =>
            doSaveProps({
              attachmentMandatory: value,
            })
          }
          forceValue
        />
      </Grid>
    </Grid>
  );

  const renderAnswerItem = () => (
    <Grid container spacing={1.6}>
      <Grid item md={4} xs={12}>
        {questionnaireEnumerator.typeDefines[
          value.type
        ]?.render({
          ...value,
          key: `${value.key}-preview`,
          title: i18n(
            'entities.questionnaireTemplate.fields.answer',
          ),
          answer: safeValue(value, 'answer'),
          required: preview && value.questionMandatory,
          readOnly: readOnly,
          onChange: setAnswer,
          onBlur: () =>
            doSaveProps({
              answer,
            }),
        })}
      </Grid>
      <Grid item md={4} xs={12}>
        {readOnly ? (
          <TextViewItem
            label={i18n(
              'entities.questionnaireTemplate.fields.additionalInformation',
            )}
            value={value.additionalInformation ?? ''}
          />
        ) : (
          <InputFormItem
            label={i18n(
              'entities.questionnaireTemplate.fields.additionalInformation',
            )}
            onChange={setAdditionalInformation}
            onBlur={() =>
              doSaveProps({ additionalInformation })
            }
            value={value.additionalInformation ?? ''}
            variant="standard"
            forceValue
          />
        )}
      </Grid>
      {value.attachment && (
        <Grid item md={4} xs={12}>
          {readOnly ? (
            <FilesViewItem
              columns={1}
              label={i18n(
                'entities.questionnaireTemplate.fields.attachment',
              )}
              value={value.attachments}
            />
          ) : (
            <FilesFormItem
              columns={1}
              name={`${value.key}-files-form-item`}
              label={i18n(
                'entities.questionnaireTemplate.fields.attachment',
              )}
              max={undefined}
              required={value.attachmentMandatory}
              storage={
                Storage.values.questionnaireAttachment
              }
            />
          )}
        </Grid>
      )}
    </Grid>
  );

  return (
    <MDBox position="relative" my={1.6}>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="start"
        lineHeight={0}
      >
        <MDBox flexGrow={1}>
          {!preview && !readOnly && value.isEditing ? (
            <InputFormItem
              value={inputValue}
              variant="standard"
              onChange={(newValue) =>
                setInputValue(newValue)
              }
              onBlur={() => doSaveTitleOnly()}
              startAdornment={
                <InputAdornment
                  position="start"
                  sx={{
                    color:
                      (darkMode ? 'white' : 'inherit') +
                      ' !important',
                  }}
                >
                  <span>{`${prefix}.${index + 1}`}</span>
                </InputAdornment>
              }
              forceValue
            />
          ) : (
            <MDTypography
              variant="body2"
              fontWeight="bold"
              sx={{
                maxWidth: '100%',
                display: 'inline-block',
                whiteSpace: 'break-spaces',
              }}
              lineHeight="1.6rem"
            >
              {`${prefix}.${index + 1} ${value.title}`}
            </MDTypography>
          )}
        </MDBox>
        {!preview && !readOnly && (
          <MDBox display="flex">
            <EntityActionButtons
              firstItem={firstItem}
              lastItem={lastItem}
              color={color}
              index={index}
              isEditing={value.isEditing}
              doSave={doSave}
              doCancel={doCancel}
              doEdit={doEdit}
              doDelete={doDelete}
              doMoveUp={doMoveUp}
              doMoveDown={doMoveDown}
            />
            <Tooltip
              title={i18n(
                'entities.questionnaireTemplate.labels.addNestedQuestion',
              )}
              disableInteractive
            >
              <IconButton
                color={color}
                size="small"
                onClick={() =>
                  childRef?.current?.doAddQuestion()
                }
                tabIndex={-1}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </MDBox>
        )}
      </MDBox>
      <MDBox pl={3.2}>
        <MDBox my={1.6}>
          {preview || readOnly
            ? renderAnswerItem()
            : renderQuestionItemBuilder()}
        </MDBox>
        <Questions
          ref={childRef}
          prefix={`${prefix}.${index + 1}`}
          entity={entity}
          onChange={(newQuestion) =>
            doChangeQuestion(value.key, newQuestion)
          }
          preview={preview}
          readOnly={readOnly}
        />
      </MDBox>
    </MDBox>
  );
}

export default QuestionItem;
