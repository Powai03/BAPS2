document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche l'envoi traditionnel du formulaire

    let nom = document.querySelector('input[name="nom"]').value;
    let email = document.querySelector('input[name="email"]').value;
    let password = document.querySelector('input[name="password"]').value;
    let numero = document.querySelector('input[name="numero"]').value;
    let telephone = document.querySelector('input[name="telephone"]').value;
    let description = document.querySelector('input[name="description"]').value;
    let adresse = document.querySelector('input[name="adresse"]').value;
    let siteWeb = document.querySelector('input[name="siteweb"]').value;

    // Validation des champs
    if (!nom || !email || !password || !numero || !telephone || !description || !adresse || !siteWeb) {
        alert("Tous les champs doivent être remplis.");
        return;
    }

    try {
        let response = await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nom, email, password, numero, telephone, description, adresse, siteWeb }),
        });

        if (response.status === 201) {
            window.location.href = 'login.html'; // Rediriger vers la page de login après inscription réussie
        } else {
            const errorData = await response.json();
            alert(errorData.message || "Une erreur est survenue.");
        }
    } catch (error) {
        console.error("Erreur lors de la requête :", error);
        alert("Une erreur est survenue lors de l'inscription.");
    }
});
