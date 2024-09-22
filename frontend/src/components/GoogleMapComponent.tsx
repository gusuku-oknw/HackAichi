import React, { useState, useEffect } from 'react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { Box, AppBar, Toolbar, TextField, Button, CircularProgress } from '@mui/material';
import { sendApiRequest } from '../api';
import { useStyles } from '../styles/useStyles';
import { Store } from './types';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_API_KEY ?? '';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: "greedy",
};

interface GoogleMapComponentProps {
    stores: Store[];
    onMarkerClick: (store: Store) => void;
    updateStores: (newStores: Store[]) => void;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ stores, onMarkerClick, updateStores }) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const classes = useStyles();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    useEffect(() => {
        if (map && stores.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            stores.forEach(({ location }) => bounds.extend({
                lat: location.lat,
                lng: location.lng
            }));
            map.fitBounds(bounds);
        }
    }, [map, stores]);

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const nagoyaStationLocation = {
            lat: 35.170915,
            lng: 136.881537,
        };

        try {
            const result = await sendApiRequest(
                '/store-search',
                0,
                searchQuery,
                nagoyaStationLocation,
                ''
            );

            if (Array.isArray(result)) {
                updateStores(result);
            } else {
                console.error('APIから予期しない形式のデータが返されました');
                updateStores(stores);
            }
        } catch (error) {
            console.error('検索エラー:', error);
            updateStores(stores);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded) {
        return <Box display="flex" justifyContent="center" alignItems="center" height="400px"><CircularProgress /></Box>;
    }

    return (
        <Box style={{ color: '#ffffff' }}>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar style={{ padding: '0 16px' }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%' }}>
                        <TextField
                            variant="outlined"
                            placeholder="Find a nearby cafe"
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 4,
                                marginRight: '10px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            }}
                            InputProps={{
                                style: {
                                    height: '40px',
                                    paddingLeft: '10px',
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            className={classes.button}
                        >
                            Search
                        </Button>
                    </form>
                </Toolbar>
            </AppBar>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                    <CircularProgress />
                </Box>
            ) : (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    options={mapOptions}
                    onLoad={(map) => setMap(map)}
                >
                    {stores.map(store => (
                        <MarkerF
                            key={store.id}
                            position={{
                                lat: store.location.lat,
                                lng: store.location.lng
                            }}
                            label={store.name}
                            onClick={() => onMarkerClick(store)}
                        />
                    ))}
                </GoogleMap>
            )}
        </Box>
    );
};

export default GoogleMapComponent;
