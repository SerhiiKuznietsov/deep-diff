"use strict";

const newData = require("./json-data/new.json");
const oldData = require("./json-data/old.json");

const { getDiff } = require("./deep-diff-map/index");

const logDiffTime = (func) => {
  const startTime = new Date().getTime();
  const result = func();
  console.log(`Diff time: ${new Date().getTime() - startTime}ms`);
  return result;
};

const bindOptions = (func, ...options) => () => func(...options);

const func = bindOptions(getDiff, oldData, newData);

const result = logDiffTime(func);

result;
