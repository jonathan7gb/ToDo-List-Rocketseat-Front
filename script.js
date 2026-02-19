const tableBody = document.getElementById("tableBody")
const createForm = document.getElementById("createForm")
const createErrors = document.getElementById("createErrors")

document.addEventListener("DOMContentLoaded", (event) => {
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
}); 

createForm.addEventListener('submit', function(e) {
    e.preventDefault()

    const data = {
        name: createForm.name.value,
        email: createForm.email.value,
        password: createForm.password.value
    }

    createUser(data)
})

function addUserAtList(name, email, id) {
    return `
        <tr class="">
            <td class="px-4 py-2 font-medium font-inter">${name}</td>
            <td class="px-4 py-2 font-inter">${email}</td>
            <td class="px-4 py-2 text-red-600 font-medium font-inter">
                <button class="px-4 py-2 font-inter flex flex-row gap-2" onclick="deleteUser('${id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </td>         
           
        </tr>
    `;
}


function returnErrorTable(message) {
    return `
        <tr class="">
            <td class="px-4 py-2 text-red-500 text-lg font-medium font-inter">${message}</td>
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

function returnUrlUser(path) {
    return `http://localhost:8080/users${path}`
}

function createUser(data){
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