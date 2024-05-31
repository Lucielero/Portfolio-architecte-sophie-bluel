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

// MODALE //

//Affichage et fermeture modale
const editButton = document.getElementById("editbtn"); //bouton modifier (à déclarer en haut à la fin)
const modalWrapper = document.querySelector(".modal-wrapper") //container parent
const closeModalBtn = document.querySelector(".close-btn"); //croix de fermeture

function displayModal () {
    //Affichage modale
    editButton.addEventListener("click", () => {
        modalWrapper.style.display = "flex";
    });
    //Croix fermeture modale
    closeModalBtn.addEventListener("click", () => {
        modalWrapper.style.display = "none";
    });
    //Fermeture hors container 
    modalWrapper.addEventListener("click", (e) => {
    if (e.target.className == "modal-wrapper") {
        modalWrapper.style.display = "none"
    }
})}
displayModal()

//Affichage des works dans la modale
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

//Supression d'images dans la modale    
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
deleteWorks()

//Affichage 2ème modale 
const modalWorksGallery = document.querySelector(".modal-principale") //1ère modale
const btnAddModal = document.querySelector (".modal-principale-btn") //bouton ajouter photo 1ère modale
const modalAddImg = document.querySelector (".modal-secondaire") //2ème modale 
const backArrow = document.querySelector (".return-back-arrow") //flèche 2ème modale 
const closeScndModal = document.querySelector(".close-btn-2nd-modal"); //croix fermeture 2ème modale 

function displayAddModal () {
    btnAddModal.addEventListener("click",() => {
        modalAddImg.style.display = "flex"
        modalWorksGallery.style.display = "none"
    })
    //Flèche retour en arrière
    backArrow.addEventListener("click", () => {
        modalAddImg.style.display = "none"
        modalWorksGallery.style.display = "flex"
    })
    //Croix fermeture modale
    closeScndModal.addEventListener("click", () => {
        modalWrapper.style.display = "none";
    })
}
displayAddModal()

//Prévisualisation img
const imgPreview = document.querySelector(".case img") 
const inputFile = document.querySelector(".case input")
const labelFile = document.querySelector(".case label")
const iconFile = document.querySelector(".case .img-icon")
const pFile = document.querySelector(".case p")

inputFile.addEventListener("change", () => {
    const file = inputFile.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = function (e) {
            imgPreview.src = e.target.result
            imgPreview.style.display = "flex"
            labelFile.style.display = "none"
            iconFile.style.display = "none"
            pFile.style.display = "none"
        }
        reader.readAsDataURL(file)
    }
})

//Céation de catégories dans l'input select 2ème modale
async function displayCategoriesModal () {
    const select = document.querySelector(".modal-secondaire select")
    const formCategories = await getCategories() 
    formCategories.forEach(category => {
        const option = document.createElement('option')
        option.value = category.id
        option.textContent = category.name
        select.appendChild(option)
})
}
displayCategoriesModal ()

//Ajout d'img 
const form = document.querySelector(".modal-secondaire form")
const title = document.querySelector(".modal-secondaire #title")
const category = document.querySelector(".modal-secondaire #category")

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form); 
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur dans la réponse du serveur ' + response.statusText);
        }
        return response.json(); 
    })
    .then(data => {
        console.log(data);
        console.log("Image ajoutée", data);
        displayWorksModal();
        displayWorks();
    })
    .catch(error => {
        console.error('Problème avec le fetch:', error);
    });
});

//Vérification des paramètres pour l'ajout d'img
function verifyForm () {
    const submitImgBtn = document.getElementById("submit-img-btn")
}
verifyForm()