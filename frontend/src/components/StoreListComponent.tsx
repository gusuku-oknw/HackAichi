// src/components/StoreListComponent.tsx
import React from 'react';
import { List, ListItem, ListItemText, Box, Typography, Avatar } from '@mui/material';
import { Store } from './types'; // 必要に応じてtypes.tsでStore型を定義
import { useStyles } from '../styles/StoreListComponentStyles'; // スタイルをインポート

interface StoreListComponentProps {
    stores: Store[]; // Store型の配列
    onSelectStore: (store: Store) => void; // ストアが選択された時の関数
}

const StoreListComponent: React.FC<StoreListComponentProps> = ({ stores, onSelectStore }) => {
    const classes = useStyles();

    return (
        <Box className={classes.container}>
            <List>
                {stores.map((store) => (
                    <ListItem
                        key={store.id}
                        className={classes.listItem}
                        onClick={() => onSelectStore(store)}
                    >
                        {/* 店舗の外観写真 */}
                        <Avatar
                            alt={store.name}
                            src={store.imageUrl} // 店舗の画像URLを使う
                            className={classes.avatar}
                        />
                        <Box className={classes.storeInfo}>
                            {/* 店舗名 */}
                            <Typography variant="h6">{store.name}</Typography>
                            {/* 店舗の概要 */}
                            <Typography variant="body2" color="textSecondary">
                                {store.description} {/* 店舗の概要を表示 */}
                            </Typography>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default StoreListComponent;
