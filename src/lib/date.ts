import moment from 'moment';

export const formatDate = (date: string | Date, format: string = 'DD-MM-YYYY'): string => {
  return moment(date).format(format);
};
