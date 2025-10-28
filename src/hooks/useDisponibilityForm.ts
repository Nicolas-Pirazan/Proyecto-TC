import { IIntervalTime } from '@/types/forms';
import { IIntervalOption } from '@/types/schedule';
import moment from 'moment';

export const useDisponibilityForm = () => {
  const getIntervalsTime = ({ values }: { values: { horario: string }[] }): IIntervalOption[] => {
    const intervals: IIntervalTime[] = [
      { hours: 8, minutes: 20 },
      { hours: 9, minutes: 10 },
      { hours: 10, minutes: 0 },
      { hours: 10, minutes: 45 },
      { hours: 11, minutes: 35 },
      { hours: 12, minutes: 20 },
      { hours: 13, minutes: 0 },
      { hours: 13, minutes: 40 },
      { hours: 15, minutes: 0 },
      { hours: 15, minutes: 45 },
      { hours: 16, minutes: 30 },
      { hours: 17, minutes: 15 },
      { hours: 18, minutes: 0 },
      { hours: 18, minutes: 50 },
      { hours: 19, minutes: 35 },
      { hours: 20, minutes: 20 },
    ];

    const now = moment();
    const intervalsOptions: IIntervalOption[] = intervals.map(interval => {
      const intervalStart = moment(now.set({ hours: interval.hours, minutes: interval.minutes }));
      const intervalEnd = intervalStart.clone().add(40, 'minutes');
      const intervalTime = `${intervalStart.format('HH:mm')} - ${intervalEnd.format('HH:mm')}`;
      const isIntervalDisabled = values.findIndex(value => value.horario === intervalTime) > -1;
      return { id: intervalTime, label: intervalTime, disabled: isIntervalDisabled };
    });

    return intervalsOptions;
  };

  return {
    getIntervalsTime,
  };
};
