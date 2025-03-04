document.addEventListener("DOMContentLoaded", () => {
    const microForm = document.getElementById("signup-form-micro");
    const entrepriseForm = document.getElementById("signup-form-entreprise");

    async function handleSignup(event, type) {
        event.preventDefault();

        let formData = new FormData(event.target);
        let jsonData = Object.fromEntries(formData.entries());

        // Remplacement de "motdepasse" par "password"
        jsonData.password = jsonData.motdepasse;
        delete jsonData.motdepasse;

        // Ajout du type utilisateur
        jsonData.type = type;

        try {
            let response = await fetch("http://localhost:3000/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            });

            if (response.ok) {
                window.location.href = "login.html"; // Redirection après inscription réussie
            } else {
                let errorData = await response.json();
                alert(errorData.message || "Une erreur est survenue.");
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            alert("Impossible de s'inscrire. Veuillez réessayer plus tard.");
        }
    }

    microForm.addEventListener("submit", (event) => handleSignup(event, "MICRO_ENTREPRISE"));
    entrepriseForm.addEventListener("submit", (event) => handleSignup(event, "ENTREPRISE"));
});
