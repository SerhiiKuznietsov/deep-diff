'use strict';

const DATA = '_about';
const CREATED = '_created';
const UPDATED = '_updated';
const DELETED = '_deleted';
const CHANGED = '_changed';
const UNCHANGED = '_unchanged';
const OLD_VALUES = '_old';
const OUTER_KEY = '_outerKey';
const CHANGED_CHILDREN = '_innerChanged';
const STATUS = '_status';
const UNDEFINED_CHILDREN_STATUS = '_childrenStatus';
const DATA_CHANGE_FLAG_ARR = [CREATED, UPDATED, DELETED, CHANGED_CHILDREN];
const USED_KEYS = [DATA, CREATED, UPDATED, DELETED, CHANGED_CHILDREN, CHANGED, OLD_VALUES];

module.exports = {
  DATA,
  CREATED,
  UPDATED,
  DELETED,
  CHANGED,
  UNCHANGED,
  OLD_VALUES,
  OUTER_KEY,
  CHANGED_CHILDREN,
  DATA_CHANGE_FLAG_ARR,
  USED_KEYS,
  STATUS,
  UNDEFINED_CHILDREN_STATUS,
};
