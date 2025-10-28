import { useAssignClass, useGetStudentsAssigning, useRescheduleOrCancelClass } from '@/api/schedule';
import { CalendarSelectedEvent } from '@/types/calendar';
import { StudentsAssigning } from '@/types/schedule';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Slide, SlideProps, TextField, Toolbar, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import * as React from 'react';
import { useEffect, useState } from 'react';
import ModalSelectEvent from './ModalSelectEvent';

interface ModalCreateClassFormAdminProps {
  open: boolean;
  handleClose: () => void;
  selectedEvent: CalendarSelectedEvent;
}

const Transition = React.forwardRef(function Transition(
  props: SlideProps,
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const ModalCreateClassFormAdminOneStudent = ({ open, handleClose, selectedEvent }: ModalCreateClassFormAdminProps) => {
  const { data: estudiantes, isLoading: cargandoEstudiantes } = useGetStudentsAssigning();
  const options = estudiantes?.entity || [];
  const { mutate: assignMutate, isLoading: isAssignLoading, isSuccess: isAssignSuccess } = useAssignClass();
  const { mutate: cancelMutate, isLoading: isCancelLoading, isSuccess: isCancelSuccess } = useRescheduleOrCancelClass();

  const [selectedStudent, setSelectedStudent] = useState<StudentsAssigning | null>(null);
  const [cancelComment, setCancelComment] = useState<string>('');
  const [confirmCancelOpen, setConfirmCancelOpen] = useState<boolean>(false);

  const [confirmReassignOpen, setConfirmReassignOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [reassignComment, setReassignComment] = useState('');
  const isReassignLoading = false;
  const [isSelectEventModalOpen, setIsSelectEventModalOpen] = useState(false);
  const isStudentAssigned = selectedEvent.estudiante.length > 0;

  useEffect(() => {
    if (selectedEvent.estudiante) {
      const studentName = selectedEvent.estudiante.trim();
      const student = options.find(option => {
        const optionName = option.estudiante.split(' - ')[1]?.trim();
        return optionName === studentName;
      });
      setSelectedStudent(student || null);
    }
  }, [selectedEvent.estudiante, options]);

  const handleCreateClass = () => {
    if (selectedStudent) {
      if (selectedStudent.cantidad_clases > 0) {
        createClass(selectedEvent, selectedStudent.id_curso_estudiante);
      } else {
        alert('El estudiante no tiene clases disponibles para asignar.');
      }
    } else {
      alert('Seleccione un estudiante antes de crear la clase');
    }
  };

  const createClass = (event: CalendarSelectedEvent, studentId: number) => {
    const newData = {
      listado_disponibilidad: [parseInt(event.id)],
      consecutivo_curso_estudiante: studentId,
      usuario_creacion: 'Administrador',
    };

    assignMutate(newData);
  };

  useEffect(() => {
    if (isAssignSuccess) {
      alert('Clase creada correctamente');
      handleClose();
    }
  }, [isAssignSuccess, handleClose]);

  const handleCancelClass = () => {
    const newData = {
      accion: 2,
      consecutivo_curso_estudiante: selectedStudent?.id_curso_estudiante || 0,
      id_clase: selectedEvent.id_clase,
      id_agenda: selectedEvent.id_agenda,
      comentario: cancelComment,
      fecha_hora_solicitud: new Date(),
      usuario_modificacion: '',
    };

    cancelMutate(newData);
  };

  useEffect(() => {
    if (isCancelSuccess) {
      alert('Clase cancelada correctamente');
      handleClose();
    }
  }, [isCancelSuccess, handleClose]);

  const handleReassignClass = () => {
    setIsReassignModalOpen(false);
  };

  const handleModalSelectClose = () => {
    setIsSelectEventModalOpen(false);
    handleClose(); 
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth={true}
        PaperProps={{
          style: {
            height: '50vh',
            maxHeight: '50vh',
            padding: '16px',
          }
        }}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6">
              Detalles de la Clase
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ padding: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Estudiante:</strong> {selectedEvent.estudiante.length === 0 ? 'Sin asignar' : selectedEvent.estudiante}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Profesor:</strong> {selectedEvent.profesor}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Horario de clase:</strong> {formatDateTime(selectedEvent.start, selectedEvent.end)}
          </Typography>
          {selectedStudent && (
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Clases disponibles para asignar: {selectedStudent.cantidad_clases}
            </Typography>
          )}

          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={options || []}
            getOptionLabel={(option) => option.estudiante || ''}
            sx={{ width: '100%', marginBottom: '16px' }}
            value={selectedStudent}
            onChange={(event, value) => setSelectedStudent(value)}
            renderInput={(params) => <TextField {...params} label="Seleccione un estudiante" variant="outlined" />}
            isOptionEqualToValue={(option, value) => {
              const optionName = option.estudiante.split(' - ')[1]?.trim();
              const valueName = value?.estudiante.split(' - ')[1]?.trim();
              return optionName === valueName;
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleCreateClass}
                disabled={isAssignLoading || isStudentAssigned} 
              >
                {isAssignLoading ? 'Creando...' : 'Crear Clase'}
              </Button>
              <Button
                variant="contained"
                disabled={!isStudentAssigned} 
                onClick={() => {}}
              >
                Modificar
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                disabled={!isStudentAssigned} 
                onClick={() => setIsSelectEventModalOpen(true)}
              >
                Reasignar
              </Button>
              <Button
                variant="outlined"
                color="error"
                disabled={!isStudentAssigned || isCancelLoading} 
                onClick={() => setConfirmCancelOpen(true)}
              >
                {isCancelLoading ? 'Cancelando...' : 'Cancelar Clase'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>

      <Dialog open={confirmReassignOpen} onClose={() => setConfirmReassignOpen(false)}>
        <DialogTitle>Confirmar Reasignación</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Comentario"
            multiline
            rows={4}
            value={reassignComment}
            onChange={(e) => setReassignComment(e.target.value)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <Button onClick={() => setConfirmReassignOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleReassignClass} disabled={isReassignLoading}>
              {isReassignLoading ? 'Reasignando...' : 'Confirmar Reasignación'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <ModalSelectEvent
        open={isSelectEventModalOpen}
        handleClose={handleModalSelectClose} 
        selectedEvent={selectedEvent} 
        consecutivo_curso_estudiante={selectedStudent?.id_curso_estudiante || 0}        
      />

    <Dialog
        open={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        maxWidth="sm"
        fullWidth={true}
      >
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Confirmar Cancelación
          </Typography>
          <TextField
            label="Comentario (opcional)"
            variant="outlined"
            fullWidth
            value={cancelComment}
            onChange={(e) => setCancelComment(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setConfirmCancelOpen(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleCancelClass} color="error" variant="contained">
              Confirmar Cancelación
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

const formatDateTime = (startDateTime: string, endDateTime: string) => {
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);

  const dateFormatter = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const timeFormatter = new Intl.DateTimeFormat('es-ES', {
    hour: 'numeric',
    minute: 'numeric',
  });

  const startDateFormatted = `${dateFormatter.format(startDate)} a las ${timeFormatter.format(startDate)}`;
  const endDateFormatted = `${timeFormatter.format(endDate)}`;

  return `${startDateFormatted} - ${endDateFormatted}`;
};

export default ModalCreateClassFormAdminOneStudent;

