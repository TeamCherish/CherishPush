const FCM = require('fcm-node');
const config = require('./config');
const serverKey = config.FCM_TOKEN;
const fcm = new FCM(serverKey);

const priority = 'high';
const time_to_live = 3;
const content_available = true;
const mutable_content = true;
const collapse_key = '';
const mobile_os_code = 'I';
const fcm_data = {
  registration_ids: [
    // 'fzhBh45mR2K34d19q_OYAl:APA91bECchzR7LcumNmkGDoe7EKG4wdV57sh_LRRDwU-6VZCrQofJP4ZbOs9GYWE0OfQluHI9i9HmAv6ul5793R43H2TP3nHehhtHpuJRLkMwiFWLjXjFUYIXjHM1NYhSb1ZEeejXX7J',
    'dWOQ1kWS90mbvbZ0bO5Gpr:APA91bH-qW-ge1rtTEjt0LZbhG4_SNV2kCyU6y4f5TWaI18gvPpL_E8hrzkXL9SbWK5n6KUjC1TJ8YxadK_okMqlipP3r-x8OUYu0fxy_dvA3QO5uMGsnZ6ikg1ABI_N8dTY38pDnbCf',
  ],
  collapse_key,
  priority,
  content_available,
  time_to_live,
  mutable_content,
};

if (mobile_os_code === 'I') {
  fcm_data.notification = {
    title: '지은아 안녕',
    body: '지은아 안녕',
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
