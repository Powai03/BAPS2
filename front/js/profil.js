document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Vous devez être connecté pour accéder à cette page.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token,
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const user = await response.json();
        console.log("Utilisateur récupéré :", user);

        // Sélection des éléments HTML
        const profilView = document.getElementById("profileView");
        const entrepriseSection = document.getElementById("entreprise-info");

        // Champs personnels
        const nom = document.getElementById("nom");
        const prenom = document.getElementById("prenom");
        const email = document.getElementById("email");
        const telephone = document.getElementById("telephone");
        const adresse = document.getElementById("adresse");

        // Champs entreprise
        const siren = document.getElementById("siren");
        const nomCommerce = document.getElementById("nom_commerce");

        // Affichage des données générales
        email.textContent = user.email || "Non renseigné";
        telephone.textContent = user.telephone || "Non renseigné";
        adresse.textContent = user.adresse || "Non renseigné";
        siren.textContent = user.numero || "Non renseigné"; // SIREN s'affiche pour tous

        // Gestion spécifique selon le rôle
        if (user.role === "ENTREPRISE") {
            entrepriseSection.classList.remove("hidden"); // Afficher le bloc entreprise
            nomCommerce.textContent = user.nomEntreprise || "Non renseigné";

            // Cacher Nom & Prénom (pas nécessaire pour une entreprise)
            nom.parentElement.classList.add("hidden");
            prenom.parentElement.classList.add("hidden");

        } else {
            // Pour les microentreprises, afficher Nom & Prénom
            nom.textContent = user.nom || "Non renseigné";
            prenom.textContent = user.prenom || "Non renseigné";

            // Cacher Nom du Commerce
            nomCommerce.parentElement.classList.add("hidden");
        }

    } catch (error) {
        console.error("Erreur :", error);
    }
});
