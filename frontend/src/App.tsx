import React, { useState } from 'react';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { LocationOn, Info, AccountCircle } from '@mui/icons-material';
import StoreDetail from './pages/StoreDetail';
import Profile from './pages/Profile';
import GoogleMapComponent from './components/GoogleMapComponent';
import StoreListComponent from './components/StoreListComponent';
import { Store } from './components/types'; // Store型をインポート

// 初期の店舗データ
const initialStores: Store[] = [
    {
        id: 1,
        name: 'Cafe A',
        location: { lat: 35.1681309747295, lng: 136.88793880534848 },
        imageUrl: 'https://example.com/cafe-a.jpg',
        description: '静かでリラックスできるカフェ。ワークスペースとして最適。',
    },
    {
        id: 2,
        name: 'Shibuya Station',
        location: { lat: 35.16637931862554, lng: 136.91247207890848 },
        imageUrl: 'https://example.com/shibuya-station.jpg',
        description: '名古屋の老舗の美味しい珈琲店です。',
    },
];

// 地図の初期位置
const center = {
    lat: 35.1681,
    lng: 136.8879,
};

function App() {
    const [value, setValue] = useState(0); // ページ切り替え用のstate
    const [selectedStore, setSelectedStore] = useState<Store | null>(null); // 選択されたストアの状態
    const [stores, setStores] = useState<Store[]>(initialStores); // 初期値としてダミーデータを設定

    // マーカーまたはリストアイテムがクリックされた際の処理
    const handleMarkerClick = (store: Store) => {
        setSelectedStore(store);
        setValue(1); // 詳細ページに移動
    };

    // GoogleMapComponentから渡されるAPIレスポンスを元に店舗リストを更新する
    const updateStores = (newStores: Store[]) => {
        setStores(newStores);
    };

    const renderPageContent = () => {
        switch (value) {
            case 0: // ホーム（マップとリスト）
                return (
                    <Box>
                        <GoogleMapComponent stores={stores} onMarkerClick={handleMarkerClick} updateStores={updateStores} />
                        <StoreListComponent stores={stores} onSelectStore={handleMarkerClick} />
                    </Box>
                );
            case 1: // 店舗の詳細情報
                return <StoreDetail store={selectedStore} />; // 詳細情報ページに選択されたストアを渡す
            case 2: // プロフィール
                return <Profile />;
            default:
                return null;
        }
    };

    return (
        <Box>
            <Box style={{ marginTop: 16 }}>{renderPageContent()}</Box>

            {/* ボトムナビゲーションバー */}
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                style={{ position: 'fixed', bottom: 0, width: '100%' }}
            >
                <BottomNavigationAction label="Home" icon={<LocationOn />} />
                <BottomNavigationAction label="Details" icon={<Info />} />
                <BottomNavigationAction label="Profile" icon={<AccountCircle />} />
            </BottomNavigation>
        </Box>
    );
}

export default App;
