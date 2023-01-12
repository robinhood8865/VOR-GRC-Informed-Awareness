import { Card } from '@mui/material';
import { i18n } from 'src/i18n';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import actions from 'src/modules/campaign/view/campaignViewActions';
import CampaignInstanceListFilter from 'src/view/campaignInstance/list/CampaignInstanceListFilter';
import CampaignInstanceListTable from 'src/view/campaignInstance/list/CampaignInstanceListTable';
import CampaignViewToolbar from 'src/view/campaign/view/CampaignViewToolbar';
import MDBox from 'src/mui/components/MDBox';
import MDTypography from 'src/mui/components/MDTypography';

function CampaignPage() {
  const dispatch = useDispatch();
  const match = useRouteMatch();

  useEffect(() => {
    dispatch(actions.doFind(match.params.id));
  }, [dispatch, match.params.id]);

  return (
    <Card>
      <MDBox pt={2.4} px={2.4}>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <MDTypography variant="h3" mb={2.4}>
            {i18n('entities.campaign.view.title')}
          </MDTypography>
          <CampaignViewToolbar match={match} />
        </MDBox>
        <CampaignInstanceListFilter
          contains={true}
          ownerCampaign={match.params.id}
        />
      </MDBox>
      <CampaignInstanceListTable />
    </Card>
  );
}

export default CampaignPage;
