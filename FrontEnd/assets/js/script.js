//Variables
let datas = []
let categories = []
const gallery = document.querySelector('.gallery')
const filters = document.querySelector('.filters')


//Récupération des travaux via l'API
fetch('http://localhost:5678/api/works')
    .then(res => res.json())
    .then(data => {
    datas = data
        //Suppression des travaux présents du HTML
        gallery.innerHTML =""

        //Ajout des travaux récupérés de la galerie 
        data.forEach (work => {
                categories.push (work.category)
            createWork (work)
        }) 
    }) 
    .catch(error => {
        console.error ('Erreur lors de la récupération des données :', error)
        alert ('Une erreur s\'est produite lors de la récupération des données. Veuillez réessayer.')
    })

fetch('http://localhost:5678/api/categories')
    .then(res => res.json())
    .then(data => {
    categories = data
    data.unshift ({
        id:0, 
        name: "Tous"
    })
    filters.innerHTML =""
    data.forEach (work => {
        createCategory(work)
})   
    }) 
    .catch(error => {
        console.error ('Erreur lors de la récupération des données :', error)
        alert ('Une erreur s\'est produite lors de la récupération des données. Veuillez réessayer.')
    })

function createCategory(category) {
    const button = document.createElement('button')
    button.classList.add("filterbtn")
    button.innerText = category.name
    button.setAttribute("data-id", category.id)
    button.addEventListener("click", () => filterCategories (category.id))
    filters.appendChild(button)
}

function createWork(work) {
    const figure = document.createElement('figure')
    const img = document.createElement('img')
    const figcaption = document.createElement('figcaption')

    img.src = work.imageUrl 
    img.alt = work.title
    figcaption.textContent = work.title 

    figure.appendChild(img) //ajout de l'image à figure
    figure.appendChild(figcaption) //ajout de la légende à figure
    gallery.appendChild(figure) //ajout de figure à la galerie
}

//Barre de filtres 
function filterCategories(id) {
    let filteredElements = []
    if ( id > 0){
        filteredElements = datas.filter((x) => x.categoryId == id) 
    } else {
        filteredElements = datas
    }    
    gallery.innerHTML =""
    filteredElements.forEach(work => {
        createWork(work)
    });
}

//Partie mode édition après connexion 


//Vérification du token au chargement de la page 
window.addEventListener("load", function() {
    const token = localStorage.getItem("token");
    console.log("token récupéré",token)
    if (token) {
        //Affichage Logout
        const loginLink = document.getElementById("login-link")
        loginLink.textContent = "Logout"
        loginLink.addEventListener("click", function(event) {
            event.preventDefault() //empêche le navigateur de suivre le lien
            localStorage.removeItem("token")
            window.location.href = "../Pages/login.html" 
        })
        //Affichage bandeau édition & bouton modifier 
        const bandeauEdition = document.getElementById("mode-edition");
        bandeauEdition.style.display = "block"
        const editButton = document.getElementById ("editbtn")
        console.log(editButton)
        editButton.style.display = "block"
        //Affichage Container Modale
        const containerModal = document.getElementById("container-modal")
        console.log(containerModal)
        editButton.addEventListener("click", function(event) {
            containerModal.style.display = "block"
        } )
        //Fermeture Modale 
        const closeModalBtn = document.querySelector(".close-btn")
        console.log(closeModalBtn)
        closeModalBtn.addEventListener("click", function(event) {
            containerModal.style.display = "none"
        })
        //Désaffichage partie filtres 
        
        
        
    }
});


