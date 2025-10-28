import { styled } from '@mui/material/styles';
import Link from 'next/link';

export const LinkStyled = styled(Link)(() => ({
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flex: 1,
  color: 'inherit',
}));
