const navSlide = () => {
    const burger = document.querySelector('.burger')
    const nav = document.querySelector('.nav-links')
    const navLinks = document.querySelectorAll('.nav-links li')
    //toggle
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active')
        document.querySelector('.landing').classList.toggle('blur-effect')
        document.querySelector('.logo').classList.toggle('blur-effect')
        //anim
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = ''
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`
            }
           
        })
        //burger
        burger.classList.toggle('toggle')
    })

}


navSlide()
