document.addEventListener("DOMContentLoaded", () => {
    const handleUpload = async (formId, inputId, type) => {
        const form = document.getElementById(formId);
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const fileInput = document.getElementById(inputId);
            const file = fileInput.files[0];

            if (!file) {
                alert("Veuillez choisir un fichier.");
                return;
            }

            const publicId = `${localStorage.getItem("email")}_${type}`;
            console.log("Public ID généré :", publicId);
            const email = localStorage.getItem("email");

            const formData = new FormData();
            formData.append("file", file);
            formData.append("publicId", publicId);
            formData.append("email", email);
            formData.append("type", type);

            try {
                const response = await fetch("http://localhost:3000/upload/justificatif", {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();
                if (response.ok) {
                    alert("Fichier uploadé avec succès !");
                    localStorage.setItem(`${type}Url`, result.imageUrl);
                } else {
                    alert(`Erreur : ${result.message}`);
                }
            } catch (error) {
                console.error("Erreur lors de l'upload :", error);
                alert("Une erreur est survenue.");
            }
        });
    };

    handleUpload("identiteForm", "identiteInput", "pieceIdentite");
    handleUpload("numeroForm", "numeroInput", "justificatif");
});
