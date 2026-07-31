import _ from 'lodash';

export const settingConfig = {
  skills: [],
  getSetting(prop, condition) {
    const object = _.find(this[prop], {
      key: condition,
    });

    return object ? object.value : '';
  },
};
