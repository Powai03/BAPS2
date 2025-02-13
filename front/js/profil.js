let token = localStorage.getItem('token');
console.log(token);
let userId = localStorage.getItem('userId');
console.log(userId);

// Si il n'est pas connecté il est redirigé vers la page de connexion
if (!token) {
    window.location.href = 'login.html';
}

// Récupération des informations de l'utilisateur
fetch('http://localhost:3000/user/', {
    headers: {
        'x-access-token': `${token}`,
    },
})
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        let user = document.querySelector('#profil');
        user.innerHTML += `
        <h1>${data.nom}</h1>
        <p>${data.email}</p>
        `;
        document.querySelector(".profildetail");
        user.innerHTML += `
        <p>Description : ${data.description}</p>
        <p>Numéro de téléphone : ${data.telephone}</p>
        <p>Adresse : ${data.adresse}</p>
        `;
    })
    .catch((error) => {
        console.log(error);
    });