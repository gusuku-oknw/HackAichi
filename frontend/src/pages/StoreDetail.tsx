import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useStyles } from '../styles/useStyles'; // スタイルをインポート
import { sendApiRequest } from '../api'; // API送信関数をインポート

interface StoreDetailProps {
    store: {
        id: number;
        name: string;
        location: {
            lat: number;
            lng: number;
        };
    } | null;
}

const StoreDetail: React.FC<StoreDetailProps> = ({ store }) => {
    const [message, setMessage] = useState(''); // メッセージの状態管理
    const [apiResponse, setApiResponse] = useState<string | null>(null); // APIからのレスポンスを管理
    const [loading, setLoading] = useState(false); // API送信中の状態を管理
    const classes = useStyles(); // スタイルの使用

    if (!store) {
        return <p>店舗が選択されていません。</p>;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!message.trim()) return; // メッセージが空白の場合は送信しない

        try {
            setLoading(true);
            const response = await sendApiRequest('store-details', store.id, store.name, store.location, message); // 関数名を修正
            console.log('送信成功:', response);
            setApiResponse(`店舗ID: ${response.storeId}, メッセージ: ${response.message}`);
            setMessage(''); // メッセージ送信後にフィールドをクリア
        } catch (error) {
            console.error('送信失敗:', error);
            setApiResponse('エラーが発生しました');
        } finally {
            setLoading(false); // ローディング状態を終了
        }
    };


    return (
        <Paper className={classes.profileContainer}>
            {/* 店舗の詳細情報 */}
            <Box className={classes.profileHeader}>
                <Typography variant="h6">{store.name} の詳細情報</Typography>
            </Box>

            <Box className={classes.profileContent}>
                <Typography variant="body1">
                    場所: {store.location.lat}, {store.location.lng}
                </Typography>
                {/* 他の詳細情報をここに追加できます */}

                {/* テキスト入力欄と送信ボタン */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    <TextField
                        label="メッセージを入力してください"
                        variant="outlined"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        fullWidth
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ alignSelf: 'flex-start' }}
                        disabled={loading}
                    >
                        {loading ? '送信中...' : '送信'}
                    </Button>
                </form>

                {/* APIレスポンスの表示 */}
                {apiResponse && (
                    <Box marginTop={2}>
                        <Typography variant="body1" color="secondary">
                            {apiResponse}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default StoreDetail;
