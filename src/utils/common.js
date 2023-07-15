import _ from "lodash";

export const getInfoData = (data = {}, fields = []) => {
  return _.pick(data, fields);
};

export const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};

export const getUnSelectData = (select = []) => {
  try {
    if (typeof select === "string") {
      console.log(JSON.parse(select));
      return Object.fromEntries(JSON.parse(select).map((item) => [item, 0]));
    }
    return Object.fromEntries(select.map((item) => [item, 0]));
  } catch (error) {
    return [];
  }
};

export const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === null || obj[k] === undefined) delete obj[k];
  });

  return obj;
};

export const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      console.log(k);
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};
