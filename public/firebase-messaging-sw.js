importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAjMk78erlhD1QURXiAcy3Cz2WhIN2Ig0A",
    authDomain: "alumverse-23173.firebaseapp.com",
    projectId: "alumverse-23173",
    storageBucket: "alumverse-23173.appspot.com",
    messagingSenderId: "436562093949",
    appId: "1:436562093949:web:f0e6eba6d4b3d2f50a4e14"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        data: payload.data,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    const { entity, entityId, notificationType } = event.notification.data;
    console.log('Notification data:', { entity, entityId, notificationType });
    event.notification.close();
});

// self.addEventListener('notificationclick', (event) => {
//     if (event?.notification?.data && event?.notification?.data?.link) {
//         self.clients.openWindow(event.notification.data.link);
//     }

//     // close notification after click
//     event.notification.close();
// });