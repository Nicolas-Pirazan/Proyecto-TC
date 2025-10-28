import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';

export const LogoStyled = styled(Image)(({ theme }) => ({
  width: 'auto',
  height: '55px',
  [theme.breakpoints.down('md')]: {
    height: '45px',
    flexGrow: 1,
  },
}));

export const LinkStyled = styled(Link)(({ theme }) => ({
  outline: 0,
  textDecoration: 'none',
  fontFamily: theme.typography.fontFamily,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'flex-end',
  lineHeight: 1.1,
  color: theme.palette.grey[500],
  '&.active': { color: theme.palette.info.main },
  '&:hover': { color: theme.palette.primary.main },
}));
