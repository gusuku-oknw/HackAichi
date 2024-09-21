import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
    // Profile.tsx のスタイル
    profileContainer: {
        padding: '20px',
        backgroundColor: '#ECE3D2', // コーヒーのクリームを思わせる薄いベージュ
        minHeight: '100vh',
    },
    profileHeader: {
        backgroundColor: '#5D4037', // ダークブラウン（コーヒー色）
        color: 'white',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
    },
    profileContent: {
        backgroundColor: '#FFF8E1', // コーヒーと相性の良いクリーム色
        padding: '20px',
        marginTop: '10px',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: '50%', // 丸いアイコンで親しみやすい印象に
        border: '4px solid #5D4037', // ダークブラウンの枠線
    },
    profileTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#3E2723', // ダークブラウンの文字色
    },
    profileSubtitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#6D4C41', // ライトブラウンの文字色
    },
    profileList: {
        backgroundColor: '#D7CCC8', // ミルク入りコーヒーのような淡いブラウン
        borderRadius: '10px',
        padding: '10px',
    },

    // StoreListComponentStyles.ts のスタイル
    container: {
        height: 'calc(100vh - 400px)',
        overflowY: 'auto',
        backgroundColor: '#ECE3D2', // 薄いベージュ
        padding: '16px',
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: '#8D6E63', // コーヒー豆を思わせるブラウン
        color: 'white',
        marginBottom: '8px',
        borderRadius: '8px',
        '&:hover': {
            backgroundColor: '#6D4C41', // ホバー時にダークブラウン
        },
        '&:active': {
            backgroundColor: '#5D4037', // クリック時にさらにダークなブラウン
        },
    },
    avatar: {
        width: 56,
        height: 56,
        marginRight: '16px',
        borderRadius: '50%', // 丸いアバターで柔らかさを演出
    },
    storeInfo: {
        flex: 1,
        color: '#FFF8E1', // テキストの色をクリーム色に
    },
    appBar: {
        backgroundColor: '#4E342E !important', // コーヒーのダークブラウンの背景色
        color: '#FFF8E1 !important', // クリーム色の文字色
    },
    backButton: {
        marginRight: '10px',
        color: '#FFF8E1', // 戻るボタンのアイコンをクリーム色に
    },
    title: {
        flexGrow: 1,
        color: '#FFF8E1', // タイトルをクリーム色に
    },
    logoContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px'
    },
    logo: {
        width: '150px',
        height: '150px',
    },
    buttonContainer: {
        padding: '20px'
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#6D4C41 !important', // コーヒーブラウンの背景色を強制適用
        color: '#FFF8E1 !important', // クリーム色の文字色を強制適用
        '&:hover': {
            backgroundColor: '#5D4037 !important', // ホバー時にダークブラウン
        },
        '&:active': {
            backgroundColor: '#4E342E !important', // クリック時にさらにダークなブラウン
        },
    },
    footer: {
        padding: '10px',
        borderTop: '1px solid #ddd',
        backgroundColor: '#ECE3D2', // フッター背景を薄いベージュに
    },
    searchBar: {
        marginBottom: '10px',
        backgroundColor: '#FFF8E1', // 検索バーもクリーム色に
        color: '#4E342E', // 文字色をダークブラウンに
    },
    bottomNav: {
        marginTop: '10px',
        backgroundColor: '#4E342E', // ナビゲーションもダークブラウンに
        color: '#FFF8E1', // アイコンの色をクリーム色に
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '16px',
    },
});
