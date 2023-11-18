const uuid = require("uuid");

const isUndefined = (val) => val === undefined;

const isNull = (val) => val === null;

const isBoolean = (val) => typeof val === "boolean";

const isString = (val) => typeof val === "string";

const isInteger = (val) => Number.isInteger(+val);

const isNumber = (val) => typeof val === "number" && !Number.isNaN(val);

const isArray = (val) => Array.isArray(val);

const isObject = (val) => !isNull(val) && !isArray(val) && typeof val === "object";

const isUuid = (val, ver) => {
  if (ver) return ver === uuid.version(val);

  return uuid.validate(val);
};

const isEmpty = (val) => {
  if (isBoolean(val)) return false;

  if (isArray(val)) return !val.length;

  if (isObject(val)) return !Object.keys(val).length;

  return !val;
};

module.exports = {
  isEmpty,
  isUndefined,
  isNull,
  isBoolean,
  isString,
  isInteger,
  isNumber,
  isArray,
  isObject,
  isUuid,
};
