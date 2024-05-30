//Variables
const gallery = document.querySelector('.gallery')
const filters = document.querySelector('.filters')

//Récupération des works 
async function getWork() {
    const responseWorks = await fetch('http://localhost:5678/api/works')
    //retourne tableau des works
    return await responseWorks.json()
}

//Affichage des works 
async function displayWorks(filterWorks = null) {
    // si la fonction est appelée sans argument, le paramètre aura automatiquement la valeur null
    const works = filterWorks || (await getWork()) // ||  = ou affecte une valeur à la variable works
    gallery.innerHTML = "" //Vide la galerie avant affichage
    works.forEach((work) => {
        //Création des éléments
        const img = document.createElement('img')
        const figcaption = document.createElement("figcaption");
        const figure = document.createElement("figure");
        //attribution des valeurs à chaque élément
        img.src = work.imageUrl; 
        figcaption.textContent = work.title; 
        //ajout img et figcaption à figure
        figure.appendChild(img);
        figure.appendChild(figcaption);
        //ajout de figure à gallery
        gallery.appendChild(figure);
    })
}
displayWorks()


//Récupération des catégories 
async function getCategories() {
    const responseCategories = await fetch('http://localhost:5678/api/categories')
    //retourne la liste des catégories 
    return await responseCategories.json()
}
//Affichage des boutons de filtre 
async function displayCategories() {
    const categories = await getCategories()
    //Ajout btn "Tous"
    const btnAll = document.createElement('button')
    btnAll.textContent = "Tous"
    btnAll.id = "0"
    filters.appendChild(btnAll)

    categories.forEach((category) => {
        //création boutons
        const btnFilters = document.createElement('button')
        //attribution des valeurs 
        btnFilters.textContent = category.name
        btnFilters.id = category.id
        //ajout des catégories dans les boutons
        filters.appendChild(btnFilters)
    })
    filterByCategory()
}
//Filtrer avec les boutons
async function filterByCategory () {
    //récupération du tableau des works 
    const arrayWorks = await getWork()
    //Sélection de tous les btns 
    const btns = document.querySelectorAll('.filters button')
    //Ajout d'écouteurs d'évenements
    btns.forEach((btn) => {
        btn.addEventListener('click',(e) => {
            //Récupération ID de la catégorie cliquée
            const categoryID = e.target.id 
            //Si ID de la catégorie n'est pas 0, on filtre le tableau des works pour inclure la catégorie prévue
            const filterWorks = categoryID !== "0" ? arrayWorks.filter((work) => {
                return work.categoryId == categoryID
            }) : arrayWorks
            displayWorks(filterWorks)
            //Gestion de la couleur des btns 
            btns.forEach((btn) => {
                btn.style.backgroundColor = "#fffef8"
                btn.style.color = "#1D6154"
            })
            e.target.style.backgroundColor = "#1D6154"
            e.target.style.color = "#fffef8"
        })
    })
}
displayCategories()


//Partie mode édition après connexion :

//Vérification du token au chargement de la page 
window.addEventListener("load", function() {
    const token = localStorage.getItem("token")
    if (token) {
        //Affichage Logout
        const loginLink = document.getElementById("login-link")
        loginLink.textContent = "Logout"
        loginLink.addEventListener("click", function(event) {
            event.preventDefault() //empêche le navigateur de suivre le lien
            localStorage.removeItem("token")
            location.reload()
        })
        //Affichage bandeau édition & bouton modifier 
        const bandeauEdition = document.getElementById("mode-edition");
        bandeauEdition.style.display = "flex"
        const editButton = document.getElementById ("editbtn")
        editButton.style.display = "flex"
        //Affichage Container Modale
        const containerModal = document.getElementById("container-modal")
        editButton.addEventListener("click", function(event) {
            containerModal.style.display = "flex"
         } )
        //Fermeture Modale 
        const closeModalBtn = document.querySelector(".close-btn")
        closeModalBtn.addEventListener("click", function(event) {
            containerModal.style.display = "none"
        })
        //Retirer barre de filtres 
        filters.style.display = "none"
    }
})

//Modale 

