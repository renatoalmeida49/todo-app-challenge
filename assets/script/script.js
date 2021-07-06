let activities
let data = document.querySelector("#data")

function fetchData() {
    fetch('../api.json')
        .then(response => response.json())
        .then(response => {
            activities = response.results
            mountPage()
        })
}

function mountPage() {
    activities.forEach(activity => {
        let div = document.createElement('div')
        let circle = document.createElement('div')
        let paragraph = document.createElement('p')
        let close = document.createElement('div')

        div.classList.add('activity')
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

function addEventListeners() {
    let checkbox = document.querySelectorAll(".circle")
    let close = document.querySelectorAll(".close")

    console.log("Circles: ", checkbox)

    close.forEach(button => {
        button.addEventListener('click', (event) => {
            console.log("Fechar", event.target.parentElement)
        })
    })

    let newTodo = document.querySelector('input') 
    
    newTodo.addEventListener('keydown', (event) => {
        if(event.key === "Enter") {
            let title = newTodo.value

            console.log(title)

            newTodo.value = ''
        }
    })
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