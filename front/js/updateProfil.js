document.getElementById("updateForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Vous devez être connecté pour modifier votre profil.");
        return;
    }

    // Récupération des valeurs modifiées
    const updatedData = {
        telephone: document.getElementById("editTelephone").value,
        adresse: document.getElementById("editAdresse").value,
        logo: document.getElementById("editLogo").value  // Si tu ajoutes un champ logo pour l'upload
    };

    if (document.getElementById("editSiren")) {
        updatedData.siren = document.getElementById("editSiren").value;
        updatedData.nomEntreprise = document.getElementById("editNomCommerce").value;
    }

    try {
        const response = await fetch("http://localhost:3000/user/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token,
            },
            body: JSON.stringify(updatedData),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Erreur lors de la mise à jour");
        }

        alert("Profil mis à jour avec succès !");
        window.location.reload();

    } catch (error) {
        console.error("Erreur :", error);
        alert("Une erreur est survenue lors de la mise à jour.");
    }
});
