//Variables
const gallery = document.querySelector('.gallery')
const filters = document.querySelector('.filters')
//Variables modales 


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
//Ajout des catégories aux filtres
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
        //Affichage des différentes parties quand l'utilisateur est connecté
        displayAdminElements();
       
    }
})
function displayAdminElements() {
    //Logout
    const loginLink = document.getElementById("login-link");
    loginLink.textContent = "Logout";
    loginLink.addEventListener("click", function(event) {
        event.preventDefault(); // empêche le navigateur de suivre le lien
        localStorage.removeItem("token");
        location.reload();
    });
    //Affichage bandeau édition & bouton modifier
    const bandeauEdition = document.getElementById("mode-edition");
    bandeauEdition.style.display = "flex";
    const editButton = document.getElementById("editbtn"); //bouton modifier 
    editButton.style.display = "flex";
    //Retirer barre de filtres
    const filters = document.querySelector(".filters");
    filters.style.display = "none";
}

//Modale 

//Gestion des modales 
const firstModal = document.querySelector(".modal-principale") //1ère modale 
const secondModal = document.querySelector(".modal-secondaire") //2ème modale 
const buttonFirstModal = document.querySelector(".modal-princiale-btn") //bouton 1ère modale
const arrow = document.querySelector(".return-back-arrow") //flèche 2ème modale 

//Affichage et fermeture modal
const editButton = document.getElementById("editbtn"); //bouton modifier (à déclarer en haut à la fin)
const modalWrapper = document.querySelector(".modal-wrapper") //container parent
const closeModalBtn = document.querySelector(".close-btn"); //croix de fermeture

function displayModal () {
    //Affichage modal
    editButton.addEventListener("click", function(event) {
        modalWrapper.style.display = "flex";
    });
    //Fermeture à modifier pour fermer même en cliquant ailleurs sur la page
    closeModalBtn.addEventListener("click", function(event) {
        modalWrapper.style.display = "none";
    });
    //Fermeture hors container 
    modalWrapper.addEventListener("click", (e) => {
    if (e.target.className == "modal-wrapper") {
        modalWrapper.style.display = "none"
    }
})}
displayModal()

//Affichage des works dans la modal
const worksGalleryModal = document.querySelector(".work-modal")

async function displayWorksModal () {
    worksGalleryModal.innerHTML = ""  //vide la galerie avant affichage
    const worksModal = await getWork()
    worksModal.forEach(work => {
        //Création des éléments 
        const figure = document.createElement('figure')
        const img = document.createElement('img')
        //Ajout icône poubelle 
        const span = document.createElement('span')
        const trash = document.createElement('i')
        trash.classList.add('fa-solid', 'fa-trash-can')
        trash.id = work.id //Ajout de l'id du travaux lié pour gérer la suppression 
        img.src = work.imageUrl
        span.appendChild(trash)
        figure.appendChild(span)
        figure.appendChild(img)
        worksGalleryModal.appendChild(figure)
    })
    deleteWorks()
}
displayWorksModal()


//Supression d'images dans la modal    /à tester après 
function deleteWorks () {
    const trashCans = document.querySelectorAll('.fa-trash-can')
    trashCans.forEach (trash => {
        trash.addEventListener('click', (e) => {
            const id = trash.id
            const init = {
                method: "DELETE",
                headers: {"content-Type":"application/json"},
            }
            fetch('http://localhost:5678/api/works/' +id,init)
            .then((response)=> {
                if (!response.ok) {
                    console.log("La suppression n'a pas abouti")
                }
                return response.json()
            })
            .then((data) => {
                console.log("La suppression a réussie",data)
                displayWorksModal()
                displayWorks()
            })
        })
    })

}



