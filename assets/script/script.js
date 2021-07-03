let activities
let content = document.querySelector("#content")

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
        let paragraph = document.createElement('p')
        let circle = document.createElement('div')

        div.classList.add('activity')
        circle.classList.add('circle')

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
        content.appendChild(div)
    })
}



fetchData()