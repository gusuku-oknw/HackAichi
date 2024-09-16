// src/components/GoogleMapComponent.tsx
import React from 'react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { Store } from './types'; // Store型をインポート

interface GoogleMapComponentProps {
    stores: Store[]; // Store型の配列
    onMarkerClick: (store: Store) => void; // マーカークリック時に呼ばれる関数
}

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_API_KEY ?? '';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ stores, onMarkerClick }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={15}
            center={stores[0]?.location} // 初期のマップの中心
        >
            {stores.map((store) => (
                <MarkerF
                    key={store.id}
                    position={store.location}
                    label={store.name}
                    onClick={() => onMarkerClick(store)} // マーカークリック時の処理
                />
            ))}
        </GoogleMap>
    );
};

export default GoogleMapComponent;
