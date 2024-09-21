// src/api.ts
export const sendApiRequest = async (
    endpoint: string,
    storeId: number,
    storeName: string,
    location: { lat: number, lng: number },
    message: string
) => {
    try {
        const response = await fetch(`api/${endpoint}`, {
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
            throw new Error('APIリクエストに失敗しました');
        }

        const data = await response.json();
        console.log('APIからのレスポンス:', data);
        return data;
    } catch (error) {
        console.error('エラー:', error);
        throw error; // 必要に応じてエラーハンドリングを追加
    }
};
