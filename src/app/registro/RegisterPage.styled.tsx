import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

export const PaperStyled = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: `${theme.spacing(6)} ${theme.spacing(16)}`,
  borderRadius: theme.spacing(1),
  margin: `${theme.spacing(5)} 0`,

  [theme.breakpoints.down('md')]: {
    padding: `${theme.spacing(6)} ${theme.spacing(1)}`,
    borderRadius: theme.spacing(0),
    margin: 0,
  },
}));
