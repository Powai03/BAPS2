const form = document.getElementById("uploadForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();  // Empêche l'envoi du formulaire traditionnel

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Veuillez choisir un fichier à uploader.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Affiche un message de succès
            const imageUrl = result.logo; // L'URL de l'image renvoyée par le backend
            console.log("Image URL:", imageUrl);

            // Envoi de l'URL de l'image à la base de données (ajoute un endpoint pour cela dans ton backend)
            const token = localStorage.getItem("token");

            const updateResponse = await fetch('http://localhost:3000/user/updateProfileImage', { // Route pour mettre à jour l'image
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
                body: JSON.stringify({ logo: imageUrl }),
            });

            const updateResult = await updateResponse.json();
            if (updateResult.message) {
                // Mettez à jour l'image sur la page de profil après l'upload
                document.getElementById("profileLogo").src = imageUrl;
                alert("L'image a été mise à jour avec succès dans le profil !");
            } else {
                alert("Erreur lors de la mise à jour du profil !");
            }

        } else {
            alert(result.message);
        }

    } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        alert("Une erreur est survenue. Essayez encore.");
    }
});
