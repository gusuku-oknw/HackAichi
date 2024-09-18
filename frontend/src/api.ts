// src/api.ts
export const sendMessageToApi = async (
    storeId: number,
    storeName: string,
    location: { lat: number, lng: number },
    message: string
) => {
    try {
        const response = await fetch('http://localhost:5000/api/store-details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                storeId,
                storeName,
                location,
                message,
            }),
        });

        if (!response.ok) {
            throw new Error('メッセージ送信に失敗しました');
        }

        const data = await response.json();
        console.log('APIからのレスポンス:', data);
        return data;
    } catch (error) {
        console.error('エラー:', error);
        throw error; // 必要に応じてエラーハンドリングを追加
    }
};
