document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("uploadVitrineForm");

    if (!form) {
        console.error("❌ Formulaire non trouvé !");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fileInput = document.querySelector("#uploadVitrineForm input[type='file']");
        const file = fileInput.files[0];

        if (!file) {
            alert("Veuillez choisir un fichier à uploader.");
            return;
        }

        let publicIdBase;
        if (localStorage.getItem("role") === "ENTREPRISE") {
            publicIdBase = localStorage.getItem("nomEntreprise");
        } else {
            publicIdBase = localStorage.getItem("nom") + localStorage.getItem("prenom");
        }

        let email = localStorage.getItem("email");

        if (!publicIdBase) {
            alert("Nom ou nomEntreprise manquant dans localStorage.");
            return;
        }

        const uniqueId = crypto.randomUUID();
        const publicId = `${publicIdBase}_${uniqueId}`;

        console.log("Public ID généré :", publicId);

        const formData = new FormData();
        formData.append("email", email);
        formData.append("file", file);
        formData.append("publicId", publicId);

        try {
            const response = await fetch("http://localhost:3000/upload/vitrine", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const result = await response.json();
            alert(result.message || "Fichier uploadé avec succès !");
            console.log("Résultat de l'upload :", result);
            console.log("Image URL :", result.imageUrl);

            let images = JSON.parse(localStorage.getItem("imageUrls")) || [];
            images.push(result.imageUrl);
            localStorage.setItem("imageUrls", JSON.stringify(images));

        } catch (error) {
            console.error("Erreur lors de l'upload:", error);
            alert("Une erreur est survenue. Essayez encore.");
        }
    });
});
