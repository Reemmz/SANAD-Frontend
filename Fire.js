import firebase from 'firebase'; // 4.8.1

class Fire {
    constructor() {
        this.init();
      
    }

    init = () =>
        firebase.initializeApp({
            apiKey: "AIzaSyB7mjtCpIQRkA-3nLPKNHQZ4gehJl8QeCs",
            authDomain: "sanad-74ea1.firebaseapp.com",
            databaseURL: "https://sanad-74ea1.firebaseio.com",
            projectId: "sanad-74ea1",
            storageBucket: "sanad-74ea1.appspot.com",
            messagingSenderId: "536187047763",
            appId: "1:536187047763:web:eeda489f69ce8e60e71ba6",
            measurementId: "G-1WWNG6DJ68"
        });

   



    get uid() {
        return 1;
    }

    get ref() {
        return firebase.database().ref('messages');
    }

    parse = snapshot => {
        const { timestamp: numberStamp, text, user } = snapshot.val();
        const { key: _id } = snapshot;
        const timestamp = new Date(numberStamp);
        const message = {
            _id,
            timestamp,
            text,
            user,
        };
        return message;
    };

    on = callback =>
        this.ref
            .limitToLast(20)
            .on('child_added', snapshot => callback(this.parse(snapshot)));

    get timestamp() {
        return firebase.database.ServerValue.TIMESTAMP;
    }
    // send the message to the Backend
    send = messages => {
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            const message = {
                text,
                user,
                timestamp: this.timestamp,
            };
            this.append(message);
        }
    };

    append = message => this.ref.push(message);

    // close the connection to the Backend
    off() {
        this.ref.off();
    }
}

Fire.shared = new Fire();
export default Fire;