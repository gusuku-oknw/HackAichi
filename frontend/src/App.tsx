import React, { useState } from 'react';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { LocationOn, Info, AccountCircle } from '@mui/icons-material';
import StoreDetail from './pages/StoreDetail';
import Profile from './pages/Profile';
import GoogleMapComponent from './components/GoogleMapComponent';
import StoreListComponent from './components/StoreListComponent';
import { Store } from './components/types'; // Store型をインポート
import { useStyles } from './styles/useStyles';

// 初期の店舗データ
const initialStores: Store[] = [
    {
        id: 1,
        name: 'Cafe Mocha',
        location: { lat: 35.169108, lng: 136.882635 },
        imageUrl: 'https://example.com/cafe-mocha.jpg',
        description: 'クラシックな雰囲気の中で最高のモカが楽しめるカフェ。',
    },
    {
        id: 2,
        name: 'Latte Art Cafe',
        location: { lat: 35.173089791219695 , lng: 136.89013162195923 },
        imageUrl: 'https://example.com/latte-art-cafe.jpg',
        description: '芸術的なラテアートと共にゆったりとした時間を過ごせるカフェ。',
    },
    {
        id: 3,
        name: 'Nagoya Coffee House',
        location: { lat: 35.168901229643794,  lng: 136.87914283955078 },
        imageUrl: 'https://example.com/nagoya-coffee-house.jpg',
        description: '落ち着いた雰囲気で、歴史ある老舗のコーヒーを提供。',
    },
    {
        id: 4,
        name: 'Sunset Cafe',
        location: { lat: 35.17403392481538,  lng: 136.88553039183554 },
        imageUrl: 'https://example.com/sunset-cafe.jpg',
        description: '夕焼けを眺めながらリラックスできる、人気のカフェ。',
    },
    {
        id: 5,
        name: 'Green Leaf Cafe',
        location: { lat: 35.16400418239972,  lng: 136.8798283182625 },
        imageUrl: 'https://example.com/green-leaf-cafe.jpg',
        description: '自然に囲まれた心地よい空間で、オーガニックコーヒーを楽しめる。',
    },
];


function App() {
    const [value, setValue] = useState(0); // ページ切り替え用のstate
    const [selectedStore, setSelectedStore] = useState<Store | null>(null); // 選択されたストアの状態
    const [stores, setStores] = useState<Store[]>(initialStores); // 初期値としてダミーデータを設定
    const classes = useStyles();

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
                    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
                        <Box flexGrow={1} overflow="hidden">
                            <GoogleMapComponent stores={stores} onMarkerClick={handleMarkerClick} updateStores={updateStores} />
                        </Box>
                        <Box flexGrow={1} overflow="auto">
                            <StoreListComponent stores={stores} onSelectStore={handleMarkerClick} />
                        </Box>
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
        <Box display="flex" flexDirection="column" height="100vh" overflow="hidden">
            <Box flexGrow={1} overflow="hidden" style={{ marginTop: 16 }}>
                {renderPageContent()}
            </Box>

            {/* ボトムナビゲーションバー */}
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                className={classes.bottomNav}
                showLabels
            >
                <BottomNavigationAction label="Home" icon={<LocationOn />} className={classes.navAction} />
                <BottomNavigationAction label="Details" icon={<Info />} className={classes.navAction} />
                <BottomNavigationAction label="Profile" icon={<AccountCircle />} className={classes.navAction} />
            </BottomNavigation>
        </Box>
    );
}

export default App;
