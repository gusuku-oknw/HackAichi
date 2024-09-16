// src/StoreDetail.tsx
import React from 'react';
import { Store } from '../components/types'; // Store型をインポート

interface StoreDetailProps {
    store: Store | null;
}

const StoreDetail: React.FC<StoreDetailProps> = ({ store }) => {
    if (!store) {
        return <p>店舗が選択されていません。</p>;
    }

    return (
        <div>
            <h1>{store.name} の詳細情報</h1>
            <p>場所: {store.location.lat}, {store.location.lng}</p>
            {/* 他の詳細情報をここに追加できます */}
        </div>
    );
};

export default StoreDetail;
