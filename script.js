// ==============================================================
// USERS

const tableBody = document.getElementById("tableBody")
const createForm = document.getElementById("createForm")
const createErrors = document.getElementById("createErrors")
const inputSearch = document.getElementById("searchUser")

// RETURN URL
function returnUrlUser(path) {
    return `http://localhost:8080/users${path}`
}

loadAllUsers()

// GET ALL USERS
function loadAllUsers(){
    fetch(returnUrlUser(""))
        .then(resp => {

            if (!resp.ok) {
                return resp.json()
                    .then(errorData => {
                        throw new Error(errorData.message)
                    })
            }

            return resp.json()
        })
        .then(data => {

            let rowsUser = ""
            let rowsTask = `<option value="HIGH" disabled selected hidden>Choice the user</option>`
            data.forEach(response => {
                rowsUser += addUserAtList(response.name, response.email, response.id)
                rowsTask += addUsersAtTaskForm(response.id, response.name)
            })
            
            userSelectTask.innerHTML = rowsTask
            tableBody.innerHTML = rowsUser
        })
        .catch(error => {
            tableBody.innerHTML = returnError(error.message)
        })
}

// POST USER
createForm.addEventListener('submit', function (e) {
    e.preventDefault()

    const data = {
        name: createForm.name.value,
        email: createForm.email.value,
        password: createForm.password.value
    }

    createUser(data)
})

inputSearch.addEventListener('input', function(e) {
    const username = inputSearch.value.trim()

    if(username.length >= 1){
        findUserByName(username)
    }else{
        loadAllUsers()
    }
})


// ===========================================================
// USER METHODS

function createUser(data) {
    const url = returnUrlUser("")

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(r => {
            if (!r.ok) {
                return r.json()
                    .then(errorData => {
                        throw new Error(errorData.message)
                    })
            }
            location.reload()
            return r.json()
        })
        .catch(error => {
            createErrors.innerHTML = returnError(error.message)
        })
}

function findUserByName(name){
    const url = returnUrlUser(`/searchbyname/${name}`)

     fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (!res.ok) {
            return res.json()
                .then(errorData => {
                    throw new Error(errorData.message)
                })
        }

        return res.json()
    })
    .then(data => {
        let rows = ""
        data.forEach(response => {
            rows += addUserAtList(response.name, response.email, response.id)
        })

        tableBody.innerHTML = rows
    })
    .catch(error => {
        tableBody.innerHTML = returnErrorTable(error.message)
    })
}

function deleteUser(id) {

    const url = returnUrlUser(`/${id}`)

    fetch(url, {
        method: 'DELETE'
    })
        .then(res => {
            if (!res.ok) {
                return res.json()
                    .then(errorData => {
                        throw new Error(errorData.message)
                    })
            }

            location.reload()
        })
        .catch(error => {
            tableBody.innerHTML = returnErrorTable(error.message)
        })
}

// ================================================================
// UTIL ERROR AND FUNCTIONS

function addUserAtList(name, email, id) {
    return `
            <tr class="">
                <td class="px-4 text-sm py-2 font-inter text-secondary">${name}</td>
                <td class="px-4 text-sm py-2 font-inter text-secondary">${email}</td>
                <td class="px-4 py-2 text-red-600 font-medium font-inter flex flex-row">
                    <button class="p-2 font-inter flex flex-row gap-2" onclick="deleteUser('${id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A7650" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </td>         
               
            </tr>
        `;
}

function addUsersAtTaskForm(user_id, user_name){
    return `
        <option value="${user_id}" class="font-medium">${user_name}</option>
    `;
}

function addTaskAtList(data){
    return `
        <div class="flex flex-col justify-between gap-1 p-4 border rounded-lg border-secondary text-secondary">
            <div class="flex flex-col">
                <h3 class="font-bold text-xl">${data.title}</h3>
                <p class="flex flex-row gap-2 mt-1 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A7650" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round-icon lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
                    ${data.user.name}
                </p>
                <p class="mt-2">${data.description}</p>
            </div>
                <div class="flex flex-row justify-between gap-4 mt-2">
                    ${taskPriority(data.priority)}
                    <div class="flex flex-row gap-2">
                        <button class="bg-green-300 px-3 py-2 font-medium text-green-800 rounded-lg text-center mt-2 text-sm transition hover:bg-green-400">Start Task</button>
                        <button onclick="deleteTask('${data.id}')" class="bg-red-300 px-3 py-2 font-medium text-red-800 rounded-lg text-center mt-2 text-sm transition hover:bg-red-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
            </div>
        </div>
    `
}

