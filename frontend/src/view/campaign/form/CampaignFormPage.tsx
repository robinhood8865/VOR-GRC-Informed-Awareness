import { getHistory } from 'src/modules/store';
import { Grid } from '@mui/material';
import { i18n } from 'src/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import actions from 'src/modules/campaign/form/campaignFormActions';
import CampaignForm from 'src/view/campaign/form/CampaignForm';
import MDTypography from 'src/mui/components/MDTypography';
import selectors from 'src/modules/campaign/form/campaignFormSelectors';
import Spinner from 'src/view/shared/Spinner';

function CampaignFormPage(props) {
  const [dispatched, setDispatched] = useState(false);
  const dispatch = useDispatch();
  const match = useRouteMatch();

  const initLoading = useSelector(
    selectors.selectInitLoading,
  );
  const saveLoading = useSelector(
    selectors.selectSaveLoading,
  );
  const sendLoading = useSelector(
    selectors.selectSendLoading,
  );
  const record = useSelector(selectors.selectRecord);

  const isEditing = Boolean(match.params.id);
  const title = isEditing
    ? i18n('entities.campaign.edit.title')
    : i18n('entities.campaign.new.title');

  useEffect(() => {
    dispatch(actions.doInit(match.params.id));
    setDispatched(true);
  }, [dispatch, match.params.id]);

  const doSubmit = (
    id,
    data,
    doReturnToList = true,
    fnSuccess = null,
  ) => {
    if (id) {
      dispatch(
        actions.doUpdate(
          id,
          data,
          doReturnToList,
          fnSuccess,
        ),
      );
    } else {
      dispatch(
        actions.doCreate(data, doReturnToList, fnSuccess),
      );
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <MDTypography
          variant="h3"
          textAlign="center"
          mb={4}
        >
          {title}
        </MDTypography>
      </Grid>
      <Grid
        item
        xs={12}
        justifyContent="center"
        alignItems="center"
      >
        {initLoading && <Spinner />}

        {dispatched && !initLoading && (
          <CampaignForm
            initLoading={initLoading}
            saveLoading={saveLoading}
            sendLoading={sendLoading}
            record={record || {}}
            isEditing={isEditing}
            onSubmit={doSubmit}
            onCancel={() =>
              getHistory().push(
                isEditing
                  ? `/campaign/${match.params.id}`
                  : '/campaign',
              )
            }
          />
        )}
      </Grid>
    </Grid>
  );
}

export default CampaignFormPage;
