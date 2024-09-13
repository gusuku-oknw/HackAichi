// src/Calendar.tsx
import React from 'react';
import { Paper, Typography } from '@mui/material';

const Calendar: React.FC = () => {
    return (
        <Paper style={{ padding: 16, marginTop: 16 }}>
            <Typography variant="h6">Your Calendar</Typography>
            <Typography variant="body1">This is where your calendar will appear.</Typography>
        </Paper>
    );
};

export default Calendar;
