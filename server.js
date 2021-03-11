const express = require('express');
const app = express();
let DB = [
    // dateWritten : 날짜
    // amountUsed : 사용금액
    // memo : 메모
];

// 랜덤 고유 id 생성
function generateStringsRandomly(length = 8) {
    const creatAtTime = new Date().getTime().toString();
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const text = [...Array(length)].reduce((text, array) => {
        text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }, '');

    return text + creatAtTime;
};

// 에러체크 함수
function errorChecking(toCheck) {
    const errCheckContents = toCheck;
    if (!errCheckContents.dateWritten || !errCheckContents.amountUsed) {
        return 500;
    } else {
        return 200;
    };
};

// 최신 날짜별로 정렬
function dateSort(a, b) {
    const dateA = new Date(a['dateWritten']).getTime();
    const dateB = new Date(b['dateWritten']).getTime();

    return dateA < dateB ? 1 : -1;
};

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');

});

// 삭제버튼
app.delete('/api/deleteList', (req, res) => {
    const deleteContents = req.query;
    const newDB = DB.filter(oldDB => oldDB.id !== deleteContents.id);

    DB = newDB;

    res.status(200).send(DB);
});

// 추가버튼
app.post('/api/sendContents', (req, res) => {
    //req.body
    //필수 키값 2개가 없으면 에러

    // 에러체크
    res.status(errorChecking(req.body));

    // id 추가 후 DB에 저장
    const contentsReceived = req.body;
    contentsReceived.id = generateStringsRandomly();
    DB.push(contentsReceived);

    // 최신 날짜별로 정렬
    DB.sort(dateSort);

});

app.get('/api/list', (req, res) => {
    // 목록나열
    res.status(200).json(DB);
});

app.listen(3000, () => {
    console.log('app listening on port 3000!');
});