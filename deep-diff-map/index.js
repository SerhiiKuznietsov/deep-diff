const { isObject } = require("../utils/validation");
const {
  getNewData,
  enrichWithDataDescribingDifference,
  addDeletedFieldToData,
  getIterableValue,
  calculatedParentChanges,
  addUpdatedToAbout,
  addUndefinedChildrenStatus,
  addDeletedToAbout,
  addCreatedToAbout,
  setDataChanged,
  isDeletedStatus,
} = require("./about-manager");
const { DELETED, CREATED } = require("./constants");


// const getKeyStatus = (newData, oldData, key) => {
//   const keyInNewData = newData.hasOwnProperty(key);
//   const keyInOldData = oldData.hasOwnProperty(key);

//   if (keyInNewData && !keyInOldData) return CREATED;
//   if (!keyInNewData && keyInOldData) return DELETED;
// };

exports.getDiff = (oldData, newData) => {
  const stack = [{ newData, oldData }];

  while (true) {
    const stackItem = stack.pop();
    if (!stackItem) break;

    const { newData, oldData, parentData, outerKey } = stackItem;
    const _about = getNewData(outerKey);
    const { iterableValue, iterableLength } = getIterableValue(
      newData,
      oldData
    );

    enrichWithDataDescribingDifference(newData, parentData, _about);

    let newStackItemFlag = false;

    for (let i = 0; i < iterableLength; i++) {
      const key = iterableValue[i];
      const newValue = newData[key];
      const oldValue = oldData[key];
      const keyInNewData = newData.hasOwnProperty(key);
      const keyInOldData = oldData.hasOwnProperty(key);
      const isDeep = isObject(newValue) || isObject(oldValue);

      if (keyInNewData && keyInOldData && !isDeep && newValue === oldValue) continue;


      if (keyInNewData && !keyInOldData) {
        addCreatedToAbout(_about, key);

        if (isDeep) {
          inheritedParentStatusBranchHandler({
            currentData: newValue,
            parentData: newData,
            outerKey: key,
            outerStatusName: CREATED,
          });
        }
        continue;
      }

      if (!keyInNewData && keyInOldData) {
        addDeletedToAbout(_about, key);
        addDeletedFieldToData(_about, key, oldValue);

        if (isDeep) {
          inheritedParentStatusBranchHandler({
            currentData: oldValue,
            parentData: newData,
            outerKey: key,
            outerStatusName: DELETED,
          });
        }
        continue;
      }

      if (isDeep) {
        newStackItemFlag = true;
        addUndefinedChildrenStatus(_about, key);
        stack.push({
          newData: newValue,
          oldData: oldValue,
          parentData: newData,
          outerKey: key,
        });
        continue;
      }

      addUpdatedToAbout(_about, key, oldValue);
    }

    if (!newStackItemFlag) calculatedParentChanges(newData);
  }

  return newData;
};

const inheritedParentStatusBranchHandler = (dataItem) => {
  const stack = [dataItem];

  while (true) {
    const stackItem = stack.pop();
    if (!stackItem) break;

    const { currentData, parentData, outerKey, outerStatusName } = stackItem;

    const _about = getNewData(outerKey);
    enrichWithDataDescribingDifference(currentData, parentData, _about);

    if (isDeletedStatus(outerStatusName))
      addDeletedFieldToData(parentData, outerKey, currentData);

    const { iterableValue, iterableLength } = getIterableValue(currentData);
    for (let i = 0; i < iterableLength; i++) {
      const key = iterableValue[i];
      const currentValue = currentData[key];

      setDataChanged(_about, key, outerStatusName);

      if (!isObject(currentValue)) continue;

      stack.push({
        currentData: currentValue,
        parentData: currentData,
        outerKey: key,
        outerStatusName,
      });
    }
  }
};
