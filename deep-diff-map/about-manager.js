const {
  DATA,
  CREATED, // created fields
  UPDATED, // updated fields
  DELETED, // deleted fields
  OLD_VALUES, // old field values
  CHANGED, // changed fields
  UNCHANGED, // unchanged fields
  CHANGED_CHILDREN, // internal changes
  OUTER_KEY,
  UNDEFINED_CHILDREN_STATUS,
} = require("./constants");

const getAboutData = (data) => data[DATA];

const setDataOld = (_about, key, oldValue) =>
  (_about[OLD_VALUES][key] = oldValue);
const setDataChanged = (_about, key, status) => (_about[CHANGED][key] = status);

const addCreatedToAbout = (_about, key) => {
  setDataChanged(_about, key, CREATED);
};

const addDeletedToAbout = (_about, key) => {
  setDataChanged(_about, key, DELETED);
};

const addUpdatedToAbout = (_about, key, oldValue) => {
  setDataOld(_about, key, oldValue);
  setDataChanged(_about, key, UPDATED);
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
  delete _about[UNDEFINED_CHILDREN_STATUS][key];
};

const isCreatedStatus = (status) => status === CREATED;
const isDeletedStatus = (status) => status === DELETED;

const isFieldStatusCreated = (_about, key) =>
  isCreatedStatus(_about[CHANGED][key]);
const isFieldStatusDeleted = (_about, key) =>
  isDeletedStatus(_about[CHANGED][key]);
const isFieldStatusEmpty = (_about, key) => _about[CHANGED][key] === undefined;

const getOuterKey = (_about) => _about[OUTER_KEY];

// const defaultFunctionList = [
//   {
//     key: 'getCreatedFields',
//     value: function () {
//       return getDataCreated(this);
//     },
//   },
//   {
//     key: 'getUpdatedFields',
//     value: function () {
//       return getDataUpdated(this);
//     },
//   },
//   {
//     key: 'getDeletedFields',
//     value: function () {
//       return getDataDeleted(this);
//     },
//   },
//   {
//     key: 'getChangedFields',
//     value: function () {
//       return getDataChanged(this);
//     },
//   },
//   {
//     key: 'getInnerChangedFields',
//     value: function () {
//       return getDataInnerChanged(this);
//     },
//   },
// ];

const getIterableValue = (newData, oldData) => {
  const keysList = [];

  if (newData) keysList.push(...Object.keys(newData));
  if (oldData) keysList.push(...Object.keys(oldData));

  const iterableValue = newData && oldData ? [...new Set(keysList)] : keysList;

  return { iterableValue, iterableLength: iterableValue.length };
};

const calculatedParentChanges = (currentData) => {
  const stack = [currentData];

  while (true) {
    const data = stack.pop();
    const parentData = data.parentData();

    if (!parentData) break;

    stack.push(parentData);

    const about = data.getAbout();
    const emptyChanged = !Object.keys(about[CHANGED]).length;
    const outerKey = getOuterKey(about);

    const parentAbout = parentData.getAbout();

    removeUndefinedChildrenStatus(parentAbout, outerKey);

    if (!emptyChanged) {
      addInnerChangedAbout(parentAbout, outerKey);
    }

    if (Object.keys(parentAbout[UNDEFINED_CHILDREN_STATUS]).length) {
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

const enrichWithDataDescribingDifference = (data, parentData, _about) => {
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
};

const getNewData = (outerKey) => {
  return {
    [OLD_VALUES]: {},
    [CHANGED]: {},
    [OUTER_KEY]: outerKey,
  };
};

const setNewAbout = (data, outerKey, changedObj) => {
  const _about = {
    [OLD_VALUES]: {},
    [CHANGED]: changedObj,
    [OUTER_KEY]: outerKey,
  };

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
};

module.exports = {
  isDeletedStatus,
  setDataChanged,
  addCreatedToAbout,
  addDeletedToAbout,
  addUndefinedChildrenStatus,
  addUpdatedToAbout,
  getNewData,
  getIterableValue,
  enrichWithDataDescribingDifference,
  calculatedParentChanges,
  addDeletedFieldToData,
};
