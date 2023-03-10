import { i18n } from 'src/i18n';
import { Icon } from '@mui/material';
import config from 'src/config';
import Permissions from 'src/security/permissions';
import StorefrontIcon from '@mui/icons-material/Storefront';

const permissions = Permissions.values;

const visibleExtraMenus = false;

const menus = [
  {
    path: '/',
    exact: true,
    icon: <Icon>dashboard</Icon>,
    name: i18n('dashboard.menu'),
    permissionRequired: permissions.dashboardRead,
  },

  {
    path: '/organization-profile',
    name: i18n('entities.organizationProfile.menu'),
    permissionRequired: permissions.organizationProfileEdit,
    icon: <Icon>business</Icon>,
  },

  {
    path: '/campaign-instance',
    name: i18n('entities.campaignInstance.menu'),
    permissionRequired: permissions.campaignInstanceRead,
    icon: <Icon>question_answer</Icon>,
  },

  {
    name: i18n('collapses.campaigns.menu'),
    key: 'campaigns',
    icon: <Icon>campaign</Icon>,
    permissionRequired: permissions.collapseCampaignRead,
    collapse: [
      {
        path: '/campaign',
        permissionRequired: permissions.campaignRead,
        name: i18n('entities.campaign.menu'),
        icon: <Icon>campaign</Icon>,
      },
      {
        path: '/questionnaire-template',
        permissionRequired:
          permissions.questionnaireTemplateRead,
        name: i18n('entities.questionnaireTemplate.menu'),
        icon: <Icon>question_answer</Icon>,
      },
      {
        path: '/email-template',
        permissionRequired: permissions.emailTemplateRead,
        name: i18n('entities.emailTemplate.menu'),
        icon: <Icon>drafts</Icon>,
      },
    ],
  },

  {
    name: i18n('collapses.tasks.menu'),
    key: 'tasks',
    icon: <Icon>assignment</Icon>,
    permissionRequired: permissions.collapseTaskRead,
    collapse: [
      {
        path: '/task',
        permissionRequired: permissions.taskRead,
        name: i18n('entities.task.menu'),
        icon: <Icon>task</Icon>,
      },

      {
        path: '/task-priority',
        permissionRequired: permissions.taskPriorityRead,
        name: i18n('entities.taskPriority.menu'),
        icon: <Icon>low_priority</Icon>,
      },

      {
        path: '/task-list',
        permissionRequired: permissions.taskListRead,
        name: i18n('entities.taskList.menu'),
        icon: <Icon>list_alt</Icon>,
      },

      {
        path: '/note',
        permissionRequired: permissions.noteRead,
        name: i18n('entities.note.menu'),
        icon: <Icon>note</Icon>,
      },
    ],
  },

  {
    name: i18n('collapses.vendors.menu'),
    key: 'vendor-management',
    icon: <StorefrontIcon />,
    permissionRequired: permissions.collapseVendorRead,
    collapse: [
      {
        path: '/vendor',
        permissionRequired: permissions.vendorRead,
        name: i18n('entities.vendor.menu'),
        icon: <StorefrontIcon />,
      },

      {
        path: '/vendor-category',
        permissionRequired: permissions.vendorCategoryRead,
        name: i18n('entities.vendorCategory.menu'),
        icon: <Icon>category</Icon>,
      },
    ],
  },

  {
    name: i18n('collapses.clients.menu'),
    key: 'client-management',
    icon: <Icon>people_alt</Icon>,
    permissionRequired: permissions.collapseClientRead,
    collapse: [
      {
        path: '/client',
        permissionRequired: permissions.clientRead,
        name: i18n('entities.client.menu'),
        icon: <Icon>person</Icon>,
      },

      {
        path: '/client-category',
        permissionRequired: permissions.clientCategoryRead,
        name: i18n('entities.clientCategory.menu'),
        icon: <Icon>folder_shared</Icon>,
      },
    ],
  },

  {
    name: i18n('collapses.risks.menu'),
    key: 'risk-management',
    icon: <Icon>gpp_maybe</Icon>,
    permissionRequired: permissions.collapseRiskRead,
    collapse: [
      {
        path: '/risk',
        permissionRequired: permissions.riskRead,
        name: i18n('entities.risk.menu'),
        icon: <Icon>assignment_late</Icon>,
      },

      {
        path: '/risk-category',
        permissionRequired: permissions.riskCategoryRead,
        name: i18n('entities.riskCategory.menu'),
        icon: <Icon>crisis_alert</Icon>,
      },
    ],
  },

  {
    path: '/product',
    permissionRequired: permissions.productRead,
    name: i18n('entities.product.menu'),
    icon: <Icon>store</Icon>,
  },

  {
    path: '/news-article',
    key: 'news',
    exact: true,
    name: i18n('entities.newsArticle.menu'),
    permissionRequired: permissions.newsArticleRead,
    icon: <Icon>newspaper</Icon>,
  },

  visibleExtraMenus && {
    path: '/news-favorite',
    key: 'favorite',
    exact: true,
    name: i18n('entities.newsFavorite.menu'),
    permissionRequired: permissions.newsFavoriteRead,
    icon: <Icon>favorite</Icon>,
  },

  visibleExtraMenus && {
    path: '/tag',
    key: 'tag',
    exact: true,
    name: i18n('entities.tag.menu'),
    permissionRequired: permissions.tagRead,
    icon: <Icon>sell</Icon>,
  },

  {
    name: i18n('collapses.documents.menu'),
    key: 'documents',
    icon: <Icon>folder</Icon>,
    permissionRequired: permissions.collapseDocumentRead,
    collapse: [
      {
        path: '/document',
        name: i18n('entities.document.menu'),
        permissionRequired: permissions.documentRead,
        icon: <Icon>upload_file</Icon>,
      },
      {
        path: '/policy',
        name: i18n('entities.policy.menu'),
        permissionRequired: permissions.policyRead,
        icon: <Icon>policy</Icon>,
      },
      {
        path: '/policy-template',
        name: i18n('entities.policyTemplate.menu'),
        permissionRequired: permissions.policyTemplateRead,
        icon: <Icon>security</Icon>,
      },
    ],
  },

  {
    name: i18n('collapses.reports.menu'),
    key: 'reports',
    icon: <Icon>assessment</Icon>,
    permissionRequired: permissions.collapseReportRead,
    collapse: [
      {
        path: '/report/tasks-by-month',
        permissionRequired: permissions.taskRead,
        name: i18n('reports.tasksByMonth.menu'),
        icon: <Icon>task</Icon>,
      },
    ],
  },

  {
    name: i18n('settings.menu'),
    key: 'settings',
    icon: <Icon>settings</Icon>,
    permissionRequired: permissions.collapseSettingsRead,
    collapse: [
      {
        path: '/settings',
        name: i18n('settings.tenant'),
        permissionRequired: permissions.settingsEdit,
        icon: <Icon>room_preferences</Icon>,
      },

      {
        path: '/audit-logs',
        name: i18n('auditLog.menu'),
        permissionRequired: permissions.auditLogRead,
        icon: <Icon>restore</Icon>,
      },
    ],
  },
].filter(Boolean);

const profileRoutes = [
  {
    name: i18n('auth.profile.title'),
    path: '/profile',
    icon: <Icon>person_outline</Icon>,
  },
  {
    name: i18n('auth.passwordChange.title'),
    path: '/password-change',
    icon: <Icon>lock</Icon>,
  },
].filter(Boolean);

const tenantRoutes = [
  {
    name: i18n('tenant.list.title'),
    path: '/tenant',
    icon: <Icon>apps</Icon>,
  },
].filter(Boolean);

const userRoutes = [
  {
    path: '/user',
    name: i18n('user.menu'),
    permissionRequired: permissions.userRead,
    icon: <Icon>person</Icon>,
  },
].filter(Boolean);

const planRoutes = [
  config.isPlanEnabled && {
    path: '/plan',
    permissionRequired: permissions.planRead,
    icon: <Icon>credit_card_outlined</Icon>,
    name: i18n('plan.menu'),
  },
].filter(Boolean);

export {
  menus,
  profileRoutes,
  tenantRoutes,
  userRoutes,
  planRoutes,
};
