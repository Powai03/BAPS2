document.getElementById("updateForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    const nom = document.getElementById("editNom").value.trim();
    const prenom = document.getElementById("editPrenom").value.trim();
    const nomEntreprise = document.getElementById("editNomCommerce")?.value.trim() || null;
    const email = document.getElementById("editEmail").value.trim();
    const password = document.getElementById("editPassword").value.trim();
    const telephone = document.getElementById("editTelephone").value.trim();
    const adresse = document.getElementById("editAdresse").value.trim();
    const complementAdresse = document.getElementById("editComplementAdresse").value.trim();
    const codePostal = document.getElementById("editCodePostal").value.trim();
    const siteWeb = document.getElementById("editSiteWeb").value.trim();

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Vous devez être connecté pour modifier votre profil.");
        return;
    }

    const formData = {
        nom: nom || null,
        prenom: prenom || null,
        nomEntreprise: nomEntreprise || null,
        email: email || null,
        password: password || null,
        telephone: telephone || null,
        adresse: adresse || null,
        complementAdresse: complementAdresse || null,
        codePostal: codePostal || null,
        siteWeb: siteWeb || null,
    };

    try {
        const response = await fetch("http://localhost:3000/user/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Votre demande de modification a été soumise pour validation.");
        } else {
            alert(`Erreur : ${data.message}`);
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi :", error);
        alert("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
});

