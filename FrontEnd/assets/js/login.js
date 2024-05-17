//Gestion du formulaire de connexion

function loginformSubmission(event) {
    event.preventDefault() //empêcher le reload de la page afin d'éviter des perte de données
    console.log("Formulaire soumis")
    const emailInput = document.getElementById("email")
    const passwordInput = document.getElementById("password")
    //console.log(email,password)

    //Récupérer les éléments notés par l'utilisateur
    const email = emailInput.value.trim() //trim = retirer les éventuels espaces vides 
    const password = passwordInput.value.trim()
    console.log("Email:", email);
    console.log("Password:", password);

    //Requête à l'API
    console.log("Envoi de la requête à l'API...")
    fetch ("http://localhost:5678/api/users/login", {
        method:"POST", //envoi des données
        //format :
        headers: {
            "Content-Type": "application/json"
        },
        //corps de la requête :   
        body: JSON.stringify({email,password})
    })
       
    .then(response => {
        console.log("Réponse de l'API reçue");
        if (!response.ok) {
            throw new Error("Une erreur est survenue lors de la requête")
        }
        return response.json()
    })

    .then(data => {
        console.log("Données de réponse de l'API:", data)
        if (data && data.token) {
            //Redirection page d'accueil 
            console.log("authentification réussie")
            window.location.href = "../index.html"

        } else {
            console.log("Echec autentification")
            //Affichage message d'erreur mauvais identifiants ou mdp
            throw new Error("Erreur dans l'identifiant ou le mot de passe")
        }
    })
}

const loginForm = document.getElementById("login-form")
const submitButton = document.getElementById("submit-button")

submitButton.addEventListener("submit", loginformSubmission)