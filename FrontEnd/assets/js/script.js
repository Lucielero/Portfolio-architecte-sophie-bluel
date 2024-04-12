//Récupération des travaux via l'API
let datas = []
const gallery = document.querySelector('.gallery')

fetch('http://localhost:5678/api/works')
    .then(res => res.json())
    .then(data => {
    datas = data
        //Suppression des travaux présents du HTML
        gallery.innerHTML =""

        //Ajout des travaux récupérés de la galerie 
        data.forEach (work => {
            createWork (work)
        })
    })

    .catch(error => {
        console.error ('Erreur lors de la récupération des données :', error)
        alert ('Une erreur s\'est produite lors de la récupération des données. Veuillez réessayer.')
    })

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
//Catégories
function filterCategories(id) {
    console.log('id ici:', id)
    console.log('datas dans filterCategories:', datas)

    const filteredElements = datas.filter((x) => x.categoryId == id) 
    console.log('filteredElements:', filteredElements);
    
    gallery.innerHTML =""
    filteredElements.forEach(work => {
        createWork(work)
    });
}
//Tous
function resetCategories() {
    gallery.innerHTML =""
    datas.forEach(work => {
        createWork(work)
    })
}
