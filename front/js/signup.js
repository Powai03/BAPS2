document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");

    async function handleSignup(event) {
        event.preventDefault();

        let formData = new FormData(signupForm);
        let jsonData = {};

        // Conversion FormData → JSON
        formData.forEach((value, key) => {
            jsonData[key] = value.trim();
        });

        // Vérification des champs obligatoires
        if (!jsonData.email || !jsonData.motdepasse || !jsonData.adresse) {
            alert("Tous les champs obligatoires doivent être remplis.");
            return;
        }

        // Vérification des mots de passe
        if (jsonData.motdepasse !== jsonData.confirm_motdepasse) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        // Ajout du type de compte
        jsonData.accountType = document.querySelector('input[name="accountType"]:checked').value;

        // Renommage "motdepasse" → "password" et suppression de confirm_motdepasse
        jsonData.password = jsonData.motdepasse;
        delete jsonData.motdepasse;
        delete jsonData.confirm_motdepasse;

        // Affichage des données envoyées pour debug
        console.log("🚀 Données envoyées :", JSON.stringify(jsonData));

        try {
            let response = await fetch("http://localhost:3000/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            });

            let result = await response.json();
            console.log("🔹 Réponse du serveur :", result);

            if (response.ok) {
                alert("Inscription réussie !");
                window.location.href = "login.html";
            } else {
                alert(result.message || "Une erreur est survenue.");
            }
        } catch (error) {
            console.error("❌ Erreur lors de l'inscription :", error);
            alert("Impossible de s'inscrire. Veuillez réessayer plus tard.");
        }
    }

    signupForm.addEventListener("submit", handleSignup);
});
