import React, { useState } from 'react';
import { List, ListItem, Typography, Avatar, Box, Drawer } from '@mui/material';
import { Store } from './types'; // 必要に応じてtypes.tsでStore型を定義
import { useStyles } from '../styles/useStyles'; // スタイルをインポート

interface StoreListComponentProps {
    stores: Store[]; // Store型の配列
    onSelectStore: (store: Store) => void; // ストアが選択された時の関数
}

const StoreListComponent: React.FC<StoreListComponentProps> = ({ stores, onSelectStore }) => {
    const classes = useStyles();
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);

    const handleSelectStore = (store: Store) => {
        setSelectedStore(store);
        onSelectStore(store);
    };

    const handleClose = () => {
        setSelectedStore(null);
    };

    return (
        <Box className={classes.root}>
            <List className={classes.container}>
                {stores.map((store) => (
                    <ListItem
                        key={store.id}
                        className={classes.listItem}
                        onClick={() => handleSelectStore(store)}
                    >
                        <Avatar
                            alt={store.name}
                            src={store.imageUrl} // 店舗の画像URLを使う
                            className={classes.avatar}
                        />
                        <Box className={classes.storeInfo}>
                            <Typography variant="h6">{store.name}</Typography>
                            <Typography variant="body2" color="#ffffff">
                                {store.description}
                            </Typography>
                        </Box>
                    </ListItem>
                ))}
            </List>

            <Drawer
                anchor="bottom"
                open={Boolean(selectedStore)}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        height: '50%', // 画面の半分を覆い尽くす
                        overflowY: 'auto', // スクロールを可能にする
                    },
                }}
            >
                {selectedStore && (
                    <Box p={2}>
                        <Typography variant="h6">{selectedStore.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {selectedStore.description}
                        </Typography>
                        {/* 他の店舗情報を表示する部分 */}
                    </Box>
                )}
            </Drawer>
        </Box>
    );
};

export default StoreListComponent;
