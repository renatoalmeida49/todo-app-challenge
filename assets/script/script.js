import darkMode from './modules/dark-mode.js'

let activities = []
let showTasks = []
let selectedFilter = 'all'
let data = document.querySelector("#data")
let endpoint = 'http://localhost:5000/todos'
// let endpoint = 'https://rest-api-todo-main.herokuapp.com/todos'
let newTodo = document.querySelector('input') 

function fetchData() {
    activities = []
    fetch(endpoint)
        .then(response => response.json())
        .then(response => {
            activities = response

            activeFilter('all')
        })
}

function mountPage() {
    while(data.firstChild) {
        data.removeChild(data.lastChild)
    }

    showTasks.forEach(activity => {
        let div = document.createElement('div')
        let circle = document.createElement('div')
        let paragraph = document.createElement('p')
        let close = document.createElement('div')

        div.classList.add('activity')
        div.setAttribute('data-id', activity.id)
        div.setAttribute('data-status', activity.isActive)
        circle.classList.add('circle')
        close.classList.add('close')

        paragraph.innerText = activity.title

        switch(activity.isActive) {
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

    document.querySelector('#total').innerText = counter()

    addEventListeners()
}

function counter() {
    const toComplete = showTasks.filter(task => {
        return task.isActive == 1
    })

    return toComplete.length
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
            .then(response => response.json())
            .then(response => {
                const post = {
                    id: response.data.id,
                    isActive: response.data.isActive,
                    createdAt: response.data.createdAt,
                    title: response.data.title,
                    updatedAt: response.data.updatedAt
                }
                
                activities.push(post)

                activeFilter()
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
            
            const taskToDelete = activities.find(task => task.id == id)

            const index = activities.findIndex(task => task.id === taskToDelete.id)
            
            activities.splice(index, 1)
            
            activeFilter()
        })
        .catch(error => {
            console.log('Erro delete: ', error)
        })
}

function updateTodo(event) {
    let id = event.target.parentElement.getAttribute('data-id')
    let status = event.target.parentElement.getAttribute('data-status')

    fetch(endpoint, {
        method: 'PATCH',
        body: JSON.stringify({
            id: id,
            isActive: status
        }),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            "Accept": "application/json"
        }
    })
        .then(() => {
            const taskToUpdate = activities.find(task => task.id == id)

            const index = activities.findIndex(task => task.id === taskToUpdate.id)
            
            activities[index].isActive = activities[index].isActive == 1 ? 0 : 1

            activeFilter()
        })
        .catch(error => {
            console.log('Erro patch: ', error)
        })
}

function addEventListeners() {
    let checkbox = document.querySelectorAll(".circle")
    let close = document.querySelectorAll(".close")

    close.forEach(button => {
        button.addEventListener('click', deleteTodo)
    })

    checkbox.forEach(button => {
        button.addEventListener('click', updateTodo)
    })
    
    newTodo.addEventListener('keydown', addTodo)

    let filters = document.querySelectorAll('.filter')

    filters.forEach(filter => {
        filter.addEventListener('click', getFilter)
    })

    document.querySelector('#clear-completed').addEventListener('click', clearCompleted)
}

function getFilter(event) {
    let att = event.target.getAttribute('data-filter')
    selectedFilter = att

    activeFilter()
}

function activeFilter() {
    if (selectedFilter === 'all') {
        showTasks = activities
    }

    if (selectedFilter === 'active') {
        showTasks = activities.filter(task => {
            return task.isActive == 1
        })
    }

    if (selectedFilter === 'completed') {
        showTasks = activities.filter(task => {
            return task.isActive == 0
        })
    }

    console.log('Função filter com a string ', selectedFilter)

    mountPage()
}

function clearCompleted() {
    const toClear = activities.filter(task => {
        return task.isActive == 0
    })

    toClear.forEach(taskToClear => {
        fetch(endpoint, {
            method: 'DELETE',
            body: JSON.stringify({id: taskToClear.id}),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                "Accept": "application/json"
            }
        })
            .then(response => {
                console.log('Delete: ', response)
                
                const taskToDelete = activities.find(task => task.id == taskToClear.id)
    
                const index = activities.findIndex(task => task.id === taskToDelete.id)
                
                activities.splice(index, 1)
                
                activeFilter()
            })
            .catch(error => {
                console.log('Erro delete: ', error)
            })
    })
}
fetchData()
darkMode()