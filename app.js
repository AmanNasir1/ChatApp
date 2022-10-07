// ============================Switching Account===================================================

const linkRegister = document.getElementById("linkRegister");
const linklogin = document.getElementById("linklogin")
const loginform = document.getElementById("loginForm");
const registrationform = document.getElementById("registrationForm");
linkRegister.addEventListener("click", (e) => {
    e.preventDefault()
    loginform.classList.add("hidden")
    registrationform.classList.remove("hidden")
});
linklogin.addEventListener("click", (e) => {
    e.preventDefault()
    registrationform.classList.add("hidden")
    loginform.classList.remove("hidden")
});

// =================================================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyCC2KqPAq6VlzonPGcDVGdVwgiI8aJM0Z0",
    authDomain: "loginformbyaman.firebaseapp.com",
    projectId: "loginformbyaman",
    storageBucket: "loginformbyaman.appspot.com",
    messagingSenderId: "416757372630",
    appId: "1:416757372630:web:c208606b3ec0ffe76b9b77"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const signup = document.getElementById("signup-btn");
signup.addEventListener("click", () => {
    const username = document.getElementById("username");
    const email = document.getElementById("registrationEmail");
    const phoneNumber = document.getElementById("PhoneNumber");
    const Password = document.getElementById("registrationPassword");
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email.value, Password.value)
        .then(async (userCredential) => {
            const uid = userCredential.user.uid;
            console.log("signup", userCredential.user)
            let firstdoc = doc(db, "users", uid);
            await setDoc(firstdoc, {
                name: username.value,
                email: email.value,
                phoneNumber: phoneNumber.value
            });
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage)
        });

});

const login = document.getElementById("login-btn");
login.addEventListener("click", () => {
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword")
    const auth = getAuth();
    signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
        .then((userCredential) => {
            const user = userCredential.user;
            window.location = "pages/chat.html"
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage)
        });
})

// window.onload = async () => {
//     const auth = getAuth();
//     onAuthStateChanged(auth, (user) => {
//         if (user) {
//             if (!user.emailVerified) {
//                 sendEmailVerification(auth.currentUser)
//                     .then(() => {
//                         Swal.fire({
//                             title: 'Email Verification',
//                             text: 'Please Verify Your Email',
//                             icon: 'info',
//                             confirmButtonText: 'Reload'
//                         });
//                     })
//             };
//             getUserFromDatabase(user.uid);
           
//         }
//         else {
//             console.log("user not found")
//         };
//     })
// }

// const getUserFromDatabase = async (uid) => {
//     const docRef = doc(db, "users", uid);
//     const docSnap = await getDoc(docRef);
//     let currentUser = document.getElementById("current-user");
//     currentUser.innerHTML = `${docSnap.data().name} (${docSnap.data().email})`;

//     if (docSnap.exists()) {
//         console.log("Document data:", docSnap.data());
//     } else {
//         // doc.data() will be undefined in this case
//         console.log("No such document!");
//     }
// }