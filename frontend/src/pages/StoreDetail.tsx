import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, AppBar, Toolbar, IconButton, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import logo from '../styles/logo.png'
import NoStoreSelected from "./NoStoreSelected";
import { useStyles } from '../styles/useStyles';
import { sendApiRequest } from '../api';

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

const buttons = [
    "テーブルが広い席はありますか？",
    "ソファーや快適な椅子はありますか？",
    "窓際や自然光が入る席はありますか？",
    "利用されている年齢層の方はどれくらいですか？"
];

const StoreDetail: React.FC<StoreDetailProps> = ({ store }) => {
    const [message, setMessage] = useState('');
    const [apiResponse, setApiResponse] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const classes = useStyles();

    if (!store) {
        return <NoStoreSelected />
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!message.trim()) return;

        try {
            setLoading(true);
            const response = await sendApiRequest('/store-details', store.id, store.name, store.location, message);
            console.log('送信成功:', response);
            setApiResponse(`店舗ID: ${response.storeId}, メッセージ: ${response.message}`);
            setMessage('');
        } catch (error) {
            console.error('送信失敗:', error);
            setApiResponse('エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    const handleButtonClick = (text: string) => {
        setMessage(text);
    };

    const handleBackClick = () => {
        window.location.reload(); // ページをリロード
    };

    return (
        <Paper className={classes.profileContainer}>
            <AppBar className={classes.appBar} position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="back" className={classes.backButton} onClick={handleBackClick}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {store.name}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box className={classes.logoContainer}>
                <img src={logo} alt="Cafe Logo" className={classes.logo} />
            </Box>

            <Box className={classes.profileHeader}>
                <Typography variant="h6">{store.name} の詳細情報</Typography>
            </Box>

            <Box className={classes.profileContent}>
                <Typography variant="body1">
                    場所: {store.location.lat}, {store.location.lng}
                </Typography>

                <Grid container spacing={2} justifyContent="center" className={classes.buttonContainer}>
                    {buttons.map((text, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Button
                                fullWidth
                                variant="contained"
                                className={classes.button} // コーヒーテーマのボタンスタイルを適用
                                onClick={() => handleButtonClick(text)}
                            >
                                {text}
                            </Button>
                        </Grid>
                    ))}
                </Grid>

                <form onSubmit={handleSubmit} className={classes.form}>
                    <TextField
                        label="メッセージを入力してください"
                        variant="outlined"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        fullWidth
                        disabled={loading}
                        className={classes.searchBar} // コーヒーテーマのテキストフィールドスタイルを適用
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        className={classes.button} // コーヒーテーマのボタンスタイルを適用
                        disabled={loading}
                    >
                        {loading ? '送信中...' : '送信'}
                    </Button>
                </form>

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
