import { i18n } from 'src/i18n';
import moment from 'moment';
import urlParse from 'url-parse';

export function getUserNameOrEmailPrefix(user) {
  if (!user || !(user instanceof Object)) {
    return null;
  }
  const fullName = [user.firstName, user.lastName]
    .join(' ')
    .trim();

  return fullName === ''
    ? user.email?.split('@')[0]
    : fullName;
}

export function getUserAvatar(user) {
  if (!user || !user.avatars || !user.avatars.length) {
    return null;
  }

  return user.avatars[0].downloadUrl;
}

export function getAbsoluteDateTimeByHour(value) {
  if (!value) {
    return null;
  }

  const oneHourUnix = 3600;
  const originUnix = moment(value).unix();
  const restUnix = originUnix % oneHourUnix;
  const newUnix =
    originUnix -
    restUnix +
    (restUnix > 0 ? oneHourUnix : 0);

  return moment.unix(newUnix);
}

export function getRowsByColumns(rows, columns = 1) {
  const newRows: any[] = [];
  if (!rows) {
    return newRows;
  }
  rows.forEach((row, index) => {
    const columnIndex = index % columns;
    if (!newRows[columnIndex]) {
      newRows[columnIndex] = [];
    }
    newRows[columnIndex].push(row);
  });
  return newRows;
}

export const booleanOptions = [
  {
    value: 'true',
    label: i18n('common.yes'),
  },
  {
    value: 'false',
    label: i18n('common.no'),
  },
];

export const extractsDomain = (url) => {
  const obj = urlParse(url);
  return obj.hostname.replace(/^www\./g, '');
};

export const extractsHostUrl = (url) => {
  const obj = urlParse(url);
  return [obj.protocol, obj.host].join('');
};

export const renameAllKeysWithPrefix = (
  obj,
  prefix,
  availableKeys = null,
) => {
  if (!obj) {
    return obj;
  }
  if (!prefix) {
    return obj;
  }
  const newObj = {};
  for (const key of Object.keys(obj)) {
    if (availableKeys && !availableKeys.includes(key)) {
      continue;
    }
    newObj[`${prefix}${key}`] = obj[key];
  }
  return newObj;
};

export const renameAllKeysWithoutPrefix = (
  obj,
  prefix,
  availableKeys = null,
) => {
  if (!obj) {
    return obj;
  }
  if (!prefix) {
    return obj;
  }
  const newObj = {};
  const prefixRegExp = new RegExp(`^${prefix}`);
  for (const key of Object.keys(obj)) {
    const newKey = key.replace(prefixRegExp, '');
    if (availableKeys && !availableKeys.includes(newKey)) {
      continue;
    }
    newObj[newKey] = obj[key];
  }
  return newObj;
};

export const uniqueArray = (values) => {
  if (!values) {
    return values;
  }
  const uniqueValues = [];
  values.forEach(
    (value) =>
      !uniqueValues.includes(value) &&
      uniqueValues.push(value),
  );
  return uniqueValues;
};

export const parseDateOnly = (date) => {
  const unixTimestamp = moment(date).unix();
  return moment.unix(
    unixTimestamp - (unixTimestamp % 86400),
  );
};
