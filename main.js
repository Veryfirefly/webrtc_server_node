const express = require('express');
const app = express();
const server = require('http').createServer(app);
const SkyRTC = require('./src/SkyRTC.js').listen(server);

const logLoader = require('./src/utils/log4js-loader.js');
const database = require('./src/utils/database.js');

const log4js = require('log4js');

const { momentLog: moment } = require('./src/utils/log4js-loader.js');

const port = process.env.PORT || 3000;
const hostname = "0.0.0.0";

// initialize log4js
logLoader.initializeLog4js('./log4js.json');
logLoader.shouldConnectLog4js(app);

app.use(log4js.connectLogger(momentLog));

const dbHandle = database.open();

server.listen(port, hostname, function () {
    moment.info(`Moment server is running at http://${hostname}:${port}/`)
});

/**
 * 监听nodejs退出事件，并关闭sqlite.
 */
process.on('SIGINT', () => {
    moment.info('Moment is shutting...');

    database.close();
    
    process.exit(0);
});

SkyRTC.rtc.on('new_connect', function (socket) {
    moment.info('创建新连接');
});

SkyRTC.rtc.on('remove_peer', function (socketId) {
    moment.info(socketId + "用户离开");
});

SkyRTC.rtc.on('new_peer', function (socket, room) {
    moment.info("新用户" + socket.id + "加入房间" + room);
});

SkyRTC.rtc.on('socket_message', function (socket, msg) {
    moment.info("接收到来自" + socket.id + "的新消息：" + msg);
});

SkyRTC.rtc.on('ice_candidate', function (socket, ice_candidate) {
    moment.info("接收到来自" + socket.id + "的ICE Candidate");
});

SkyRTC.rtc.on('offer', function (socket, offer) {
    moment.info("接收到来自" + socket.id + "的Offer");
});

SkyRTC.rtc.on('answer', function (socket, answer) {
    moment.info("接收到来自" + socket.id + "的Answer");
});

SkyRTC.rtc.on('error', function (error) {
    moment.info("发生错误：" + error.message);
});