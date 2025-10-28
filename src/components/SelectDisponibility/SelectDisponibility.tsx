import React from 'react';
import { ISelectDisponibilityProps } from '@/types/schedule';
import { SelectElement } from 'react-hook-form-mui';
import { Box, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const SelectDisponibility = ({
  addSelect,
  deleteSelect,
  index,
  name,
  opciones,
  setCalendar,
  copySchedules,
}: ISelectDisponibilityProps) => {
  return (
    <>
      <SelectElement
        name={name}
        options={opciones}
        size="small"
        sx={{ gridColumn: 2 }}
        onChange={() => setCalendar()}
      />

      <Box display={'flex'} justifyContent={'flex-start'} gap={1} gridColumn={3} gridRow={index + 1}>
        <IconButton
          aria-label="delete-time"
          onClick={() => {
            deleteSelect();
            setCalendar();
          }}
        >
          <DeleteOutlineIcon />
        </IconButton>
        {index === 0 && (
          <IconButton aria-label="add-time" onClick={() => addSelect()}>
            <AddCircleOutlineIcon />
          </IconButton>
        )}
        {index === 0 && (
          <IconButton aria-label="copy-time" onClick={() => copySchedules()}>
            <ContentCopyIcon />
          </IconButton>
        )}
      </Box>
    </>
  );
};

export default SelectDisponibility;
