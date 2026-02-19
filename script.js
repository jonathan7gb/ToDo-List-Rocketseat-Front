const tableBody = document.getElementById("tableBody")


function addUserAtList(name, email, id) {
    return `
        <tr class="">
            <td class="px-4 py-2">${name}</td>
            <td class="px-4 py-2">${email}</td>
            <td class="px-4 py-2 text-red-600 font-medium">
                <button class="px-4 py-2" onclick="deleteUser('${id}')">
                    Delete
                </button>
            </td>         
           
        </tr>
    `;
}

function returnError(message) {
    return `
        <tr class="">
            <td class="px-4 py-2 text-red-500 text-lg font-medium">${message}</td>
        </tr>
    `;
}

function returnUrlUser(path) {
    return `http://localhost:8080/users${path}`
}

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
            tableBody.innerHTML = returnError(error.message)
        })
}