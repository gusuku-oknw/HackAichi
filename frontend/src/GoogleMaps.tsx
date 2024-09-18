// src/GoogleMap.tsx
import React, { useState, useEffect } from 'react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { Box, AppBar, Toolbar, TextField, Button } from '@mui/material';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_API_KEY ?? ''; // .envファイルからAPIキーを取得

const containerStyle = {
    width: '100%',
    height: '400px',
};

// 店舗情報のインターフェース
interface Store {
    id: number;
    name: string;
    location: {
        lat: number;
        lng: number;
    };
}

// サンプルの店舗データ
const initialStores: Store[] = [
    { id: 1, name: "cafe A", location: { lat: 35.1681309747295, lng: 136.88793880534848 } },
    { id: 3, name: "cafe C", location: { lat: 35.16924448264741, lng: 136.88569217069647 } },
];

// 地図の表示オプション
const mapOptions = {
    disableDefaultUI: true, // デフォルトのUIを無効化
    zoomControl: true, // ズームコントロールのみ表示
    // 一時的にスタイルを無効化
    // styles: [ ... ],
};

const Map: React.FC = () => {
    const [stores] = useState<Store[]>(initialStores);

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes("cafe") || store.name.toLowerCase().includes("station")
    );

    const [map, setMap] = useState<google.maps.Map | null>(null);

    useEffect(() => {
        if (map && filteredStores.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            filteredStores.forEach(({ location }) => bounds.extend(location));
            map.fitBounds(bounds);
        }
    }, [map, filteredStores]);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('検索クエリ送信');
        // 検索ロジックをここに追加
    };

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    console.log("Filtered Stores:", filteredStores);

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
            </AppBar>dd

            {/* 地図表示 */}
            <GoogleMap
                mapContainerStyle={containerStyle}
                options={mapOptions}
                onLoad={(map) => setMap(map)}
            >
                {/* フィルタリングされた店舗のみを地図上に表示 */}
                {filteredStores.map(store => {
                    console.log("Rendering marker for store:", store.name);
                    return (
                        <MarkerF key={store.id} position={store.location} label={store.name} />
                    );
                })}
            </GoogleMap>
        </Box>
    );
};

export default Map;