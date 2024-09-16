// src/components/StoreListComponentStyles.ts
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
    container: {
        height: 'calc(100vh - 400px)',
        overflowY: 'auto',
        backgroundColor: '#FFF3E0', // 全体の背景色をオレンジ系の薄い色に
        padding: '16px', // 内側に余白を追加
    },
    listItem: {
        display: 'flex', // フレックスボックスでレイアウトを調整
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: '#FFB74D', // オレンジの背景色
        color: 'white', // テキスト色を白に
        marginBottom: '8px', // 各アイテムの間に余白を追加
        borderRadius: '8px', // 少し丸みを持たせる
        '&:hover': {
            backgroundColor: '#FF8F00', // ホバー時に濃いオレンジ色に変更
        },
        '&:active': {
            backgroundColor: '#FF6F00', // クリック時にさらに濃いオレンジ色に変更
        },
    },
    avatar: {
        width: 56, // 画像のサイズ
        height: 56,
        marginRight: '16px', // 画像とテキストの間に余白を設定
    },
    storeInfo: {
        flex: 1, // 残りのスペースを使用
    },
});
