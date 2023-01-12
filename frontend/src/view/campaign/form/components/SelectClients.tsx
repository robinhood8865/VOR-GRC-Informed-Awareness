import { i18n } from 'src/i18n';
import { toArray } from 'src/view/Questionnaire/common';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import ClientListFilter from 'src/view/client/list/ClientListFilter';
import ClientListTable from 'src/view/client/list/ClientListTable';
import MDBox from 'src/mui/components/MDBox';
import StepContent from 'src/view/shared/components/StepContent';

const SelectClients = ({ visible = false }) => {
  const { getValues, setValue, register } =
    useFormContext();
  const formClients = getValues('clients');
  const [clients, setClients] = useState(formClients ?? []);
  const doToggleSelected = (value) => {
    const ids = toArray(value);
    if (!ids) {
      return;
    }
    const newClients = [...clients];
    ids.forEach((id) => {
      const exists = newClients.includes(id);
      if (exists) {
        newClients.splice(newClients.indexOf(id), 1);
      } else {
        newClients.push(id);
      }
    });
    register('clients');
    setValue('clients', newClients, {
      shouldValidate: false,
      shouldDirty: true,
    });
    setClients(newClients);
  };
  useEffect(() => {
    setClients(formClients);
  }, [formClients]);
  return (
    <StepContent
      title={i18n(
        'entities.campaign.sections.selectClients',
      )}
      visible={visible}
    >
      <ClientListFilter
        prefix="client_filter_"
        withoutFormWrapper
      />
      <MDBox mx={-2.4}>
        <ClientListTable
          onClickCheckBox={doToggleSelected}
          checkedIds={clients}
        />
      </MDBox>
    </StepContent>
  );
};

export default SelectClients;
