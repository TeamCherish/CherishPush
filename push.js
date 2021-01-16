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
    'fxGOOVGDFUVihVvp77APhP:APA91bFtmryWs8huj09Qt-VGGZc1xAnG0dAWWGFe6AxXoCd8zgjHQF2iDaQlRgfVxmT56r-6NkV6Hve09gCk8sxwHizaBxagbjyh9CG8mrrz6xuyifr1OwHppl6uJH5iD7NxCNgHzoZ4',
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
