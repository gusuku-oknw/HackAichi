import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, AppBar, Toolbar, IconButton, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MessageIcon from '@mui/icons-material/Message';
import InputAdornment from '@mui/material/InputAdornment';
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
            setApiResponse(response.message);
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

            <Box className={classes.logoContainer} mb={2} display="flex" justifyContent="center">
                <img src={logo} alt="Cafe Logo" className={classes.logo} />
            </Box>

            {apiResponse && (
                <Box
                    marginTop={2}    // 上部に余白を追加
                    padding={2}      // 内部パディングを設定
                    bgcolor="#f5f5f5"
                    borderRadius={8}
                    boxShadow={2}
                    display="flex"
                    alignItems="center"
                    marginBottom={2}  // 下部にも余白を追加
                >
                    <Box marginRight={2}>
                        <ChatBubbleOutlineIcon style={{ color: '#3f51b5', fontSize: '2rem' }} />
                    </Box>
                    <Typography variant="body1" color="textPrimary">
                        {apiResponse}
                    </Typography>
                </Box>
            )}

            <Box className={classes.profileHeader} px={3} py={2}>
                <Typography variant="h6" gutterBottom> {/* `gutterBottom`を追加して下部に余白を持たせる */}
                    {store.name} の詳細情報
                </Typography>
            </Box>


            <Box className={classes.profileContent} px={3} pb={3} textAlign="center">
                <Typography variant="body1" mb={2}>
                    場所: {store.location.lat}, {store.location.lng}
                </Typography>

                <Grid container spacing={2} justifyContent="center" className={classes.buttonContainer}>
                    {buttons.map((text, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <Button
                                fullWidth
                                variant="contained"
                                className={classes.button}
                                onClick={() => handleButtonClick(text)}
                            >
                                {text}
                            </Button>
                        </Grid>
                    ))}
                </Grid>

                <form onSubmit={handleSubmit} className={classes.form} style={{ marginTop: '20px' }}>
                    <TextField
                        label="メッセージを入力してください"
                        variant="outlined"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        fullWidth
                        disabled={loading}
                        className={classes.searchBar}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MessageIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        className={classes.button}
                        disabled={loading}
                        style={{ marginTop: '10px' }}
                    >
                        {loading ? '送信中...' : '送信'}
                    </Button>
                </form>
            </Box>
        </Paper>
    );
};

export default StoreDetail;
