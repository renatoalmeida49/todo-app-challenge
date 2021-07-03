let activities
let content = document.querySelector("#content")

function fetchData() {
    fetch('../api.json')
        .then(response => response.json())
        .then(response => {
            activities = response.results
        })
}

function mountPage() {
    activities.forEach(activity => {
        let div = document.createElement('div')
        div.classList.add('activity')

        div.innerText = activity.title

        switch(activity.is_active) {
            case 0:
                div.classList.add('checked')
                break;
            case 1:
                div.classList.add('missing')
                break;
        }

        content.appendChild(div)
    })
}



fetchData()