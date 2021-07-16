import PushNotification, { Importance } from 'react-native-push-notification';

export default class NotificationsService {
    token: any;
    lastId: number;
    lastChannelCounter: any;
    onRegister: Function;
    onNotification: Function;

    constructor(onRegister: Function, onNotification: Function) {
        this.lastId = 0;
        this.lastChannelCounter = 0;
        this.token = null;
        this.onRegister = onRegister;
        this.onNotification = onNotification;

        this.configure();

        // this.createDefaultChannels();

        // NotificationHandler.attachRegister(onRegister);
        // NotificationHandler.attachNotification(onNotification);

        // Clear badge number at start
        PushNotification.getApplicationIconBadgeNumber((number) => {
            if (number > 0) {
                PushNotification.setApplicationIconBadgeNumber(0);
            }
        });

        PushNotification.getChannels((channels) => {});
    }

    configure() {
        PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
            onRegister: this._onRegister.bind(this),

    // (required) Called when a remote or local notification is opened or received
            onNotification: this.onNotification.bind(this), // handler.onNotification.bind(handler),

    // (optional) Called when Action is pressed (Android)
            onAction: () => {}, // handler.onAction.bind(handler),

    // tslint:disable-next-line:max-line-length
    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
            onRegistrationError: () => {}, // handler.onRegistrationError.bind(handler),

    // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

    // Should the initial notification be popped automatically
    // default: true
            popInitialNotification: false,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     */
            requestPermissions: true
        });
    }

    _onRegister(token: any) {
        return new Promise(resolve => {
            if (token && token.token) {
                this.token = token;
                return resolve(this.onRegister(this.token));
            }
        });
    }

    popInitialNotification() {
        PushNotification.popInitialNotification((notification) => console.log('InitialNotication:', notification));
    }

    localNotif(soundName: any) {
        this.lastId++;
        PushNotification.localNotification({
          /* Android Only Properties */
            channelId: soundName ? 'sound-channel-id' : 'default-channel-id',
            ticker: 'My Notification Ticker', // (optional)
            autoCancel: true, // (optional) default: true
            largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
            smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
            bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
            subText: 'This is a subText', // (optional) default: none
            color: 'red', // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: 'some_tag', // (optional) add tag to message
            group: 'group', // (optional) add group to message
            groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
            ongoing: false, // (optional) set whether this is an "ongoing" notification
            actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
            invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
            when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
            usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
            timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

          /* iOS only properties */
            category: '', // (optional) default: empty string
            subtitle: 'My Notification Subtitle', // (optional) smaller title below notification title

          /* iOS and Android properties */
            id: this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            title: 'Local Notification', // (optional)
            message: 'My Notification Message', // (required)
            userInfo: { screen: 'home' }, // (optional) default: {} (using null throws a JSON value '<null>' error)
            playSound: true, // (optional) default: true
            soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            number: 10 // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        });
    }

    scheduleNotif(soundName: any) {
        this.lastId++;
        PushNotification.localNotificationSchedule({
            date: new Date(Date.now() + 30 * 1000), // in 30 secs

          /* Android Only Properties */
            channelId: soundName ? 'sound-channel-id' : 'default-channel-id',
            ticker: 'My Notification Ticker', // (optional)
            autoCancel: true, // (optional) default: true
            largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
            smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
            bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
            subText: 'This is a subText', // (optional) default: none
            color: 'blue', // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: 'some_tag', // (optional) add tag to message
            group: 'group', // (optional) add group to message
            groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
            ongoing: false, // (optional) set whether this is an "ongoing" notification
            actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
            invokeApp: false, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
            when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
            usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
            timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

          /* iOS only properties */
            category: '', // (optional) default: empty string

          /* iOS and Android properties */
            id: this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            title: 'Scheduled Notification', // (optional)
            message: 'My Notification Message', // (required)
            userInfo: { sceen: 'home' }, // (optional) default: {} (using null throws a JSON value '<null>' error)
            playSound: !!soundName, // (optional) default: true
            soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            number: 10 // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        });
    }

    checkPermission(cbk: any) {
        PushNotification.checkPermissions(cbk);
    }

    requestPermissions() {
        PushNotification.requestPermissions();
    }

    cancelNotif() {
        PushNotification.cancelLocalNotifications({id: '' + this.lastId});
    }

    cancelAll() {
        PushNotification.cancelAllLocalNotifications();
    }

    abandonPermissions() {
        PushNotification.abandonPermissions();
    }

    getScheduledLocalNotifications(callback: any) {
        PushNotification.getScheduledLocalNotifications(callback);
    }

    getDeliveredNotifications(callback: any) {
        PushNotification.getDeliveredNotifications(callback);
    }
}
