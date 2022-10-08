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

} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyB2VuQMwI0Fb4jAcHOF2RxMVXGvbpTbRgQ",
    authDomain: "chatappbyaman.firebaseapp.com",
    projectId: "chatappbyaman",
    storageBucket: "chatappbyaman.appspot.com",
    messagingSenderId: "891991461524",
    appId: "1:891991461524:web:d4937d8355a3624adbee81"
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
            Swal.fire(
                'Successfully Signup',
                'That thing is still around?',
                'success'
            )
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

