import React, { useState, useEffect } from 'react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { Box, AppBar, Toolbar, TextField, Button } from '@mui/material';
import { sendApiRequest } from '../api';
import { useStyles } from '../styles/useStyles';
import { Store } from './types'; // ここで types.ts から Store をインポート

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_API_KEY ?? '';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: "greedy", // これで一本指で地図を動かせるようになる
};

interface GoogleMapComponentProps {
    stores: Store[];
    onMarkerClick: (store: Store) => void;
    updateStores: (newStores: Store[]) => void;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ stores, onMarkerClick, updateStores }) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const classes = useStyles();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    useEffect(() => {
        if (map && stores.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            stores.forEach(({ location }) => bounds.extend(location));
            map.fitBounds(bounds);
        }
    }, [map, stores]);

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // 名古屋駅の座標
        const nagoyaStationLocation = {
            lat: 35.170915,
            lng: 136.881537,
        };

        try {
            const result = await sendApiRequest(
                'store-search',
                0,
                searchQuery,
                nagoyaStationLocation, // 名古屋駅の座標を送信
                ''
            );

            if (Array.isArray(result)) {
                updateStores(result); // 親コンポーネントのstoresを更新
            } else {
                console.error('APIから予期しない形式のデータが返されました');
                updateStores(stores); // 通信エラー時はダミーデータを使用
            }
        } catch (error) {
            console.error('検索エラー:', error);
            updateStores(stores); // 通信エラー時はダミーデータを使用
        }
    };

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <Box style={{color: '#ffffff'}}>
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
            <GoogleMap
                mapContainerStyle={containerStyle}
                options={mapOptions}
                onLoad={(map) => setMap(map)}
            >
                {stores.map(store => (
                    <MarkerF
                        key={store.id}
                        position={store.location}
                        label={store.name}
                        onClick={() => onMarkerClick(store)} // マーカーがクリックされたときにAPIリクエストを送信
                    />
                ))}
            </GoogleMap>
        </Box>
    );
};

export default GoogleMapComponent;
