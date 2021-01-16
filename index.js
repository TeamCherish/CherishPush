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
const j = schedule.scheduleJob('0 0 21,23 * * *', async function () {
  console.log(`시작 시각 ${dayjs().format('YYYY-MM-DD hh:mm:ss')} 입니다.`);
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
        try {
          axios.put(`${config.CHERISH_URL}push`, body);
          console.log(`[연락 알림] ${CherishId} sendYN UPDATE 성공`);
        } catch (error) {
          console.log(`[연락 알림] ${CherishId} sendYN 업데이트 실패`);
          throw error;
        }
      });
    }
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
    // 물주기 알림을 보내줄 APP_PUSH_USER 정보를 가져옵니다.
    const result = await axios.get(`${config.CHERISH_URL}push/REV`);
    result.data.data.map((data) => {
      const fcm_data = {
        registration_ids: [data.mobile_device_token],
        collapse_key,
        priority,
        content_available,
        time_to_live,
        mutable_content,
      };

      if (mobile_os_code === 'I') {
        fcm_data.notification = {
          title: '연락후기를 등록하세요.',
          // body: 'Body of your push notification',
        };
      } else {
        fcm_data.data = {
          title: '연락후기를 등록하세요.',
          // body: 'Body of your push notification',
        };
      }
      fcm.send(fcm_data, (error, response) => {
        if (error) {
          console.log(error);
        } else {
          console.log('send', response);
        }
      });
      const CherishId = data.CherishId;
      const body = {
        CherishId,
      };
      try {
        axios.put(`${config.CHERISH_URL}pushReview`, body);
        console.log(`[물주기 알림] ${CherishId} sendYN UPDATE 성공`);
      } catch (error) {
        console.log(`[물주기 알림] ${CherishId} sendYN 업데이트 실패`);
        throw error;
      }
    });
    flag = 1;
  }
  console.log(`시작 시각 ${dayjs().format('YYYY-MM-DD hh:mm:ss')} 입니다.`);
});

module.exports = app;
