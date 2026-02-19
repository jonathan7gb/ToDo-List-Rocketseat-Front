const tableBody = document.getElementById("tableBody")
const createForm = document.getElementById("createForm")
const createErrors = document.getElementById("createErrors")
const inputSearch = document.getElementById("searchUser")

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

            let rows = ""
            data.forEach(response => {
                rows += addUserAtList(response.name, response.email, response.id)
            })

            tableBody.innerHTML = rows
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

// RETURN URL
function returnUrlUser(path) {
    return `http://localhost:8080/users${path}`
}

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
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    throw new Error(text || "Erro ao deletar usuário")
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
                    <button class="p-2 font-inter ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A7650" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                    </button>
                    <button class="p-2 font-inter flex flex-row gap-2" onclick="deleteUser('${id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A7650" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </td>         
               
            </tr>
        `;
}


function returnErrorTable(message) {
    return `
            <tr class="">
                <td class="px-4 py-2 text-red-500 font-medium font-inter">${message}</td>
            </tr>
        `;
}

function returnError(message) {
    return `
            <p class="text-red-500 mt-2 font-medium font-inter">
            ${message}
            </p>
        `;
}