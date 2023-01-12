import {
  appendElement,
  deleteElement,
  generateQuestion,
  generateQuestions,
  moveDownElement,
  moveUpElement,
  updateElement,
} from 'src/view/Questionnaire/common';
import {
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { i18n } from 'src/i18n';
import { selectMuiSettings } from 'src/modules/mui/muiSelectors';
import ConfirmModal from 'src/view/shared/modals/ConfirmModal';
import QuestionItem from 'src/view/Questionnaire/components/QuestionItem';

const Questions = forwardRef((props: any, ref) => {
  const {
    entity,
    onChange,
    onSelect,
    prefix,
    preview,
    readOnly,
  } = props;

  if (!entity) {
    return null;
  }

  const { sections, questions } = entity;
  const { sidenavColor, darkMode } = selectMuiSettings();

  const [indexToDelete, setIndexToDelete] = useState(null);

  const doCloseDeleteConfirmModal = () => {
    setIndexToDelete(null);
  };

  const doUpdateQuestionValues = (newQuestions) => {
    onChange &&
      onChange({
        sections: newQuestions,
        questions: generateQuestions(
          questions,
          newQuestions,
        ),
      });
  };

  const doChangeQuestion = (key, newQuestion) => {
    onChange &&
      onChange({
        ...entity,
        questions: {
          ...questions,
          [key]: newQuestion,
        },
      });
  };

  useImperativeHandle(ref, () => ({
    doAddQuestion() {
      appendElement(
        sections,
        generateQuestion(),
        doUpdateQuestionValues,
      );
    },
  }));

  const doSaveQuestion = (props, index) =>
    updateElement(
      sections,
      index,
      props,
      doUpdateQuestionValues,
    );

  const doDeleteQuestion = () => {
    deleteElement(
      sections,
      indexToDelete,
      doUpdateQuestionValues,
    );
    doCloseDeleteConfirmModal();
  };

  const doMoveUp = (index) =>
    moveUpElement(sections, index, doUpdateQuestionValues);

  const doMoveDown = (index) =>
    moveDownElement(
      sections,
      index,
      doUpdateQuestionValues,
    );

  const doSelect = (index) => {
    onSelect && onSelect(index);
  };

  return (
    <>
      {sections.map((section, index, original) => (
        <QuestionItem
          key={`question-item-${index}`}
          color={sidenavColor}
          darkMode={darkMode}
          doChangeQuestion={doChangeQuestion}
          doDeleteQuestion={setIndexToDelete}
          doMoveDown={doMoveDown}
          doMoveUp={doMoveUp}
          doSaveQuestion={doSaveQuestion}
          doSelect={doSelect}
          entity={questions[section.key]}
          firstItem={index === 0}
          index={index}
          lastItem={index + 1 === original.length}
          prefix={prefix}
          preview={preview}
          readOnly={readOnly}
          value={section}
        />
      ))}
      {indexToDelete !== null && (
        <ConfirmModal
          title={i18n('common.areYouSure')}
          onConfirm={() => doDeleteQuestion()}
          onClose={() => doCloseDeleteConfirmModal()}
          okText={i18n('common.yes')}
          cancelText={i18n('common.no')}
        />
      )}
    </>
  );
});

export default Questions;
