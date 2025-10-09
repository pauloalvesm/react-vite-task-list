import { useState, useEffect } from "react";

import { auth, db } from "../../services/firebaseConnection";
import { signOut } from "firebase/auth";

import {
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    where,
    doc,
    deleteDoc,
    updateDoc
} from "firebase/firestore";

import "./admin.css";

export default function Admin() {
    const [taskInput, setTaskInput] = useState("");
    const [user, setUser] = useState({});
    const [edit, setEdit] = useState({});

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

        if (edit?.id) {
            handleUpdateTask();
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

    async function deleteTask(id) {
        const docRef = doc(db, "tasks", id)
        await deleteDoc(docRef);
    }

    function editTask(item) {
        setTaskInput(item.task)
        setEdit(item);
    }

    async function handleUpdateTask() {
        const docRef = doc(db, "tasks", edit?.id)
        await updateDoc(docRef, {
            task: taskInput
        })
        .then(() => {
            console.log("TASK UPDATED")
            setTaskInput('')
            setEdit({})
        })
        .catch(() => {
            console.log("ERROR UPDATING")
            setTaskInput('')
            setEdit({})
        });
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

                {Object.keys(edit).length > 0 ? (
                    <button className="btn-register" style={{ backgroundColor: "#32CD32" }} type="submit">Update task</button>
                ) : (
                    <button className="btn-register" type="submit">Register task</button>
                )}
            </form>

            {tasks.map((item) => (
                <article key={item.id} className="list">
                    <p>{item.task}</p>

                    <div>
                        <button onClick={ () => editTask(item) }>Edit</button> 
                        <button onClick={() => deleteTask(item.id)} className="btn-delete">Complete</button>
                    </div>
                </article>
            ))}

            <button className="btn-logout" onClick={handleLogout}>Logout</button>

        </div>
    )
}