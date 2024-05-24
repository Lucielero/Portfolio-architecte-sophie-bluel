//Variables
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const loginForm = document.getElementById("login-form")
const errorMessage = document.getElementById("error-message")


//Gestion du formulaire de connexion
function loginformSubmission(event) {
    
    event.preventDefault() 
    //Récupération des éléments notés par l'utilisateur
    const email = emailInput.value.trim() //trim = retirer les éventuels espaces vides 
    const password = passwordInput.value.trim()
    //Requête à l'API
    fetch ("http://localhost:5678/api/users/login", {
        method:"POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email,password})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Une erreur est survenue lors de la requête")
        }
        return response.json()
    })
    .then(data => {
        if (data && data.token) {
            //Redirection page d'accueil 
            window.localStorage.setItem("token", data.token) //token ajouté
            window.location.href = "../index.html"
        } else {
            //Affichage message d'erreur mauvais identifiants ou mdp
            errorMessage.style.display = "block"
            errorMessage.textContent ="Erreur dans l'identifiant ou le mot de passe"
        }
    })
    .catch(error => {
        console.error(error)
        errorMessage.style.display = "block"
        errorMessage.innerHTML = "Une erreur est survenue lors de la requête"
    })
}

//Sélection du formulaire et ajout d'écouteur d'événement pour la soumission
loginForm.addEventListener("submit", loginformSubmission)

//Vérification du token au chargement de la page 
window.addEventListener("load", function() {
    const token = localStorage.getItem("token");
    if (token) {
        //L'utilisateur est connecté, redirection vers la page d'accueil
        window.location.href = "../index.html";
    }
});