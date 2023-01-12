import { i18n } from 'src/i18n';
import { IconButton, Tooltip } from '@mui/material';
import { INPUT_TYPE } from 'src/view/Questionnaire/enumerators';
import { v4 as uuid } from 'uuid';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

export const generateSection = () => ({
  key: uuid(),
  title: i18n('common.untitled'),
  questions: 0,
  answers: 0,
  isEditing: true,
});

export const generateQuestion = () => ({
  key: uuid(),
  title: i18n('common.untitled'),
  questions: 0,
  answers: 0,
  isEditing: true,
  type: null,
  multiSelect: false,
  options: [],
  rightAnswer: [],
  questionMandatory: false,
  attachment: false,
  attachmentMandatory: false,
  answer: null,
  additionalInformation: null,
  attachments: [],
});

export const toArray = (value) => {
  return !value
    ? value
    : Array.isArray(value)
    ? value
    : [value];
};

export const safeValue = (entity, prop) => {
  const value = toArray(entity[prop]);
  if (!value) {
    return value;
  }
  return entity.type === INPUT_TYPE.SELECT &&
    entity.multiSelect
    ? value
    : value[0];
};

export const generateQuestions = (
  originalQuestions,
  newSections,
) => {
  const newQuestions = { ...(originalQuestions ?? {}) };
  for (const key of Object.keys(originalQuestions ?? {})) {
    if (
      !newSections.find((section) => section.key === key)
    ) {
      delete newQuestions[key];
    }
  }
  for (const section of newSections) {
    if (!newQuestions[section.key]) {
      newQuestions[section.key] = {
        sections: [],
        questions: {},
      };
    }
  }
  return newQuestions;
};

export const appendElement = (
  values,
  element,
  fnSuccess = null,
) => {
  const newValues = [...values, element];
  if (fnSuccess) {
    fnSuccess(newValues);
    return;
  }
  return newValues;
};

export const updateElement = (
  values,
  index,
  props,
  fnSuccess = null,
) => {
  if (index < 0 || index >= values.length) {
    return;
  }
  const newValues = [
    ...values.slice(0, index),
    {
      ...values[index],
      ...props,
    },
    ...values.slice(index + 1),
  ];
  if (fnSuccess) {
    fnSuccess(newValues);
    return;
  }
  return newValues;
};

export const deleteElement = (
  values,
  index,
  fnSuccess = null,
) => {
  if (index < 0 || index >= values.length) {
    return;
  }
  const newValues = [
    ...values.slice(0, index),
    ...values.slice(index + 1),
  ];
  if (fnSuccess) {
    fnSuccess(newValues);
    return;
  }
  return newValues;
};

export const moveUpElement = (
  values,
  index,
  fnSuccess = null,
) => {
  if (index <= 0) {
    return;
  }
  const newValues = [
    ...values.slice(0, index - 1),
    ...values.slice(index, index + 1),
    ...values.slice(index - 1, index),
    ...values.slice(index + 1),
  ];
  if (fnSuccess) {
    fnSuccess(newValues);
    return;
  }
  return newValues;
};

export const moveDownElement = (
  values,
  index,
  fnSuccess = null,
) => {
  if (index >= values.length - 1) {
    return;
  }
  const newValues = [
    ...values.slice(0, index),
    ...values.slice(index + 1, index + 2),
    ...values.slice(index, index + 1),
    ...values.slice(index + 2),
  ];
  if (fnSuccess) {
    fnSuccess(newValues);
    return;
  }
  return newValues;
};

export const summarizeQuestionCount = (entity) => {
  if (!entity) {
    return;
  }
  if (!entity.sections) {
    entity.sections = [];
  }
  if (!entity.questions) {
    entity.questions = {};
  }
  for (const section of entity.sections ?? []) {
    summarizeQuestionCount(entity.questions[section.key]);
    section.questions = !section.type ? 0 : 1;
    section.answers =
      !section.answer || !section.answer.length ? 0 : 1;
    section.questions += entity.questions
      ? (
          entity.questions[section.key]?.sections ?? []
        ).reduce(
          (totalQuestions, section) =>
            totalQuestions + section.questions,
          0,
        )
      : 0;
    section.answers += entity.questions
      ? (
          entity.questions[section.key]?.sections ?? []
        ).reduce(
          (totalAnswers, section) =>
            totalAnswers + section.answers,
          0,
        )
      : 0;
  }
};

export const EntityActionButtons = ({
  color,
  doCancel,
  doDelete,
  doEdit,
  doMoveDown,
  doMoveUp,
  doSave,
  firstItem,
  index,
  isEditing,
  lastItem,
}) => (
  <>
    {isEditing ? (
      <>
        <Tooltip
          title={i18n('common.save')}
          disableInteractive
        >
          <IconButton
            color={color}
            size="small"
            onClick={() => doSave()}
            tabIndex={-1}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={i18n('common.cancel')}
          disableInteractive
        >
          <IconButton
            color={color}
            size="small"
            onClick={() => doCancel()}
            tabIndex={-1}
          >
            <CancelIcon />
          </IconButton>
        </Tooltip>
      </>
    ) : (
      <>
        <Tooltip
          title={i18n('common.edit')}
          disableInteractive
        >
          <IconButton
            color={color}
            size="small"
            onClick={() => doEdit()}
            tabIndex={-1}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={i18n('common.destroy')}
          disableInteractive
        >
          <IconButton
            color={color}
            size="small"
            onClick={() => doDelete()}
            tabIndex={-1}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </>
    )}
    <Tooltip
      title={i18n('common.move.up')}
      disableInteractive
    >
      <span>
        <IconButton
          color={color}
          size="small"
          onClick={() => doMoveUp && doMoveUp(index)}
          disabled={Boolean(firstItem)}
          tabIndex={-1}
        >
          <ArrowUpwardIcon />
        </IconButton>
      </span>
    </Tooltip>
    <Tooltip
      title={i18n('common.move.down')}
      disableInteractive
    >
      <span>
        <IconButton
          color={color}
          size="small"
          onClick={() => doMoveDown && doMoveDown(index)}
          disabled={Boolean(lastItem)}
          tabIndex={-1}
        >
          <ArrowDownwardIcon />
        </IconButton>
      </span>
    </Tooltip>
  </>
);
