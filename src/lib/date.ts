import moment from 'moment';

export const formatDate = (date: string, format = "DD-MM-YYYY"  ) =>
  moment(date).format(format);
