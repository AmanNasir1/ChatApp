import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import {
    doc,
    getFirestore,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    onSnapshot,
    orderBy,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCC2KqPAq6VlzonPGcDVGdVwgiI8aJM0Z0",
    authDomain: "loginformbyaman.firebaseapp.com",
    projectId: "loginformbyaman",
    storageBucket: "loginformbyaman.appspot.com",
    messagingSenderId: "416757372630",
    appId: "1:416757372630:web:c208606b3ec0ffe76b9b77"
};
import {
    getAuth,
    onAuthStateChanged,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


window.onload = async () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (!user.emailVerified) {
                sendEmailVerification(auth.currentUser)
                    .then(() => {
                        Swal.fire({
                            title: 'Email Verification',
                            text: 'Please Verify Your Email',
                            icon: 'info',
                            confirmButtonText: 'Reload'
                        });
                    })
            };
            getUserFromDatabase(user.uid);

        }
        else {
            console.log("user not found")
        };
    })
}







const signout = document.getElementById("signOut");
signout.addEventListener("click", () => {
    window.location = "../index.html"
});


const getUserFromDatabase = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    let currentUser = document.getElementById("current-user");

    if (docSnap.exists()) {
        currentUser.innerHTML = `${docSnap.data().name} (${docSnap.data().email})`;
        getAllUsers(docSnap.data().email, uid, docSnap.data().name)

        console.log("Document data:", docSnap.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}

const getAllUsers = async (email, currentId, currentName) => {
    const q = query(collection(db, "users"), where("email", "!=", email));
    const querySnapshot = await getDocs(q);
    let users = document.getElementById("users");
    querySnapshot.forEach((doc) => {
        users.innerHTML += `<li>${doc.data().name} <button onclick='startChat("${doc.id
            }","${doc.data().name
            }","${currentId}","${currentName}")' id="chat-btn">Start Chat</button></li>`;
    });
};




let unsubscribe;

let startChat = (id, name, currentId, currentName) => {
    if (unsubscribe) {
        unsubscribe();
    }
    let chatWith = document.getElementById("chat-with");
    chatWith.innerHTML = name;
    let send = document.getElementById("send");
    let message = document.getElementById("message");
    let chatID;
    if (id < currentId) {
        chatID = `${id}${currentId}`;
    } else {
        chatID = `${currentId}${id}`;
    }
    loadAllChats(chatID, currentId);
    send.addEventListener("click", async () => {
        let allMessages = document.getElementById("messages");
        allMessages.innerHTML = "";
        await addDoc(collection(db, "messages"), {
            sender_name: currentName,
            receiver_name: name,
            sender_id: currentId,
            receiver_id: id,
            chat_id: chatID,
            message: message.value,
            timestamp: new Date(),
        });
    });
};

const loadAllChats = (chatID, currentId) => {
    try {
        const q = query(
            collection(db, "messages"),
            where("chat_id", "==", chatID),
            orderBy("timestamp", "asc")
        );
        let allMessages = document.getElementById("messages");
        unsubscribe = onSnapshot(q, (querySnapshot) => {
            allMessages.innerHTML = "";
            querySnapshot.forEach((doc) => {
                let className =
                    doc.data().sender_id === currentId ? "my-message" : "user-message";
                allMessages.innerHTML += `<li class="${className}">${doc.data().sender_name
                    }: ${doc.data().message}</li>`;
            });
        });
    } catch (err) {
        console.log(err);
    }
};

window.startChat = startChat;
