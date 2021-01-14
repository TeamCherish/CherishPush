const express = require('express');
const schedule = require('node-schedule');
const axios = require('axios');
const dayjs = require('dayjs');
const FCM = require('fcm-node');
const config = require('./config');

const serverKey = config.FCM_TOKEN;
const fcm = new FCM(serverKey);

const app = express();
const priority = 'high';
const time_to_live = 3;
const content_available = true;
const mutable_content = true;
const collapse_key = '';
const mobile_os_code = 'I';
let flag = 1; // 1이면 COM, 2면 REV
const j = schedule.scheduleJob('10,30,50 * * * * *', async function () {
  console.log(`현재 시각 ${dayjs().format('YYYY-MM-DD hh:mm:ss')} 입니다.`);
  if (flag === 1) {
    // 물주기 알림을 보내줄 APP_PUSH_USER 정보를 가져옵니다.
    const registration_ids = [];
    const result = await axios.get(`${config.CHERISH_URL}push/COM`);
    const mobile_device_token_map = new Map();

    result.data.data.map((data) => {
      if (!mobile_device_token_map.has(data.mobile_device_token)) {
        mobile_device_token_map.set(data.mobile_device_token, []);
      }
      mobile_device_token_map.get(data.mobile_device_token).push({
        UserId: data.UserId,
        CherishId: data.CherishId,
      });
    });
    for (const mobile_device_token of mobile_device_token_map.keys()) {
      registration_ids.push(mobile_device_token);
      // 보내준 유저 업데이트
      mobile_device_token_map.get(mobile_device_token).map((map_data) => {
        const CherishId = map_data.CherishId;
        const body = {
          CherishId,
        };
        console.log(body);
        try {
          axios.put(`${config.CHERISH_URL}push`, body);
          console.log('sendYN UPDATE 성공');
        } catch (error) {
          console.log('sendYN 업데이트 실패');
          throw error;
        }
      });
    }
    console.log(registration_ids);
    const fcm_data = {
      registration_ids: registration_ids,
      collapse_key,
      priority,
      content_available,
      time_to_live,
      mutable_content,
    };

    if (mobile_os_code === 'I') {
      fcm_data.notification = {
        title: '소중한 친구에게 물을 주는 날이에요',
        // body: 'Body of your push notification',
      };
    } else {
      fcm_data.data = {
        title: '소중한 친구에게 물을 주는 날이에요',
        // body: 'Body of your push notification',
      };
    }
    fcm.send(fcm_data, (error, response) => {
      if (error) {
        console.log('error');
        console.log(error);
      } else {
        console.log('send', response);
      }
    });
    flag = 2;
  } else if (flag === 2) {
    // 연락후기 알림을 보내줄 APP_PUSH_USER 정보를 가져옵니다.
    // const result = await axios.get(`${config.CHERISH_URL}push/REV`);
    const fcm_data = {
      registration_ids: [
        'fGYsP2a1QGa3-ykBH4xtI5:APA91bH15S_SUKYXWXitctBsDbUHxCH-KKDpOF5R7VMI32D2mRmH1KTYmDDL9VJEXykFKIaPAABFiuI9Iefj521lLnp1W9n1boYHKw6-adYFsrM61QeMkr_tIe0Oxq_W3ZG_Pyy6rjmC',
        'd2eG6B9_SbC-XhrWYFS8rJ:APA91bERUw3B-3ArIrfXoJVZuoydZLGT2-Ihu2daCUfO9NekEf-F1BhP0P8-7d6tvAzw_rZx1otwWMHDauFcxR9k_QT2p99cJhQOUXjNZyONt6KwFHFj_ZCuMfGMq2XejpmLXMqORaGd',
        '5d8a16396093f75924970bf641e33c0bbb0abe96fbd747ef26b8f8b9159ffc3c',
      ],
      collapse_key,
      priority,
      content_available,
      time_to_live,
      mutable_content,
    };

    if (mobile_os_code === 'I') {
      fcm_data.notification = {
        title: 'Title of your push notification',
        body: 'Body of your push notification',
      };
    } else {
      fcm_data.data = {
        title: 'Title of your push notification',
        body: 'Body of your push notification',
      };
    }
    fcm.send(fcm_data, (error, response) => {
      if (error) {
        console.log('error');
        console.log(error);
      } else {
        console.log('send', response);
      }
    });
    flag = 1;
  }
});

module.exports = app;
