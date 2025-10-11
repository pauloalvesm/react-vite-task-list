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
    const [isUpdating, setIsUpdating] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isTaskDeleted, setIsTaskDeleted] = useState(null);
    const [isEditingTask, setIsEditingTask] = useState(null); 
    const [isCompletingTask, setIsCompletingTask] = useState(null); 

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
            setIsRegistering(true);
            setTimeout(() => {
                setIsRegistering(false);
            }, 1000); 

        })
        .catch((error) => {
            console.log("ERROR REGISTERING " + error);
        });

    }

    async function handleLogout() {
        await signOut(auth);
    }

    async function deleteTask(id) {
        setIsTaskDeleted(id);
        setIsCompletingTask(id);

        setTimeout(async () => {
            const docRef = doc(db, "tasks", id)
            await deleteDoc(docRef);
            setIsTaskDeleted(null); 
            setIsCompletingTask(null);
        }, 1000);
    }

    function editTask(item) {
        setIsEditingTask(item.id);

        setTaskInput(item.task);
        setEdit(item);

        setTimeout(() => {
            setIsEditingTask(null);
        }, 1000);
    }

    async function handleUpdateTask() {
        const docRef = doc(db, "tasks", edit?.id);

        setIsUpdating(true);

        await updateDoc(docRef, {
            task: taskInput
        })
        .then(() => {
            console.log("TASK UPDATED")
            setTaskInput("");
            setTimeout(() => {
                setEdit({});
                setIsUpdating(false);
            }, 2000); 

        })
        .catch(() => {
            console.log("ERROR UPDATING")
            setTaskInput("");
            setEdit({});
            setIsUpdating(false);
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

                {Object.keys(edit).length > 0 || isUpdating ? (
                    <button
                        className={`btn-register ${isUpdating ? "animation-pulse-1s" : ""}`}
                        style={{ backgroundColor: "#32CD32" }}
                        type="submit"
                        disabled={isUpdating}
                    >
                        Update task
                    </button>
                ) : (
                    <button
                        className={`btn-register ${isRegistering ? "animation-pulse-1s" : ""}`}
                        type="submit"
                    >
                        Register task
                    </button>
                )}
            </form>

            {tasks.map((item) => (
                <article 
                    key={item.id} 
                    className={`list ${isTaskDeleted === item.id ? "animation-pulse-1s" : ""}`}
                >
                    <p>{item.task}</p>

                    <div>
                        <button 
                            onClick={() => editTask(item)}
                            className={isEditingTask === item.id ? "animation-pulse-1s" : ""}
                        >
                            Edit
                        </button> 
                        <button 
                            onClick={() => deleteTask(item.id)} 
                            className={`btn-delete ${isCompletingTask === item.id ? "animation-pulse-1s" : ""}`} 
                        >
                            Complete
                        </button>
                    </div>
                </article>
            ))}

            <button className="btn-logout" onClick={handleLogout}>Logout</button>

        </div>
    )
}