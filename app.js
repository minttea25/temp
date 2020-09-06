const ip = '192.168.55.81';
const port = 8080;

//express 불러오기
var express = require('express'), http = require('http'), path = require('path');

//express 미들웨어 불러오기
var static = require('serve-static');

//express 객체 생성
var app = express();

var router = express.Router();

var util = require('util');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

router.route('/').get(function(req, res) {
    res.redirect('source/jquery.html'); //http://localhost:8080/ 생략해야함!
});

router.route('/routetest').get(function(req, res) {
    res.redirect('https://google.com');
});

//news 기사 링크
router.route('/rss').get(function (req, res) {
    console.log('rss data requested');
    var feed = "http://fs.jtbc.joins.com/RSS/newsflash.xml";
    //xml 데이터를 한번에 받아오지 않음
    http.get(feed, function(httpres) {
        var rss_res = "";
        httpres.on('data', function (chunk) {
            rss_res += chunk;
        });
        httpres.on('end', function () {
            res.send(rss_res);
            console.log('rss response completed');
            res.end();
        });
    });
});

router.route('/dl').get(function(req, res) {
    console.log('/dl router called');

    var file = "./source/file.zip"
    var fileName = 'file.zip';
    var mimetype = mime.getType(fileName);

    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);

    res.setHeader('content-type', mimetype);
    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
});

router.route('/process/download/:fileid').get(function(req, res) {
    var fileid = req.params.fileid;

    var fileName;
    var path = './source/kirafan/';

    switch (fileid) {
        case '1':
            fileName = 'new.zip';
            path = './source/kirafan/new/';
            break;
        case '2':
            fileName = 'background (1).zip';
            break;
        case '3':
            fileName = 'characard.zip';
            break;
        case '4':
            fileName = 'charaillustfull.zip'
            break;
        default:
            res.redirect('source/public/404.html');
            return;
    }

    var file = path + fileName;
    var mimetype = mime.getType(fileName);

    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);

    res.setHeader('Content-type', mimetype);
    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
});

router.route('/kirafan').get(function(req, res) {
    console.log('/kirafan router called');
    res.redirect('/source/kirafan.html');
});

//기본 속성 설정
app.set('port', process.env.PORT || port);
app.set('host', ip); 
//루프 백 주소(127.0.0.1) 사용

//static 서버 미들웨어 사용
app.use(static(__dirname)); //현재 폴더에 대한 정적 접근 허용
//app.use(express.urlencoded());
//app.use(express.json());
// app.use(function(req, res, next) {
//     console.log('첫 번째 미들웨어에서 요청을 처리함.');

//     req.user = 'mike';
//     next();
// });

// app.use('/', function(req, res, next) {
//     console.log('두 번째 미들웨어에서 요청을 처리함.');

//     res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
//     res.end('<h1>Express 서버에서 ' + req.user + '가 응답한 결과 입니다.</h1>');
// });

app.use('/', router);

app.all('*', function(req, res) {
    res.status(404).send('<h1>ERROR - 요청하신 페이지를 찾을 수 없습니다.</h1>');
})

//express 서버 시작
http.createServer(app).listen(app.get('port'), app.get('host'), () => {
    console.log('Express server running at ' + app.get('port') +" "+ app.get('host'));
});