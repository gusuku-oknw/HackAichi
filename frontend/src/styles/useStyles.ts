// style/useStyles.tx
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
    // Profile.tsx のスタイル
    profileContainer: {
        padding: '20px',
        backgroundColor: '#F7EFE4', // 背景色を画像に合わせて薄いベージュに変更
        minHeight: '100vh',
    },
    profileHeader: {
        backgroundColor: '#7C5C42', // 画像のヘッダー色（茶色）
        color: 'white',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
    },
    profileContent: {
        backgroundColor: 'white',
        padding: '20px',
        marginTop: '10px',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    avatarLarge: {
        width: 100,
        height: 100,
    },
    profileTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    profileSubtitle: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    profileList: {
        backgroundColor: '#FBE0B5', // 画像に基づく薄いオレンジ系
        borderRadius: '10px',
        padding: '10px',
    },

    // StoreListComponentStyles.ts のスタイル
    container: {
        height: 'calc(100vh - 400px)',
        overflowY: 'auto',
        backgroundColor: '#F7EFE4', // 全体の背景色を画像と合わせてベージュ系に
        padding: '16px',
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: '#C19766', // 画像に合わせたオレンジ系の背景色
        color: 'white', // テキスト色を白に
        marginBottom: '8px',
        borderRadius: '8px',
        '&:hover': {
            backgroundColor: '#A6784F', // ホバー時に濃いオレンジ系の色
        },
        '&:active': {
            backgroundColor: '#8B5F3C', // クリック時にさらに濃いオレンジ系の色
        },
    },
    avatar: {
        width: 56,
        height: 56,
        marginRight: '16px',
    },
    storeInfo: {
        flex: 1, // 残りのスペースを使用
    },
});
