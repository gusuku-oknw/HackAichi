// src/App.tsx
import React, { useState } from 'react';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { LocationOn, CalendarToday, AccountCircle } from '@mui/icons-material';
import Calendar from './Calendar';
import Profile from './Profile';
import Map from './GoogleMaps';

const center = {
    lat: 35.681236,
    lng: 139.767125,
};

function App() {
    const [location, setLocation] = useState(center);
    const [value, setValue] = useState(0);

    const renderPageContent = () => {
        switch (value) {
            case 0:
                return <Map center={location} />;
            case 1:
                return <Calendar />;
            case 2:
                return <Profile />;
            default:
                return null;
        }
    };

    return (
        <Box>
            {/* トップバーを削除したので、ここには残りません */}

            <Box style={{ marginTop: 16 }}>{renderPageContent()}</Box>

            {/* ナビゲーションバー */}
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                style={{ position: 'fixed', bottom: 0, width: '100%' }}
            >
                <BottomNavigationAction label="Home" icon={<LocationOn />} />
                <BottomNavigationAction label="Calendar" icon={<CalendarToday />} />
                <BottomNavigationAction label="Profile" icon={<AccountCircle />} />
            </BottomNavigation>
        </Box>
    );
}

export default App;
