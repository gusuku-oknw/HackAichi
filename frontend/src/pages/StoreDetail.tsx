// import React, { useState } from 'react';
// import { TextField, Button, Box, Typography, Paper } from '@mui/material';
// import { useStyles } from '../styles/useStyles'; // スタイルをインポート
// import { sendMessageToApi } from '../api'; // API送信関数をインポート

// interface StoreDetailProps {
//     store: {
//         id: number;
//         name: string;
//         location: {
//             lat: number;
//             lng: number;
//         };
//     } | null;
// }

// const StoreDetail: React.FC<StoreDetailProps> = ({ store }) => {
//     const [message, setMessage] = useState(''); // メッセージの状態管理
//     const [apiResponse, setApiResponse] = useState<string | null>(null); // APIからのレスポンスを管理
//     const [loading, setLoading] = useState(false); // API送信中の状態を管理
//     const classes = useStyles(); // スタイルの使用

//     if (!store) {
//         return <p>店舗が選択されていません。</p>;
//     }

//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         if (!message.trim()) return; // メッセージが空白の場合は送信しない

//         try {
//             setLoading(true);
//             const response = await sendMessageToApi(store.id, store.name, store.location, message);
//             console.log('送信成功:', response);
//             setApiResponse(`店舗ID: ${response.storeId}, メッセージ: ${response.message}`);
//             setMessage(''); // メッセージ送信後にフィールドをクリア
//         } catch (error) {
//             console.error('送信失敗:', error);
//             setApiResponse('エラーが発生しました');
//         } finally {
//             setLoading(false); // ローディング状態を終了
//         }
//     };

//     return (
//         <Paper className={classes.profileContainer}>
//             {/* 店舗の詳細情報 */}
//             <Box className={classes.profileHeader}>
//                 <Typography variant="h6">{store.name} の詳細情報</Typography>
//             </Box>

//             <Box className={classes.profileContent}>
//                 <Typography variant="body1">
//                     場所: {store.location.lat}, {store.location.lng}
//                 </Typography>
//                 {/* 他の詳細情報をここに追加できます */}

//                 {/* テキスト入力欄と送信ボタン */}
//                 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
//                     <TextField
//                         label="メッセージを入力してください"
//                         variant="outlined"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         fullWidth
//                         disabled={loading}
//                     />
//                     <Button
//                         type="submit"
//                         variant="contained"
//                         color="primary"
//                         style={{ alignSelf: 'flex-start' }}
//                         disabled={loading}
//                     >
//                         {loading ? '送信中...' : '送信'}
//                     </Button>
//                 </form>

//                 {/* APIレスポンスの表示 */}
//                 {apiResponse && (
//                     <Box marginTop={2}>
//                         <Typography variant="body1" color="secondary">
//                             {apiResponse}
//                         </Typography>
//                     </Box>
//                 )}
//             </Box>
//         </Paper>
//     );
// };

// export default StoreDetail;

// StoreDetail.tsx での使用例

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, AppBar, Toolbar, IconButton, Grid, BottomNavigation, BottomNavigationAction } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useStyles } from '../styles/useStyles'; // スタイルをインポート
import { sendMessageToApi } from '../api'; // API送信関数をインポート


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

// ボタンデータ
const buttons = [
  "テーブルが広い席はありますか？",
  "ソファーや快適な椅子はありますか？",
  "窓際や自然光が入る席はありますか？",
  "利用されている年齢層の方はどれくらいですか？"
];


const StoreDetail: React.FC<StoreDetailProps> = ({ store }) => {
    const [message, setMessage] = useState('');
    const [apiResponse, setApiResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(0);
    const classes = useStyles();

    if (!store) {
        return <p>店舗が選択されていません。</p>;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!message.trim()) return;

        try {
            setLoading(true);
            const response = await sendMessageToApi(store.id, store.name, store.location, message);
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

    return (
        <Paper className={classes.profileContainer}>
            <div className={classes.container}>
                {/* AppBar (ヘッダー) */}
                <AppBar className={classes.appBar} position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="back" className={classes.backButton}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {store.name}
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* ロゴ */}
                <div className={classes.logoContainer}>
                    <img src="/logo.png" alt="Cafe Logo" className={classes.logo} />
                </div>

                <Paper className={classes.profileContainer}>
                    {/* 店舗の詳細情報 */}
                    <Box className={classes.profileHeader}>
                        <Typography variant="h6">{store.name} の詳細情報</Typography>
                    </Box>

                    <Box className={classes.profileContent}>
                        <Typography variant="body1">
                            場所: {store.location.lat}, {store.location.lng}
                        </Typography>

                        {/* ボタンの配置 */}
                        <Grid container spacing={2} justifyContent="center" className={classes.buttonContainer}>
                            {buttons.map((text, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <Button fullWidth variant="contained" color="primary" className={classes.button}>
                                        {text}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>

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
        </div>
    </Paper>
    );
};

export default StoreDetail;
