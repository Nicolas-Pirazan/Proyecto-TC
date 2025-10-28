import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { TransitionProps } from '@mui/material/transitions';
import * as React from 'react';
import CancelClassForm from './CancelClassForm';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface ModalCancelFormProps {
    buttonText: string;
    idClase: number;
    idCursoEstudiante: number;
    idEstudiante: number;
    fechaHoraInicio: string;
    fechaHoraFin: string;
}

const ModalCancelForm = ({ 
    buttonText, 
    idClase, 
    idCursoEstudiante, 
    idEstudiante, 
    fechaHoraInicio, 
    fechaHoraFin 
}: ModalCancelFormProps) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                {buttonText}
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Cancelar clase {fechaHoraInicio} - {fechaHoraFin}
                        </Typography>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <CancelClassForm 
                    idClase={idClase} 
                    idCursoEstudiante={idCursoEstudiante} 
                    idEstudiante={idEstudiante}
                    fechaHoraInicio={fechaHoraInicio}
                    onClose={handleClose}
                />
            </Dialog>
        </>
    );
};

export default ModalCancelForm;