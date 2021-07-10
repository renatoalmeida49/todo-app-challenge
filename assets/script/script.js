let activities = []
let data = document.querySelector("#data")
let endpoint = 'http://localhost:5000/todos'
let newTodo = document.querySelector('input') 

function fetchData() {
    activities = []
    fetch(endpoint)
        .then(response => response.json())
        .then(response => {
            activities = response.todos
            mountPage()
        })
}

function mountPage() {
    while(data.firstChild) {
        data.removeChild(data.lastChild)
    }

    activities.forEach(activity => {
        let div = document.createElement('div')
        let circle = document.createElement('div')
        let paragraph = document.createElement('p')
        let close = document.createElement('div')

        div.classList.add('activity')
        div.setAttribute('data-id', activity.id)
        circle.classList.add('circle')
        close.classList.add('close')

        paragraph.innerText = activity.title

        switch(activity.is_active) {
            case 0:
                div.classList.add('checked')
                break;
            case 1:
                div.classList.add('missing')
                break;
        }

        div.appendChild(circle)
        div.appendChild(paragraph)
        div.appendChild(close)
        data.appendChild(div)
    })

    addEventListeners()
}

function addTodo(event) {
    if(event.key === "Enter") {           
        fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                title: newTodo.value
            }),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                "Accept": "application/json"
            }
        })
            .then(response => {
                console.log("Resposta: ", response)
                fetchData()
            }).catch(error => {
                console.log("Erro POST: ", error)
            })

        newTodo.value = ''
    }
}

function deleteTodo(event) {
    let id = event.target.parentElement.getAttribute('data-id')

    fetch(endpoint, {
        method: 'DELETE',
        body: JSON.stringify({id: id}),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            "Accept": "application/json"
        }
    })
        .then(response => {
            console.log('Delete: ', response)
            fetchData()
        })
        .catch(error => {
            console.log('Erro delete: ', error)
        })
}

function addEventListeners() {
    let checkbox = document.querySelectorAll(".circle")
    let close = document.querySelectorAll(".close")

    close.forEach(button => {
        button.addEventListener('click', deleteTodo)
    })
    
    newTodo.addEventListener('keydown', addTodo)
}

function darkMode() {
    let icon = document.querySelector("#dark-toggle")

    icon.addEventListener('click', () => {
        document.body.classList.toggle("dark-theme")
        icon.classList.toggle("dark-theme")

        if(icon.classList.contains('dark-theme')) {
            icon.src = "./assets/images/icon-sun.svg"
        } else {
            icon.src = "./assets/images/icon-moon.svg"
        }
    })
}

fetchData()
darkMode()