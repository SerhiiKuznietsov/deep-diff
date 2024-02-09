const {
  CREATED_STATUS,
  DELETED_STATUS,
  CHANGED_STATUS,
} = require("../constants/status");
const { Stack } = require("../utils/stack");
const {
  DATA,
  OLD_VALUES,
  CHANGED,
  CHANGED_CHILDREN,
  OUTER_KEY,
  UNDEFINED_CHILDREN_STATUS,
} = require("../constants/about-key");
const {
  calcKeyStatus,
  isCreatedStatus,
  isDeletedStatus,
  isChangedStatus,
  isDeepValuedStatus,
} = require("./status");

const setDataOld = (_about, key, oldValue) =>
  (_about[OLD_VALUES][key] = oldValue);

const setDataChanged = (_about, key, status) => {
  _about[CHANGED][key] = status;
};

const addCreatedToAbout = (_about, key) => {
  setDataChanged(_about, key, CREATED_STATUS);
};

const addDeletedToAbout = (_about, key) => {
  setDataChanged(_about, key, DELETED_STATUS);
};

const addUpdatedToAbout = (_about, key, oldValue) => {
  setDataOld(_about, key, oldValue);
  setDataChanged(_about, key, CHANGED_STATUS);
};

const addInnerChangedAbout = (_about, key) => {
  setDataChanged(_about, key, CHANGED_CHILDREN);
};

const addUndefinedChildrenStatus = (_about, key) => {
  if (!_about[UNDEFINED_CHILDREN_STATUS]) {
    _about[UNDEFINED_CHILDREN_STATUS] = {};
  }

  _about[UNDEFINED_CHILDREN_STATUS][key] = key;
};

const removeUndefinedChildrenStatus = (_about, key) => {
  if (
    !_about[UNDEFINED_CHILDREN_STATUS] ||
    !_about[UNDEFINED_CHILDREN_STATUS].hasOwnProperty(key)
  )
    return;

  delete _about[UNDEFINED_CHILDREN_STATUS][key];
};

const getOuterKey = (_about) => _about[OUTER_KEY];

const calculatedParentChanges = (currentData) => {
  const stack = new Stack(currentData);

  while (stack.size) {
    const data = stack.get();
    const parentData = data.parentData();

    if (!parentData) break;

    stack.add(parentData);

    const about = data.getAbout();
    const emptyChanged = !Object.keys(about[CHANGED]).length;
    const outerKey = getOuterKey(about);

    const parentAbout = parentData.getAbout();

    removeUndefinedChildrenStatus(parentAbout, outerKey);

    if (!emptyChanged) {
      addInnerChangedAbout(parentAbout, outerKey);
    }

    if (
      !parentAbout[UNDEFINED_CHILDREN_STATUS] ||
      Object.keys(parentAbout[UNDEFINED_CHILDREN_STATUS]).length
    ) {
      break;
    } else {
      delete parentAbout[UNDEFINED_CHILDREN_STATUS];
    }
  }
};

const addDeletedFieldToData = (data, key, value) => {
  Object.defineProperty(data, key, {
    value,
  });
};

const enrichWithDataDescribingDifference = (data, parentData, outerKey) => {
  const _about = getNewAboutData(outerKey);

  Object.defineProperties(data, {
    getAbout: {
      value: function () {
        return this[DATA];
      },
    },
    parentData: {
      value: () => parentData,
    },
    [DATA]: {
      value: _about,
    },
  });

  return _about;
};

const getNewAboutData = (outerKey) => {
  return {
    [OLD_VALUES]: {},
    [CHANGED]: {},
    [OUTER_KEY]: outerKey,
  };
};

const calcStatusAndAddToAbout = (
  newData,
  oldData,
  key,
  _about,
  inheritStatus
) => {
  const status = inheritStatus || calcKeyStatus(newData, oldData, key);

  if (isCreatedStatus(status)) {
    addCreatedToAbout(_about, key);
  }

  if (isDeletedStatus(status)) {
    addDeletedToAbout(_about, key);
    addDeletedFieldToData(_about, key, oldData[key]);
  }

  if (isChangedStatus(status)) {
    addUpdatedToAbout(_about, key, oldData[key]);
  }

  if (isDeepValuedStatus(status)) {
    addUndefinedChildrenStatus(_about, key);
  }

  return status;
};

module.exports = {
  enrichWithDataDescribingDifference,
  calculatedParentChanges,
  calcStatusAndAddToAbout,
};
