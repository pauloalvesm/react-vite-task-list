import { useState, useEffect } from "react";

import { auth, db } from "../../services/firebaseConnection";
import { signOut } from "firebase/auth";

import {
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    where
} from "firebase/firestore";

import "./admin.css";

export default function Admin() {
    const [taskInput, setTaskInput] = useState("");
    const [user, setUser] = useState({});

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        async function loadTasks() {
            const userDetail = localStorage.getItem("@detailUser")
            setUser(JSON.parse(userDetail))

            if (userDetail) {
                const data = JSON.parse(userDetail);
                const taskRef = collection(db, "tasks");
                const getQuery = query(taskRef, orderBy("created", "desc"), where("userUid", "==", data?.uid));

                const unsub = onSnapshot(getQuery, (snapshot) => {
                    let list = [];

                    snapshot.forEach((doc) => {
                        list.push({
                            id: doc.id,
                            task: doc.data().task,
                            userUid: doc.data().userUid
                        })
                    });

                    console.log(list);
                    setTasks(list);

                })
            }
        }

        loadTasks();
    }, []);

    async function handleRegister(e) {
        e.preventDefault();

        if (taskInput === "") {
            alert("Enter your task...")
            return;
        }

        await addDoc(collection(db, "tasks"), {
            task: taskInput,
            created: new Date(),
            userUid: user?.uid
        })
        .then(() => {
            console.log("TASK REGISTERED");
            setTaskInput("");
        })
        .catch((error) => {
            console.log("ERROR REGISTERING " + error);
        });

    }

    async function handleLogout() {
        await signOut(auth);
    }

    return (
        <div className="admin-container">
            <h1>My tasks</h1>

            <form className="form" onSubmit={handleRegister}>
                <textarea
                    placeholder="Enter your task..."
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                />

                <button className="btn-register" type="submit">Register task</button>
            </form>

            <article className="list">
                <p>Study javascript and reactjs tonight</p>

                <div>
                    <button>Edit</button>
                    <button className="btn-delete">Complete</button>
                </div>
            </article>

            <button className="btn-logout" onClick={handleLogout}>Logout</button>

        </div>
    )
}