import { createTheme } from '@mui/material/styles';
import {} from '@mui/material/colors';

const color = {
  primary: '#004983',
};

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: `${color.primary}`,
    },
    info: { main: '#0F72B8' },
    success: { main: '#89BD3E' },
    warning: { main: '#F6AA06' },
    error: { main: '#E84D53' },
    background: {
      default: '#F6F6F6',
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
        size: 'small',
      },
      variants: [
        {
          props: {
            variant: 'outlined',
          },
          style: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: '2px',
            },
          },
        },
      ],
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        style: { textTransform: 'capitalize' },
      },
    },
    MuiStepper: {
      variants: [
        {
          props: {
            orientation: 'horizontal',
          },
          style: {
            '& .MuiStepLabel-label': {
              fontWeight: 600,
              color: '#9D9D9D',
            },
            '& .MuiStepLabel-label.Mui-active': {
              fontWeight: 600,
              color: `${color.primary}`,
            },
            '& .MuiStepLabel-label.Mui-completed ': {
              fontWeight: 600,
              color: `${color.primary}`,
            },
          },
        },
      ],
    },
    MuiAppBar: {
      defaultProps: {
        variant: 'outlined',
        elevation: 0,
        sx: { background: 'white' },
      },
    },
  },
});

export default lightTheme;