function taskPriority(priority){
    if(priority == "HIGH"){
        return `<p class="bg-red-200 px-4 py-2 font-medium text-red-800 flex items-center rounded-lg text-center mt-2 text-sm">${priority}</p>`
    }else if(priority == "MEDIUM"){
        return `<p class="bg-yellow-200 px-4 py-2 font-medium text-yellow-800 flex items-center rounded-lg text-center mt-2 text-sm">${priority}</p>`
    }else{
        return `<p class="bg-blue-200 px-4 py-2 font-medium text-blue-800 flex items-center rounded-lg text-center mt-2 text-sm">${priority}</p>`
    }
}


// ====================================================================
// TASKS
const userSelectTask = document.getElementById("userSelectTask")
const tasksList = document.getElementById("tasksList")
const createErrorsTask = document.getElementById("createErrorsTask")
const createFormTask = document.getElementById("createFormTask")
const searchTask = document.getElementById("searchTask")

// RETURN URL
function returnUrlTask(path) {
    return `http://localhost:8080/tasks${path}`
}

loadAllTasks()


// POST TASK
createFormTask.addEventListener('submit', function (e) {
    e.preventDefault()

    const data = {
        title: createFormTask.titleTask.value,
        description: createFormTask.descriptionTask.value,
        priority: createFormTask.priorityTask.value,
        user_id: createFormTask.userSelectTask.value
    }

    createTask(data)
})

// FIND BY TITLE
searchTask.addEventListener('input', function(e) {
    const title = searchTask.value.trim()

    if(title.length >= 1){
        findUserByTitle(title)
    }else{
        loadAllTasks()
    }
})


// GET ALL TASKS
function loadAllTasks(){
    fetch(returnUrlTask(""))
        .then(resp => {

            if (!resp.ok) {
                return resp.json()
                    .then(errorData => {
                        throw new Error(errorData.message)
                    })
            }

            return resp.json()
        })
        .then(data => {

            let rows = ""
            data.forEach(response => {
                rows += addTaskAtList(response)
            })
            
            tasksList.innerHTML = rows
        })
        .catch(error => {
            tasksList.innerHTML = returnError(error.message)
        })
}

function createTask(data) {
    const url = returnUrlTask("")

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(r => {
            if (!r.ok) {
                return r.json()
                    .then(errorData => {
                        throw new Error(errorData.message)
                    })
            }
            location.reload()
            return r.json()
        })
        .catch(error => {
            createErrorsTask.innerHTML = returnError(error.message)
        })
}

function findUserByTitle(title){
    const url = returnUrlTask(`/searchbytitle/${title}`)

     fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (!res.ok) {
            return res.json()
                .then(errorData => {
                    throw new Error(errorData.message)
                })
        }

        return res.json()
    })
    .then(data => {
        let rows = ""
        data.forEach(response => {
            rows += addTaskAtList(response)
        })

        tasksList.innerHTML = rows
    })
    .catch(error => {
        tasksList.innerHTML = returnError(error.message)
    })
}

function deleteTask(id) {

    const url = returnUrlTask(`/${id}`)

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    throw new Error(text || "Erro ao deletar tarefa")
                })
            }

            location.reload()
        })
        .catch(error => {
            tasksList.innerHTML = returnError(error.message)
        })
}


// =================================================
// ERRORS


function returnErrorTable(message) {
    return `
            <tr class="">
                <td class="px-4 py-2 text-red-500 font-medium font-inter">${message}</td>
            </tr>
        `;
}

function returnError(message) {
    return `
            <p class="text-red-500 mt-2 font-medium font-inter px-4 py-2">
            ${message}
            </p>
        `;
}