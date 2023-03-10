import CampaignService from 'src/modules/campaign/campaignService';
import Errors from 'src/modules/shared/error/errors';
import Message from 'src/view/shared/message';
import { getHistory } from 'src/modules/store';
import { i18n } from 'src/i18n';

const prefix = 'CAMPAIGN_FORM';

const campaignFormActions = {
  INIT_STARTED: `${prefix}_INIT_STARTED`,
  INIT_SUCCESS: `${prefix}_INIT_SUCCESS`,
  INIT_ERROR: `${prefix}_INIT_ERROR`,

  CREATE_STARTED: `${prefix}_CREATE_STARTED`,
  CREATE_SUCCESS: `${prefix}_CREATE_SUCCESS`,
  CREATE_ERROR: `${prefix}_CREATE_ERROR`,

  UPDATE_STARTED: `${prefix}_UPDATE_STARTED`,
  UPDATE_SUCCESS: `${prefix}_UPDATE_SUCCESS`,
  UPDATE_ERROR: `${prefix}_UPDATE_ERROR`,

  SEND_STARTED: `${prefix}_SEND_STARTED`,
  SEND_SUCCESS: `${prefix}_SEND_SUCCESS`,
  SEND_ERROR: `${prefix}_SEND_ERROR`,

  doInit: (id) => async (dispatch) => {
    try {
      dispatch({
        type: campaignFormActions.INIT_STARTED,
      });

      let record = {};

      const isEdit = Boolean(id);

      if (isEdit) {
        record = await CampaignService.find(id);
      }

      dispatch({
        type: campaignFormActions.INIT_SUCCESS,
        payload: record,
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: campaignFormActions.INIT_ERROR,
      });

      getHistory().push('/campaign');
    }
  },

  doCreate:
    (values, doReturnToList = true, fnSuccess = null) =>
    async (dispatch) => {
      try {
        dispatch({
          type: campaignFormActions.CREATE_STARTED,
        });

        const record = await CampaignService.create(values);

        dispatch({
          type: campaignFormActions.CREATE_SUCCESS,
        });

        Message.success(
          i18n('entities.campaign.create.success'),
        );

        fnSuccess && fnSuccess(record);

        if (doReturnToList) {
          getHistory().push('/campaign');
        }
      } catch (error) {
        Errors.handle(error);

        dispatch({
          type: campaignFormActions.CREATE_ERROR,
        });
      }
    },

  doUpdate:
    (id, values, doReturnToList = true, fnSuccess = null) =>
    async (dispatch, getState) => {
      try {
        dispatch({
          type: campaignFormActions.UPDATE_STARTED,
        });

        const record = await CampaignService.update(
          id,
          values,
        );

        dispatch({
          type: campaignFormActions.UPDATE_SUCCESS,
        });

        Message.success(
          i18n('entities.campaign.update.success'),
        );

        fnSuccess && fnSuccess(record);

        if (doReturnToList) {
          getHistory().push('/campaign');
        }
      } catch (error) {
        Errors.handle(error);

        dispatch({
          type: campaignFormActions.UPDATE_ERROR,
        });
      }
    },

  doSend:
    (id, doReturnToList = true, fnSuccess = null) =>
    async (dispatch, getState) => {
      try {
        dispatch({
          type: campaignFormActions.SEND_STARTED,
        });

        await CampaignService.send(id);

        dispatch({
          type: campaignFormActions.SEND_SUCCESS,
        });

        Message.success(
          i18n('entities.campaign.send.success'),
        );

        fnSuccess && fnSuccess();

        if (doReturnToList) {
          getHistory().push('/campaign');
        }
      } catch (error) {
        Errors.handle(error);

        dispatch({
          type: campaignFormActions.SEND_ERROR,
        });
      }
    },
};

export default campaignFormActions;
