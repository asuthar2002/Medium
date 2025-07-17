import { useForm } from 'react-hook-form';
import { TextField, Button, Box } from '@mui/material';

export default function PostForm({ onSubmit, defaultValues = {}, loading }) {
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2, maxWidth: 500 }}>
            <TextField label="Heading" fullWidth    {...register('heading', { required: 'Heading is required' })} error={!!errors.heading} helperText={errors.heading?.message} sx={{ mb: 2 }} />
            <TextField label="Content" multiline rows={5} fullWidth    {...register('content', { required: 'Content is required' })} error={!!errors.content} helperText={errors.content?.message} sx={{ mb: 2 }} />
            <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
            </Button>
        </Box>
    );
}
