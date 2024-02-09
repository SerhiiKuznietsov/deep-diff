"use strict";

const newData = require("./json-data/new1.json");
const oldData = require("./json-data/old1.json");

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

// TODO - fixed bugs