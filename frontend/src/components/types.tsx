// types.ts
export interface Store {
    id: number;
    name: string;
    location: {
        lat: number;
        lng: number;
    };
    imageUrl: string; // 店舗の外観写真のURL
    description: string; // 店舗の概要
}


// App.tsxなどで使用
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
        location: { lat: 35.658, lng: 139.7016 },
        imageUrl: 'https://example.com/shibuya-station.jpg',
        description: '東京の中心、渋谷駅周辺の活気あるエリア。',
    },
];
