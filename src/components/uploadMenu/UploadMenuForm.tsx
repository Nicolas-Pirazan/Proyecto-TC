import { IFile } from '@/types/files';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Grid } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

export function UploadMenuForm({ onSubmit }: { onSubmit: (formData: FormData) => void }) {
  const { handleSubmit, control } = useForm<IFile>();

  const handleFileUpload = async (data: IFile) => {
    if (data.file.length > 0) {
      const file = data.file[0];
      const formData = new FormData();
      formData.append('file', file);
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFileUpload)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="file"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => field.onChange(e.target.files)}
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ textTransform: 'capitalize' }}
          >
            Subir archivo
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
