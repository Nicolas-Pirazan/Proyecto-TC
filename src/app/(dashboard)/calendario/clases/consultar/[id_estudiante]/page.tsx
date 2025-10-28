'use client';
import StudentSchedule from '@/components/StudentSchedule';
import { Grid } from '@mui/material';


const StundentSchedulePage = ({ params }: { params: { id_estudiante: number } }) => {

    return (
        <>
            <Grid container spacing={2} padding={3}>
                <Grid item xs={12}>
                    <StudentSchedule id_estudiante={params.id_estudiante}></StudentSchedule>
                </Grid>
            </Grid>

        </>
    );
};

export default StundentSchedulePage;
