import { EntityActionButtons } from 'src/view/Questionnaire/common';
import { i18n } from 'src/i18n';
import { IconButton, Tooltip } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import InputAdornment from '@mui/material/InputAdornment';
import InputFormItem from 'src/view/shared/form/items/InputFormItem';
import MDBox from 'src/mui/components/MDBox';
import MDTypography from 'src/mui/components/MDTypography';
import Message from 'src/view/shared/message';
import Questions from 'src/view/Questionnaire/components/Questions';

function SubSectionItem(props) {
  const {
    color,
    darkMode,
    doChangeQuestion,
    doDeleteSubSection,
    doMoveDown,
    doMoveUp,
    doSaveSubSection,
    doSelect,
    entity,
    firstItem,
    index,
    lastItem,
    preview,
    readOnly,
    value,
  } = props;

  if (!entity) {
    return null;
  }

  const childRef = useRef(null);

  const [inputValue, setInputValue] = useState(null);

  useEffect(() => {
    setInputValue(value.title);
  }, [value.key]);

  const doEdit = () => {
    doSaveSubSection &&
      doSaveSubSection(
        {
          isEditing: true,
        },
        index,
      );
  };

  const doDelete = () => {
    doDeleteSubSection && doDeleteSubSection(index);
  };

  const doSave = () => {
    if (!inputValue || inputValue.trim() === '') {
      Message.error(
        i18n(
          'entities.questionnaireTemplate.update.section.required',
        ),
      );
      return;
    }
    doSaveSubSection &&
      doSaveSubSection(
        {
          title: inputValue,
          isEditing: false,
        },
        index,
      );
  };

  const doSaveTitleOnly = () => {
    doSaveSubSection &&
      doSaveSubSection(
        {
          title: inputValue,
        },
        index,
      );
  };

  const doCancel = () => {
    doSaveSubSection &&
      doSaveSubSection(
        {
          isEditing: false,
        },
        index,
      );
  };

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
                  <span>{`${index + 1}.`}</span>
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
              {`${index + 1}. ${value.title}`}
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
                'entities.questionnaireTemplate.labels.addQuestion',
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
        <Questions
          ref={childRef}
          prefix={`${index + 1}`}
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

export default SubSectionItem;
