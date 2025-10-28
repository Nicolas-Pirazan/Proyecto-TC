'use client';
import { useGetUserCourse, useGetUserDetail } from '@/api/users';
import CreateClassForm from '@/components/CreateClassForm';
import { Box, Grid, Paper, Typography } from '@mui/material';

const CreateClassPage = ({ params }: { params: { id_estudiante: number } }) => {
    const { data: userCourseData, isLoading: userCourseDataIsLoading } = useGetUserCourse(params.id_estudiante);
    const { data: userData, isLoading: userdataIsLoading } = useGetUserDetail(params.id_estudiante);

    const getUserData = () => {
        if (!userData?.entity || !Array.isArray(userData.entity) || userData.entity.length === 0) {
            return { name: '', last_name: '', run: '' };
        }
        return userData.entity[0];
    };

    const getUserCourseData = () => {
        if (!userCourseData?.entity || !Array.isArray(userCourseData.entity) || userCourseData.entity.length === 0) {
            return { course: '', id_student_course: 0 };
        }
        return userCourseData.entity[0];
    };

    const safeUserData = getUserData();
    const safeUserCourseData = getUserCourseData();

    return (
        <>
            <Grid container spacing={2} padding={3}>
                <Grid item xs={12}>
                    <Paper
                        sx={{ padding: 4, borderRadius: 2, minHeight: '100%', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
                        variant="outlined"
                    >
                        <Typography variant="h5" color="primary" fontWeight={600} mb={2}>
                            Asignar clase (page)
                        </Typography>
                        
                        <Box padding={'0 0 20px 0'} display={'flex'}>
                            <Typography fontWeight={'600'} marginRight={1}>
                                Estudiante:
                            </Typography>
                            <Typography>
                                {safeUserData.name && safeUserData.last_name 
                                    ? `${safeUserData.name} ${safeUserData.last_name}` 
                                    : '-'
                                }
                            </Typography>
                        </Box>
                        
                        <Box padding={'0 0 20px 0'} display={'flex'}>
                            <Typography fontWeight={'600'} marginRight={1}>
                                Run:
                            </Typography>
                            <Typography>
                                {safeUserData.run || '-'}
                            </Typography>
                        </Box>
                        
                        <Box padding={'0 0 20px 0'} display={'flex'}>
                            <Typography fontWeight={'600'} marginRight={1}>
                                Curso del estudiante:
                            </Typography>
                            <Typography>
                                {safeUserCourseData.course || '-'}
                            </Typography>
                        </Box>
                        
                        <CreateClassForm 
                            idCursoEstudiante={safeUserCourseData.id_student_course || 0} 
                        />
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default CreateClassPage;