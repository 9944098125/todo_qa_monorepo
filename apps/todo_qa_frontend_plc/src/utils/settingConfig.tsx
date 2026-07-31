import _ from 'lodash';

export const settingConfig = {
  skills: [
    { key: 1, value: 'ReactJs' },
    { key: 2, value: 'NodeJs' },
    { key: 3, value: 'AWS' },
    { key: 4, value: 'Python' },
    { key: 5, value: 'DotNet' },
    { key: 6, value: 'MongoDB' },
    { key: 7, value: 'MySql' },
    { key: 8, value: 'Sqlite' },
    { key: 9, value: 'Azure' },
    { key: 10, value: 'ExpressJs' },
    { key: 11, value: 'React Native' },
    { key: 12, value: 'Kubernetes' },
    { key: 13, value: 'Docker' },
    { key: 14, value: 'Devops' },
  ],
  qualifications: [
    { key: 1, value: 'B.Tech' },
    { key: 2, value: 'Any Degree' },
    { key: 3, value: 'M.Tech' },
    { key: 4, value: 'BSC' },
    { key: 5, value: 'MSC' },
    { key: 6, value: 'BCA' },
    { key: 7, value: 'MCA' },
  ],
  requiredExperience: [
    { key: 1, value: 'Freshers' },
    { key: 2, value: '1+ year' },
    { key: 3, value: '1.5+ years' },
    { key: 4, value: '2+ years' },
    { key: 5, value: '2.5+ years' },
    { key: 6, value: '3+ years' },
    { key: 7, value: '3.5+ years' },
    { key: 8, value: '4+ years' },
    { key: 9, value: '4.5+ years' },
    { key: 10, value: '5+ years and above' },
  ],
  getSetting(prop, condition) {
    const object = _.find(this[prop], {
      key: condition,
    });

    return object ? object.value : '';
  },
};
