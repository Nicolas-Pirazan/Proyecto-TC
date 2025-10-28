'use client';
import RescheduleOrCancelClassForm from '@/components/RescheduleOrCancelClassForm/RescheduleOrCancelClassForm';
import { Grid } from '@mui/material';


const ReasignarPage = ({ params }: { params: { id_clase: number, id_cursoestudiante: number, id_estudiante: number } }) => {

    return (
        <>
            <Grid container spacing={2} padding={3}>
                <Grid item xs={12}>
                    <RescheduleOrCancelClassForm idClase={params.id_clase} idCursoEstudiante={params.id_cursoestudiante} idEstudiante={params.id_estudiante} ></RescheduleOrCancelClassForm>
                </Grid>
            </Grid>

        </>
    );
};

export default ReasignarPage;
