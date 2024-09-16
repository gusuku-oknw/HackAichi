// src/Profile.tsx
import React from 'react';
import { Paper, Typography } from '@mui/material';

const Profile: React.FC = () => {
    return (
        <Paper style={{ padding: 16, marginTop: 16 }}>
            <Typography variant="h6">Profile</Typography>
            <Typography variant="body1">This is your profile information.</Typography>
        </Paper>
    );
};

export default Profile;
