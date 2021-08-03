export default function darkMode() {
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