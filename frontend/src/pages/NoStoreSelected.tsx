import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
// import { useHistory } from 'react-router-dom'; // react-router-domを使用

const NoStoreSelected: React.FC = () => {
    // const history = useHistory();

    const handleGoHome = () => {
        window.location.href = '/'; // ホームページにリダイレクト
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
            textAlign="center"
            p={3}
        >
            <StorefrontIcon style={{ fontSize: 64, color: '#cccccc' }} />
            <Typography variant="h6" color="textSecondary" style={{ marginTop: 16 }}>
                店舗が選択されていません
            </Typography>
            <Typography variant="body1" color="textSecondary" style={{ marginTop: 8, marginBottom: 16 }}>
                お近くの店舗を選択するか、検索ボタンで店舗を見つけてください。
            </Typography>
            <Button variant="contained" color="primary" onClick={handleGoHome}>
                ホームに戻る
            </Button>
        </Box>
    );
};

export default NoStoreSelected;
