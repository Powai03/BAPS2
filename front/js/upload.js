const form = document.getElementById("uploadForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Veuillez choisir un fichier à uploader.");
        return;
    }

    let publicId;
    if (localStorage.getItem("role") === "ENTREPRISE") {
        publicId = localStorage.getItem("nomEntreprise");
    } else {
        publicId = localStorage.getItem("nom") + localStorage.getItem("prenom");
    }

    console.log("Public ID récupéré :", publicId);

    if (!publicId) {
        alert("Nom ou nomEntreprise manquant dans localStorage.");
        return;
    }

    // Création d'un FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append("file", file);
    formData.append("publicId", publicId); // Ajout du publicId au formData

    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData, // Envoi du fichier
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || "Fichier uploadé avec succès !");
        console.log("Résultat de l'upload :", result);

    } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        alert("Une erreur est survenue. Essayez encore.");
    }
});
