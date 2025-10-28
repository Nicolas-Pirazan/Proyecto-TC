import { useGetAvailableDates, useGetDisponibilitiesbyDate, useRescheduleOrCancelClass } from '@/api/schedule';
import { AvailableDate, DisponibilidadxDate, FetchDatesParams, FetchDisponibilitiesByDate, RescheduleOrCancelClass } from '@/types/schedule';
import { useEffect, useState } from 'react';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const useRescheduleOrCancelClassForm = ({ idClase, idCursoEstudiante, idEstudiante }: { idClase: number, idCursoEstudiante: number, idEstudiante: number }) => {

    //Llamados a API
    const { data: diasDisponibles, mutate: obtenerDiasDisponibles, isLoading: cargandoDiasDisponibles } = useGetAvailableDates();
    const { data: disponibilidadesXDia, mutate: obtenerDisponibilidadesXDia, isLoading: cargandoDisponibilidadesXDia } = useGetDisponibilitiesbyDate();
    const { mutate: guardarRegistro, isLoading: guardandoRegistro, isSuccess: guardadoExitoso, isError: errorGuardado } = useRescheduleOrCancelClass();

    //Estados
    const [availableDates, setAvailableDates] = useState<Date[]>([]);
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [disponibilityXDate, setDisponibilityXDate] = useState<DisponibilidadxDate[]>([]);
    const [selectedDisponibilidad, setSelectedDisponibilidad] = useState<DisponibilidadxDate | null>(null);
    const [showAlert, setShowAlert] = useState(true);

    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());

    //Use effect

    useEffect(() => {
        if (currentMonth !== null) {

            const result = [];
            for (let i = 0; i < 3; i++) {
                const newDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
                const year = newDate.getFullYear();
                const month = newDate.getMonth() + 1;
                const formattedDate = `${year}-${month.toString().padStart(2, '0')}-01`;
                result.push(formattedDate);
            }
            var dateString = result.join(',');
            const params: FetchDatesParams = {
                fechas: dateString
            };
            obtenerDiasDisponibles(params);
        }
    }, []);

    useEffect(() => {

        if (!cargandoDiasDisponibles && diasDisponibles?.entity) {
            const dates = diasDisponibles.entity.map((item: AvailableDate) => new Date(item.dias));
            setAvailableDates(dates);
            console.log('Updated disabledDates:', dates);
        }
    }, [diasDisponibles, cargandoDiasDisponibles]);

    useEffect(() => {
        if (!cargandoDisponibilidadesXDia && disponibilidadesXDia?.entity) {
            console.log('Updated disabledDates:', disponibilidadesXDia?.entity);
            setDisponibilityXDate(disponibilidadesXDia?.entity);
        }
    }, [disponibilidadesXDia, cargandoDisponibilidadesXDia]);

    //Funciones
    const handleSelectDisponibilidad = (disponibilidad: DisponibilidadxDate) => {
        setSelectedDisponibilidad(disponibilidad);
    };

    const isSelected = (disponibilidad: DisponibilidadxDate) => {
        return selectedDisponibilidad && selectedDisponibilidad.id_disponibilidad === disponibilidad.id_disponibilidad;
    };


    const handleMonthChange = (value: Date) => {
        const newMonth = value.getMonth();
        console.log('Changing month to:', newMonth + 1);
        setCurrentMonth(newMonth + 1);
    };

    const isTileDisabled = ({ date }: { date: Date }) => {

        const dates = availableDates.some(availabledDate => availabledDate.getTime() === date.getTime());
        return !dates;
    };

    const shouldDisableDate = (date: Date) => {
        const isDisabled = availableDates.every(disponibilidad => {
            const disponibilidadDate = new Date(disponibilidad);
            return (
                date.getDate() !== disponibilidadDate.getDate() ||
                date.getMonth() !== disponibilidadDate.getMonth() ||
                date.getFullYear() !== disponibilidadDate.getFullYear()
            );
        });
        return isDisabled;
    };

    const handleDateChange = async (value: Value) => {
        setSelectedDate(value instanceof Date ? value : (Array.isArray(value) ? value[0] : null));
        console.log('Fecha seleccionada:', value);

        const param: FetchDisponibilitiesByDate = {
            date: (value instanceof Date ? value : new Date()).toISOString()
        };
        await obtenerDisponibilidadesXDia(param);
        setSelectedDisponibilidad(null);
        // Aquí puedes realizar la consulta adicional a la otra API usando la fecha seleccionada
    };


    const handleNavigationLabelClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault(); // Evitar que se realice la acción por defecto al hacer clic en el nombre del mes
        e.stopPropagation();
    };

    const reprogramar = () => {
        const request: RescheduleOrCancelClass = {
            accion: 1, // 1 - reprogramar
            consecutivo_curso_estudiante: idCursoEstudiante,
            id_clase: idClase,
            id_agenda: selectedDisponibilidad?.id_disponibilidad ? selectedDisponibilidad?.id_disponibilidad : 0,
            comentario: 'Nueva clase',
            fecha_hora_solicitud: new Date,
            usuario_modificacion: ''
        };

        guardarRegistro(request);
        if (!guardandoRegistro) {
            setShowAlert(true);
        }
        setSelectedDisponibilidad(null);
        setDisponibilityXDate([]);
        // redirect(`/calendario/clases/consultar/${idEstudiante}`);
    };

    const cancelar = () => {
        const request: RescheduleOrCancelClass = {
            accion: 2, // 1 - reprogramar
            consecutivo_curso_estudiante: 0,
            id_clase: idClase,
            id_agenda: 0,
            comentario: 'Clase cancelada',
            fecha_hora_solicitud: new Date,
            usuario_modificacion: ''
        };

        guardarRegistro(request);
        if (!guardandoRegistro) {
            setShowAlert(true);
        }
        setSelectedDisponibilidad(null);
        setDisponibilityXDate([]);
        // redirect(`/calendario/clases/consultar/${idEstudiante}`);
    };

    const handleMonthChangeComplete = () => {
        console.log('complete');
    };

    return {
        cargandoDiasDisponibles, today, maxDate, shouldDisableDate, handleMonthChangeComplete,
        selectedDate, disponibilityXDate, selectedDisponibilidad,
        cargandoDisponibilidadesXDia, guardandoRegistro,
        guardar: reprogramar, handleNavigationLabelClick, handleDateChange, isTileDisabled,
        handleMonthChange, isSelected, handleSelectDisponibilidad,
        showAlert,
        setShowAlert, guardadoExitoso, errorGuardado, cancelar
    };

};