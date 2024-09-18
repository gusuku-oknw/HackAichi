// src/Profile.tsx
import React from 'react';
import { Box, Avatar, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useStyles } from '../styles/useStyles'; // 統合したスタイルをインポート

const Profile = () => {
    const classes = useStyles(); // スタイルのフックを使用

    return (
        <Box className={classes.profileContainer}>
            {/* ヘッダー部分 */}
            <Box className={classes.profileHeader}>
                <Typography variant="h6">Profile</Typography>
            </Box>

            {/* プロフィール内容 */}
            <Box className={classes.profileContent}>
                {/* アバター部分 */}
                <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <Avatar className={classes.avatarLarge} />
                </Box>

                {/* 会社名と名前 */}
                <Typography className={classes.profileSubtitle} variant="h6">
                    （株）岐大商事
                </Typography>
                <Typography className={classes.profileTitle} variant="h5">
                    佐藤 太郎
                </Typography>

                {/* プロフィールリスト */}
                <List className={classes.profileList}>
                    <ListItem>
                        <ListItemText primary="出身地" secondary="岐阜県" />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="趣味" secondary="読書　キャンプ" />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="出身地" secondary="岐阜県" />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="自己紹介" secondary="お酒を飲むのが好きです。一緒に飲みましょう！" />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="所属" secondary="商品開発部" />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="役職" secondary="部長" />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="email" secondary="123456@xxxx.xxx" />
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
};

export default Profile;
