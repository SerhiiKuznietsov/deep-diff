const { isObject } = require("../utils/validation");
const {
  enrichWithDataDescribingDifference,
  calculatedParentChanges,
  calcStatusAndAddToAbout,
} = require("./services/about");
const {
  isCreatedStatus,
  isDeletedStatus,
  isUnchangedStatus,
  isDeepValuedStatus,
} = require("./services/status");
const { getIterableValue } = require("./utils/obj-concat");
const { Stack } = require("./utils/stack");

const getByKeyIfExists = (obj, key) => {
  return obj !== undefined ? obj[key] : undefined;
};

exports.getDiff = (oldData, newData) => {
  const stack = new Stack({ newData, oldData });

  while (stack.size) {
    const stackItem = stack.get();

    const { newData, oldData, parentData, outerKey, outerStatus } = stackItem;
    const { iterableValue, iterableLength } = getIterableValue(
      newData,
      oldData
    );

    const _about = enrichWithDataDescribingDifference(
      newData || oldData,
      parentData,
      outerKey
    );

    let notLastLevelFlag = false;

    for (let i = 0; i < iterableLength; i++) {
      const key = iterableValue[i];
      const newValue = getByKeyIfExists(newData, key);
      const oldValue = getByKeyIfExists(oldData, key);
      const isDeepValue = isObject(newValue) || isObject(oldValue);

      const keyStatus = calcStatusAndAddToAbout(
        newData,
        oldData,
        key,
        _about,
        outerStatus
      );

      if (isUnchangedStatus(keyStatus)) continue;

      const newStackData = {
        newData: newValue,
        oldData: oldValue,
        parentData: newData,
        outerKey: key,
      };

      if (
        isDeepValue &&
        (isCreatedStatus(keyStatus) || isDeletedStatus(keyStatus))
      ) {
        newStackData.outerStatus = keyStatus;
      }

      if (isDeepValue || isDeepValuedStatus(keyStatus)) {
        notLastLevelFlag = true;

        stack.add(newStackData);
      }
    }

    if (!notLastLevelFlag) calculatedParentChanges(newData);
  }

  return newData;
};
