import React, { useContext, useEffect, useState } from 'react';

import { Box, Button, Grid, Typography } from '@mui/material';

import { DatePickerElement, useFieldArray, useFormContext } from 'react-hook-form-mui';

import { useDisponibilityForm } from '@/hooks';
import { DisponibilityContext } from '@/context/useDisponibility';
import SelectDisponibility from '../SelectDisponibility';
import { DaysNames } from '@/types/disponibility';
import { IFormProps } from '@/types/schedule';

type IWeekDaysProps = Omit<IFormProps, 'desde' | 'hasta'>;

const CreateDisponibilityForm = () => {
  const { getIntervalsTime } = useDisponibilityForm();
  const { dispatch } = useContext(DisponibilityContext);

  const [fechas, setFechas] = useState({ desde: undefined, hasta: undefined });
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  const { control, getValues, setValue } = useFormContext<IFormProps>();

  const { fields: mondays, append: appendMonday, remove: removeMonday } = useFieldArray({ name: 'lunes', control });
  const { fields: tuesdays, append: appendTuesday, remove: removeTuesday } = useFieldArray({ name: 'martes', control });
  const {
    fields: wednesdays,
    append: appendWednesday,
    remove: removeWednesday,
  } = useFieldArray({ name: 'miercoles', control });
  const {
    fields: thursdays,
    append: appendThursday,
    remove: removeThursday,
  } = useFieldArray({ name: 'jueves', control });
  const { fields: fridays, append: appendFriday, remove: removeFriday } = useFieldArray({ name: 'viernes', control });
  const {
    fields: saturdays,
    append: appendSaturday,
    remove: removeSaturday,
  } = useFieldArray({ name: 'sabado', control });

  const getValuesWeekDays = (): IWeekDaysProps => {
    return {
      lunes: [...getValues().lunes],
      martes: [...getValues().martes],
      miercoles: [...getValues().miercoles],
      jueves: [...getValues().jueves],
      viernes: [...getValues().viernes],
      sabado: [...getValues().sabado],
    };
  };

  const refreshCalendar = () => {
    dispatch({
      type: 'set_disponibility',
      payload: {
        disponibility: {
          desde: getValues('desde'),
          hasta: getValues('hasta'),
          consecutivo: 0,
          opciones: getValuesWeekDays(),
        },
      },
    });
  };

  const copySchedules = (dayName: DaysNames) => {
    setValue('lunes', [...getValues(dayName)]);
    setValue('martes', [...getValues(dayName)]);
    setValue('miercoles', [...getValues(dayName)]);
    setValue('jueves', [...getValues(dayName)]);
    setValue('viernes', [...getValues(dayName)]);
    setValue('sabado', [...getValues(dayName)]);

    refreshCalendar();
  };

  useEffect(() => {
    setIsFormDisabled(fechas.desde !== undefined && fechas.hasta !== undefined);
  }, [fechas.desde, fechas.hasta]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <DatePickerElement
            name="fromDate"
            label="Desde"
            required
            inputProps={{
              size: 'small',
            }}
            validation={{ required: 'Este campo es requerido' }}
            minDate={new Date()}
            onChange={value => {
              setFechas({ ...fechas, desde: value });
              setValue('desde', value);
              refreshCalendar();
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <DatePickerElement
            name="toDate"
            label="Hasta"
            required
            inputProps={{
              size: 'small',
            }}
            validation={{ required: 'Este campo es requerido' }}
            minDate={new Date()}
            onChange={value => {
              setFechas({ ...fechas, hasta: value });
              setValue('hasta', value);
              refreshCalendar();
            }}
          />
        </Grid>
      </Grid>
      {isFormDisabled && (
        <>
          <Box
            key={'monday-box'}
            display={'grid'}
            sx={{ gridTemplateColumns: '15% 50% 35%', alignItems: 'center', rowGap: 1, columnGap: 2 }}
            pt={4}
          >
            <Typography gridColumn={1} gridRow={1}>
              Lunes
            </Typography>
            {mondays.map((select, index) => (
              <SelectDisponibility
                key={select.id}
                name={`lunes.${index}.horario`}
                addSelect={() => appendMonday({ horario: '' })}
                index={index}
                opciones={getIntervalsTime({ values: getValues().lunes })}
                deleteSelect={() => removeMonday(index)}
                copySchedules={() => copySchedules('lunes')}
                setCalendar={() => refreshCalendar()}
              />
            ))}
          </Box>

          <Box
            key={'tuesday-box'}
            display={'grid'}
            sx={{ gridTemplateColumns: '15% 50% 35%', alignItems: 'center', rowGap: 1, columnGap: 2 }}
            pt={4}
          >
            <Typography gridColumn={1} gridRow={1}>
              Martes
            </Typography>
            {tuesdays.map((select, index) => (
              <SelectDisponibility
                key={select.id}
                name={`martes.${index}.horario`}
                addSelect={() => appendTuesday({ horario: '' })}
                index={index}
                opciones={getIntervalsTime({ values: getValues().martes })}
                deleteSelect={() => removeTuesday(index)}
                copySchedules={() => copySchedules('martes')}
                setCalendar={() => refreshCalendar()}
              />
            ))}
          </Box>

          <Box
            key={'wednesday-box'}
            display={'grid'}
            sx={{ gridTemplateColumns: '15% 50% 35%', alignItems: 'center', rowGap: 1, columnGap: 2 }}
            pt={4}
          >
            <Typography gridColumn={1} gridRow={1}>
              Miércoles
            </Typography>
            {wednesdays.map((select, index) => (
              <SelectDisponibility
                key={select.id}
                name={`miercoles.${index}.horario`}
                addSelect={() => appendWednesday({ horario: '' })}
                index={index}
                opciones={getIntervalsTime({ values: getValues().miercoles })}
                deleteSelect={() => removeWednesday(index)}
                copySchedules={() => copySchedules('miercoles')}
                setCalendar={() => refreshCalendar()}
              />
            ))}
          </Box>

          <Box
            key={'thursday-box'}
            display={'grid'}
            sx={{ gridTemplateColumns: '15% 50% 35%', alignItems: 'center', rowGap: 1, columnGap: 2 }}
            pt={4}
          >
            <Typography gridColumn={1} gridRow={1}>
              Jueves
            </Typography>
            {thursdays.map((select, index) => (
              <SelectDisponibility
                key={select.id}
                name={`jueves.${index}.horario`}
                addSelect={() => appendThursday({ horario: '' })}
                index={index}
                opciones={getIntervalsTime({ values: getValues().jueves })}
                deleteSelect={() => removeThursday(index)}
                copySchedules={() => copySchedules('jueves')}
                setCalendar={() => refreshCalendar()}
              />
            ))}
          </Box>

          <Box
            key={'friday-box'}
            display={'grid'}
            sx={{ gridTemplateColumns: '15% 50% 35%', alignItems: 'center', rowGap: 1, columnGap: 2 }}
            pt={4}
          >
            <Typography gridColumn={1} gridRow={1}>
              Viernes
            </Typography>
            {fridays.map((select, index) => (
              <SelectDisponibility
                key={select.id}
                name={`viernes.${index}.horario`}
                addSelect={() => appendFriday({ horario: '' })}
                index={index}
                opciones={getIntervalsTime({ values: getValues().viernes })}
                deleteSelect={() => removeFriday(index)}
                copySchedules={() => copySchedules('viernes')}
                setCalendar={() => refreshCalendar()}
              />
            ))}
          </Box>

          <Box
            key={'saturday-box'}
            display={'grid'}
            sx={{ gridTemplateColumns: '15% 50% 35%', alignItems: 'center', rowGap: 1, columnGap: 2 }}
            pt={4}
          >
            <Typography gridColumn={1} gridRow={1}>
              Sábado
            </Typography>
            {saturdays.map((select, index) => (
              <SelectDisponibility
                key={select.id}
                name={`sabado.${index}.horario`}
                addSelect={() => appendSaturday({ horario: '' })}
                index={index}
                opciones={getIntervalsTime({ values: getValues().sabado })}
                deleteSelect={() => removeSaturday(index)}
                copySchedules={() => copySchedules('sabado')}
                setCalendar={() => refreshCalendar()}
              />
            ))}
          </Box>

          <Box display={'flex'} justifyContent={'flex-end'} mt={4}>
            <Button type="submit" variant="contained" sx={{ textTransform: 'capitalize' }}>
              Guardar
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default CreateDisponibilityForm;
