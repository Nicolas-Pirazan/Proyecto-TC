import React, { useContext, useState } from 'react';
import { FormContainer } from 'react-hook-form-mui';
import { IAssingDisponibility, IDisponibility } from '@/types/schedule';
import { useAssignDisponibility } from '@/api/schedule';
import { DisponibilityContext } from '@/context/useDisponibility';
import CreateDisponibilityForm from '@/components/CreateDisponibilityForm';
import AlertNotification from '@/components/Alert';
import Spinner from '@/components/Spinner';

const DisponibilidadForm = ({ idUsuario }: { idUsuario: number }) => {
  const { state } = useContext(DisponibilityContext);
  const [showAlert, setShowAlert] = useState(true);
  const { mutate, isLoading, isError, isSuccess } = useAssignDisponibility();

  const onSubmit = () => {
    console.log('DATA CONTEXT:', state);
    const data: IAssingDisponibility = {
      id_profesor: idUsuario,
      id_tipo_clase: 2,
      disponibilidad:
        state.dataCalendar?.map(item => {
          const disponibility: IDisponibility = {
            fechaInicial: item.start as Date,
            fechaFinal: item.end as Date,
          };
          return disponibility;
        }) || [],
      usuario_creacion: '',
    };

    mutate(data);

    if (!isLoading) {
      setShowAlert(true);
    }
  };

  return (
    <>
      <FormContainer
        onSuccess={onSubmit}
        defaultValues={{
          desde: undefined,
          hasta: undefined,
          lunes: [{ horario: '' }],
          martes: [{ horario: '' }],
          miercoles: [{ horario: '' }],
          jueves: [{ horario: '' }],
          viernes: [{ horario: '' }],
          sabado: [{ horario: '' }],
        }}
      >
        <CreateDisponibilityForm />
      </FormContainer>
      <AlertNotification
        key="alerta-guardado-exitoso"
        isOpen={showAlert && isSuccess}
        onClose={() => setShowAlert(false)}
        severity="success"
        message="¡Clases asignadas con éxito!"
      />

      <AlertNotification
        key="alerta-error-guardado"
        isOpen={showAlert && isError}
        onClose={() => setShowAlert(false)}
        severity="error"
        message="¡Ocurrió un error al asignar las clases!"
      />
      <Spinner isOpen={isLoading} />
    </>
  );
};

export default DisponibilidadForm;
