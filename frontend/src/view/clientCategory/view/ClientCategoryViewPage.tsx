import { Card } from '@mui/material';
import { i18n } from 'src/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import actions from 'src/modules/clientCategory/view/clientCategoryViewActions';
import ClientCategoryView from 'src/view/clientCategory/view/ClientCategoryView';
import ClientCategoryViewToolbar from 'src/view/clientCategory/view/ClientCategoryViewToolbar';
import MDBox from 'src/mui/components/MDBox';
import MDTypography from 'src/mui/components/MDTypography';
import selectors from 'src/modules/clientCategory/view/clientCategoryViewSelectors';

function ClientCategoryPage() {
  const dispatch = useDispatch();
  const match = useRouteMatch();

  const loading = useSelector(selectors.selectLoading);
  const record = useSelector(selectors.selectRecord);

  useEffect(() => {
    dispatch(actions.doFind(match.params.id));
  }, [dispatch, match.params.id]);

  return (
    <Card>
      <MDBox py={2.4} px={2.4}>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <MDTypography variant="h3" mb={2.4}>
            {i18n('entities.clientCategory.view.title')}
          </MDTypography>
          <ClientCategoryViewToolbar match={match} />
        </MDBox>
        <ClientCategoryView
          loading={loading}
          record={record}
        />
      </MDBox>
    </Card>
  );
}

export default ClientCategoryPage;
