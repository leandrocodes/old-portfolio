const hamburger = document.querySelector('.hamburger')
const navLinks = document.querySelector('.nav-links')
const links = document.querySelectorAll('.nav-links li')
const nav = document.querySelector('.navbar')

hamburger.addEventListener('click', () => {
    if(navLinks.classList.contains('open')){
        nav.classList.toggle('closing')
        setTimeout(() => {
            nav.classList.remove('closing')
        }, 500);
    }
    navLinks.classList.toggle('open')
    nav.classList.toggle('open')
    links.forEach(link => {
        link.classList.toggle('fade')
    })
})
