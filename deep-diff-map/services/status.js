const { isObject } = require("../../utils/validation");
const {
  CREATED_STATUS,
  DELETED_STATUS,
  CHANGED_STATUS,
  UNCHANGED_STATUS,
  DEEP_VALUE_STATUS,
} = require("../constants/status");

exports.calcKeyStatus = (newData, oldData, key) => {
  const keyInNewData = newData.hasOwnProperty(key);
  const keyInOldData = oldData.hasOwnProperty(key);

  if (!keyInNewData && !keyInOldData) {
    throw new Error("missing both values for a key is impossible");
  }

  if (keyInNewData && !keyInOldData) return CREATED_STATUS;
  if (!keyInNewData && keyInOldData) return DELETED_STATUS;

  const newValue = newData[key];
  const oldValue = oldData[key];

  if (isObject(newValue) && isObject(oldValue)) return DEEP_VALUE_STATUS;

  if (newValue !== oldValue) return CHANGED_STATUS;

  return UNCHANGED_STATUS;
};

exports.isStatus = (status) => ALL_STATUS_NAME.hasOwnProperty(status);
exports.isCreatedStatus = (status) => status === CREATED_STATUS;
exports.isDeletedStatus = (status) => status === DELETED_STATUS;
exports.isChangedStatus = (status) => status === CHANGED_STATUS;
exports.isUnchangedStatus = (status) => status === UNCHANGED_STATUS;
exports.isDeepValuedStatus = (status) => status === DEEP_VALUE_STATUS;
