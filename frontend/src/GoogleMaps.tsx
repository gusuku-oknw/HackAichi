// src/GoogleMap.tsx
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Box, AppBar, Toolbar, TextField, Button } from '@mui/material';

const containerStyle = {
    width: '100%',
    height: '400px',
};

interface MapProps {
    center: {
        lat: number;
        lng: number;
    };
}

const Map: React.FC<MapProps> = ({ center }) => {
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('検索クエリ送信');
        // 検索ロジックをここに追加
    };

    return (
        <Box>
            {/* トップバーをここに統合 */}
            <AppBar position="static">
                <Toolbar>
                    <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%' }}>
                        <TextField
                            variant="outlined"
                            placeholder="Find a nearby cafe"
                            fullWidth
                            style={{ backgroundColor: 'white', borderRadius: 4 }}
                        />
                        <Button type="submit" color="inherit" variant="contained" style={{ marginLeft: 10 }}>
                            Search
                        </Button>
                    </form>
                </Toolbar>
            </AppBar>

            {/* 地図表示 */}
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
                    {/* マーカー */}
                    <Marker position={center} />
                </GoogleMap>
            </LoadScript>
        </Box>
    );
};

export default Map;
