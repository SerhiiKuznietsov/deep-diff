exports.getIterableValue = (newData, oldData) => {
  const keysList = [];

  if (newData) keysList.push(...Object.keys(newData));
  if (oldData) keysList.push(...Object.keys(oldData));

  const iterableValue = newData && oldData ? [...new Set(keysList)] : keysList;

  return { iterableValue, iterableLength: iterableValue.length };
};