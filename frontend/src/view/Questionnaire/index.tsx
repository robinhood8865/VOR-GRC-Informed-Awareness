import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Grid } from '@mui/material';
import { i18n } from 'src/i18n';
import {
  JsonExporter,
  JSON_TYPE,
} from 'src/modules/shared/json/jsonExporter';
import { JsonImporter } from 'src/modules/shared/json/jsonImporter';
import { selectMuiSettings } from 'src/modules/mui/muiSelectors';
import { summarizeQuestionCount } from 'src/view/Questionnaire/common';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import FieldSetViewItem from 'src/view/shared/view/FieldSetViewItem';
import formSelectors from 'src/modules/form/formSelectors';
import lodash from 'lodash';
import MDAlert from 'src/mui/components/MDAlert';
import MDBox from 'src/mui/components/MDBox';
import MDButton from 'src/mui/components/MDButton';
import MDTypography from 'src/mui/components/MDTypography';
import Sections from 'src/view/Questionnaire/components/Sections';
import SubSections from 'src/view/Questionnaire/components/SubSections';
import Message from 'src/view/shared/message';

const Questionnaire = forwardRef((props: any, ref) => {
  const { sidenavColor } = selectMuiSettings();
  const { name, onChange, preview, readOnly, value } =
    props;

  const {
    control: { defaultValuesRef },
    getValues,
    register,
    setValue,
  } = useFormContext();

  const defaultValues = defaultValuesRef.current || {};

  const formValue = name ? getValues(name) : null;

  const getInitialValue = () =>
    ![null, undefined].includes(formValue)
      ? formValue
      : value || defaultValues[name] || {};

  const curValue = getInitialValue();

  const setAttachmentsAsFormValue = (entity) => {
    if (!entity) {
      return;
    }
    if (!entity.sections) {
      entity.sections = [];
    }
    if (!entity.questions) {
      entity.questions = {};
    }
    for (const section of entity.sections) {
      setAttachmentsAsFormValue(
        entity.questions[section.key],
      );
      if (!section.type || !section.attachment) {
        continue;
      }
      const formName = `${section.key}-files-form-item`;
      register(formName);
      setValue(formName, section.attachments ?? [], {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
  };

  useEffect(() => {
    if (name) {
      register({ name });
      setAttachmentsAsFormValue(curValue);
    }
  }, [register, name]);

  const [sections, setSections] = useState(
    curValue.sections || [],
  );
  const [questions, setQuestions] = useState(
    curValue.questions || {},
  );
  const [sectionKey, setSectionKey] = useState(null);
  const [currentSection, setCurrentSection] =
    useState(null);

  const onChangeFormValue = (value) => {
    setValue(name, value, {
      shouldValidate: false,
      shouldDirty: true,
    });
    onChange && onChange(value);
  };

  const onChangeSection = (entity) => {
    summarizeQuestionCount(entity);
    setSections(entity.sections);
    setQuestions(entity.questions);
    onSelectSection(sectionKey);
    onChangeFormValue(entity);
  };

  const onSelectSection = (key) => {
    setSectionKey(key);
    setCurrentSection(
      sections?.find(({ key: oKey }) => oKey === key) ||
        null,
    );
  };

  const onChangeSubSections = (entity) => {
    const newEntity = {
      sections,
      questions: {
        ...questions,
        [sectionKey]: entity,
      },
    };
    summarizeQuestionCount(newEntity);
    setSections(newEntity.sections);
    setQuestions(newEntity.questions);
    onChangeFormValue(newEntity);
  };

  const setAttachmentsOnRelatedQuestion = (entity) => {
    if (!entity) {
      return;
    }
    if (!entity.sections) {
      entity.sections = [];
    }
    if (!entity.questions) {
      entity.questions = {};
    }
    for (const section of entity.sections) {
      setAttachmentsOnRelatedQuestion(
        entity.questions[section.key],
      );
      if (!section.type || !section.attachment) {
        continue;
      }
      section.attachments = (
        getValues(`${section.key}-files-form-item`) ?? []
      ).map((file) => ({
        ...lodash.pick(file, ['id', 'new', 'title']),
        tags: (file.tags ?? []).map((tag) => tag.id ?? tag),
      }));
    }
  };

  const validateQuestions = (entity) => {
    if (!entity) {
      return true;
    }
    if (!entity.sections) {
      entity.sections = [];
    }
    if (!entity.questions) {
      entity.questions = {};
    }
    for (const section of entity.sections) {
      if (
        !validateQuestions(entity.questions[section.key])
      ) {
        return false;
      }
      if (!section.type) {
        continue;
      }
      if (
        section.questionMandatory &&
        (!section.answer || !section.answer.length)
      ) {
        Message.error(
          i18n(
            'entities.questionnaire.validations.required.answer',
            section.title,
          ),
        );
        return false;
      }
      if (
        section.attachmentMandatory &&
        (!section.attachments ||
          !section.attachments.length)
      ) {
        Message.error(
          i18n(
            'entities.questionnaire.validations.required.attachment',
            section.title,
          ),
        );
        return false;
      }
    }
    return true;
  };

  useImperativeHandle(ref, () => ({
    isValid() {
      const entity = { sections, questions };
      setAttachmentsOnRelatedQuestion(entity);
      return validateQuestions(entity);
    },
    getQuestionnaire() {
      const entity = { sections, questions };
      setAttachmentsOnRelatedQuestion(entity);
      return entity;
    },
  }));

  const input = useRef<any>();

  const doExportToJSON = () => {
    JsonExporter.exportAsJSONFile(
      { sections, questions },
      'questionnaireTemplate',
    );
  };

  const onHandleChange = (event) => {
    const files = event.target.files;

    if (!files || !files.length) {
      return;
    }

    let file = files[0];

    JsonImporter.doReadFile(file).then((result) => {
      onChangeSection(result);
    });
  };

  const refresh = useSelector(formSelectors.selectRefresh);

  useEffect(() => {
    setAttachmentsAsFormValue(curValue);
    setSections(curValue.sections || []);
    setQuestions(curValue.questions || {});
    onSelectSection(sectionKey);
  }, [refresh]);

  return (
    <Grid container spacing={1.6}>
      <Grid item xs={3}>
        <FieldSetViewItem>
          <Sections
            entity={{
              sections,
              questions,
            }}
            onChange={onChangeSection}
            onSelect={onSelectSection}
            preview={preview}
            readOnly={readOnly}
          />
        </FieldSetViewItem>
        {!readOnly && (
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1.6}
          >
            <MDButton
              variant="contained"
              color={sidenavColor}
              onClick={() => input.current.click()}
            >
              {i18n(`common.import`)}
            </MDButton>
            <input
              style={{ display: 'none' }}
              accept={`${JSON_TYPE}`}
              type="file"
              onChange={onHandleChange}
              ref={input}
            />
            <MDButton
              variant="contained"
              color={sidenavColor}
              onClick={() => doExportToJSON()}
            >
              {i18n(`common.exportToJSON`)}
            </MDButton>
          </MDBox>
        )}
      </Grid>
      <Grid item xs={9}>
        {Boolean(sectionKey) &&
        Boolean(questions[sectionKey]) ? (
          <SubSections
            title={currentSection?.title}
            entity={questions[sectionKey]}
            onChange={onChangeSubSections}
            preview={preview}
            readOnly={readOnly}
          />
        ) : (
          <MDAlert color="secondary" dismissible>
            <MDTypography
              variant="body2"
              color="white"
              fontWeight="regular"
            >
              {i18n(
                `entities.questionnaire.hints.${
                  readOnly
                    ? 'view'
                    : preview
                    ? 'answer'
                    : 'edit'
                }SectionInDetail`,
              )}
            </MDTypography>
          </MDAlert>
        )}
      </Grid>
    </Grid>
  );
});

export default Questionnaire;
