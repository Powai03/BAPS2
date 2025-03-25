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

        
        const justificatifBtn = document.getElementById("justificatif");
                    if (user.etatCreation === true){
                        justificatifBtn.style.display = "none";
                    }

        // Sélection des éléments HTML
        const displayImages = document.getElementById("displayImages"); // Ajout de la div pour afficher les images

        // Champs personnels
        const nom = document.getElementById("nom");
        const prenom = document.getElementById("prenom");
        const email = document.getElementById("email");
        const telephone = document.getElementById("telephone");
        const adresse = document.getElementById("adresse");
        const siteWeb = document.getElementById("siteWeb");
        const domaineActivite = document.getElementById("domaineActivite");
        const profession = document.getElementById("profession");
        const description = document.getElementById("description");

        // Champs entreprise
        const nomCommerce = document.getElementById("nomEntreprise");

        // Affichage des données générales
        email.textContent = user.email || "Non renseigné";
        telephone.textContent = user.telephone || "Non renseigné";
        adresse.textContent = user.adresse || "Non renseigné";
        siteWeb.textContent = user.siteWeb || "Non renseigné";
        domaineActivite.textContent = user.domaineActivite || "Non renseigné";
        profession.textContent = user.profession || "Non renseigné";
        description.textContent = user.description || "Non renseigné";

        document.querySelector(
            ".logoentreprise"
        ).innerHTML = `<img src="${user.logo}" alt="Logo de l'entreprise">`; //mettre le tailwind ici
        document.getElementById(
            "identiteImage"
        ).innerHTML = `<img src="${user.pieceIdentite}" alt="Pièce d'identité">`; //mettre le tailwind ici
        document.getElementById(
            "numeroImage"
        ).innerHTML = `<img src="${user.justificatif}" alt="Justificatif SIEN/CESU">`; //mettre le tailwind ici
        // Gestion spécifique selon le rôle
        if (user.role === "ENTREPRISE" || user.role === "ADMIN") {
            nomCommerce.textContent = user.nomEntreprise || "Non renseigné";

            // Cacher Nom & Prénom (pas nécessaire pour une entreprise)
            nom.parentElement.classList.add("hidden");
            prenom.parentElement.classList.add("hidden");
        } else if (user.role === "AUTO_ENTREPRENEUR") {
            // Pour les microentreprises, afficher Nom & Prénom
            nom.textContent = user.nom || "Non renseigné";
            prenom.textContent = user.prenom || "Non renseigné";
        }

        // 🔥 Affichage des images de l'utilisateur
        if (user.images && user.images.length > 0) {
            displayImages.innerHTML = ""; // Vide la div avant d'ajouter les images
            user.images.forEach((imageUrl) => {
                const imgElement = document.createElement("img");
                imgElement.src = imageUrl;
                imgElement.alt = "Image de l'utilisateur";
                imgElement.classList.add("user-image"); // Ajoute une classe pour le CSS
                displayImages.appendChild(imgElement);
            });
        } else {
            displayImages.innerHTML = "<p>Aucune image disponible.</p>";
        }
        if (user.pieceIdentite) {
            const imgElement = document.createElement("img");
            imgElement.src = user.pieceIdentite;
            imgElement.alt = "Image de l'utilisateur";
            imgElement.classList.add("user-image"); // Ajoute une classe pour le CSS
            displayImages.appendChild(imgElement);
        }
        if (user.justificatif) {
            const imgElement = document.createElement("img");
            imgElement.src = user.justificatif;
            imgElement.alt = "Image de l'utilisateur";
            imgElement.classList.add("user-image"); // Ajoute une classe pour le CSS
            displayImages.appendChild(imgElement);
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
});

const fetchUserImages = async () => {
    try {
        const response = await fetch("http://localhost:3000/user/images", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token"),
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const images = await response.json();
        console.log("🖼 Images utilisateur :", images);

        const displayImages = document.getElementById("displayImages");
        if (images.length > 0) {
            displayImages.innerHTML = "";
            images.forEach((img) => {
                const imgElement = document.createElement("img");
                imgElement.src = img.url;
                imgElement.alt = `Image ${img.type}`;
                imgElement.classList.add("user-image");
                imgElement.classList.add("w-24", "h-24"); //on met le tailwind ici et on les sépare par des virgules sinon il peut pas lire le html
                displayImages.appendChild(imgElement);
            });
        } else {
            displayImages.innerHTML = "<p>Aucune image disponible.</p>";
        }
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des images :", error);
    }
};

// Appeler cette fonction après la récupération des infos utilisateur
document.addEventListener("DOMContentLoaded", async () => {
    await fetchUserImages();
});

document.addEventListener("DOMContentLoaded", async () => {
    await fetchUsers(false, "validation"); // Liste des demandes d'inscription
    await fetchUsers(true, "annuaire"); // Liste des utilisateurs validés
});

// 🔍 Fonction pour récupérer les utilisateurs (en attente ou validés)
const fetchUsers = async (etatCreation, containerClass) => {
    try {
        const response = await fetch(
            `http://localhost:3000/user/users?etatCreation=${etatCreation}`
        );
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        const users = await response.json();
        console.log(
            `📋 Utilisateurs (${etatCreation ? "validés" : "en attente"}) :`,
            users
        );

        const container = document.querySelector(`.${containerClass}`);
        container.innerHTML = ""; // Vide la section avant d'ajouter les utilisateurs

        if (users.length === 0) {
            container.innerHTML = "<p>Aucun utilisateur trouvé.</p>";
            return;
        }

        users.forEach((user) => {
            const userDiv = document.createElement("div");
            userDiv.classList.add("user-card");

            userDiv.innerHTML = `
                <table class="text-white">
                    <tr>
                        <td><strong>Nom :</strong></td>
                        <td>${user.nomEntreprise || `${user.nom} ${user.prenom}`}</td>
                    </tr>
                    <tr>
                        <td><strong>SIREN/CESU :</strong></td>
                        <td>${user.numero || "Non renseigné"}</td>
                    </tr>
                    <tr>
                        <td><strong>Email :</strong></td>
                        <td>${user.email}</td>
                    </tr>
                    <tr>
                        <td><strong>Rôle :</strong></td>
                        <td>${user.role}</td>
                    </tr>
                    <tr>
                        <td><strong>Documents :</strong></td>
                        <td>
                            ${user.justificatif ? `<a href="${user.justificatif}" target="_blank" class="text-white underline">Justificatif</a>` : "Non renseigné"} 
                            ${user.pieceIdentite ? `<a href="${user.pieceIdentite}" target="_blank" class="text-white underline">Pièce d'identité</a>` : "Non renseigné"}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="actions">
                            ${etatCreation ? "" // Si l'utilisateur est déjà validé, pas de boutons
                                : `<button class="validate-btn text-white" data-id="${user.id}">✅ Valider</button>
                                   <button class="delete-btn text-white" data-id="${user.id}">❌ Supprimer</button>`
                            }
                        </td>
                    </tr>
                </table>
            `;

            container.appendChild(userDiv);
        });

        // Ajouter les event listeners après avoir créé les boutons
        document.querySelectorAll(".validate-btn").forEach((btn) => {
            btn.addEventListener("click", () => validateUser(btn.dataset.id));
        });

        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", () => deleteUser(btn.dataset.id));
        });
    } catch (error) {
        console.error(
            "❌ Erreur lors de la récupération des utilisateurs :",
            error
        );
    }
};

// ✅ Fonction pour valider un utilisateur
const validateUser = async (userId) => {
    try {
        const response = await fetch(
            `http://localhost:3000/user/users/validate/${userId}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            }
        );

        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        alert("Utilisateur validé avec succès !");
        await fetchUsers(false, "validation"); // Rafraîchir la liste des demandes
        await fetchUsers(true, "annuaire"); // Rafraîchir l'annuaire
    } catch (error) {
        console.error("❌ Erreur lors de la validation :", error);
    }
};

// ❌ Fonction pour supprimer un utilisateur
const deleteUser = async (userId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?"))
        return;

    try {
        const response = await fetch(
            `http://localhost:3000/user/users/${userId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            }
        );

        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        alert("Utilisateur supprimé avec succès !");
        await fetchUsers(false, "validation"); // Rafraîchir la liste des demandes
    } catch (error) {
        console.error("❌ Erreur lors de la suppression :", error);
    }
};

const fetchModifications = async () => {
    try {
        const response = await fetch(
            "http://localhost:3000/user/modifications"
        );
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        const modifications = await response.json();
        console.log("📋 Modifications en attente :", modifications);

        const container = document.querySelector(".modificationValidation");
        container.innerHTML = "<h1>Demandes de modification</h1>";

        if (modifications.length === 0) {
            container.innerHTML +=
                "<p>Aucune demande de modification en attente.</p>";
            return;
        }

        modifications.forEach((modif) => {
            const modifDiv = document.createElement("div");
            modifDiv.classList.add("modification-card");

            modifDiv.innerHTML = `
                <p class="text-white"><strong>Utilisateur :</strong> ${modif.utilisateur.nom} ${
                modif.utilisateur.prenom
            } (${modif.utilisateur.email})</p>
                <p class="text-white"><strong>Nouvelles données :</strong></p>
                <ul>
                    ${modif.nom ? `<li class="text-white">Nom : ${modif.nom}</li>` : ""}
                    ${modif.prenom ? `<li class="text-white">Prénom : ${modif.prenom}</li>` : ""}
                    ${
                        modif.nomEntreprise
                            ? `<li class="text-white">Entreprise : ${modif.nomEntreprise}</li>`
                            : ""
                    }
                    ${modif.email ? `<li class="text-white">Email : ${modif.email}</li>` : ""}
                    ${
                        modif.telephone
                            ? `<li class="text-white">Téléphone : ${modif.telephone}</li>`
                            : ""
                    }
                    ${
                        modif.adresse
                            ? `<li class="text-white">Adresse : ${modif.adresse}</li>`
                            : ""
                    }
                    ${
                        modif.siteWeb
                            ? `<li class="text-white">Site Web : ${modif.siteWeb}</li>`
                            : ""
                    }
                    ${
                        modif.description
                            ? `<li class="text-white">Description : ${modif.description}</li>`
                            : ""
                    }
                </ul>
                <div class="actions">
                    <button class="validate-modif-btn text-white" data-id="${
                        modif.id
                    }">✅ Valider</button>
                    <button class="reject-modif-btn text-white" data-id="${
                        modif.id
                    }">❌ Refuser</button>
                </div>
            `;

            container.appendChild(modifDiv);
        });

        // Ajouter les event listeners pour les boutons
        document.querySelectorAll(".validate-modif-btn").forEach((btn) => {
            btn.addEventListener("click", () =>
                validateModification(btn.dataset.id)
            );
        });

        document.querySelectorAll(".reject-modif-btn").forEach((btn) => {
            btn.addEventListener("click", () =>
                rejectModification(btn.dataset.id)
            );
        });
    } catch (error) {
        console.error(
            "❌ Erreur lors de la récupération des modifications :",
            error
        );
    }
};

// Fonction pour valider une modification
const validateModification = async (modifId) => {
    try {
        const response = await fetch(
            `http://localhost:3000/user/modifications/validate/${modifId}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            }
        );

        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        alert("Modification validée avec succès !");
        fetchModifications(); // Rafraîchir la liste
    } catch (error) {
        console.error("❌ Erreur lors de la validation :", error);
    }
};

// Fonction pour refuser une modification
const rejectModification = async (modifId) => {
    if (!confirm("Êtes-vous sûr de vouloir refuser cette modification ?"))
        return;

    try {
        const response = await fetch(
            `http://localhost:3000/user/modifications/reject/${modifId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            }
        );

        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        alert("Modification refusée !");
        fetchModifications(); // Rafraîchir la liste
    } catch (error) {
        console.error("❌ Erreur lors du refus :", error);
    }
};

// Charger les modifications au démarrage
document.addEventListener("DOMContentLoaded", fetchModifications);

document.addEventListener("DOMContentLoaded", () => {
    document
        .getElementById("descriptionForm")
        .addEventListener("submit", async (event) => {
            event.preventDefault();

            const descriptionField = document.getElementById("descriptionArea");
            if (!descriptionField) {
                console.error(
                    "L'élément textarea#description n'a pas été trouvé."
                );
                return;
            }

            const description = descriptionField.value;
            console.log("📩 Valeur récupérée du champ :", description);
            const token = localStorage.getItem("token");

            if (!token) {
                alert(
                    "Vous devez être connecté pour modifier votre description."
                );
                return;
            }

            const formData = { description: description || null };

            try {
                const response = await fetch(
                    "http://localhost:3000/user/update",
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "x-access-token": token,
                        },
                        body: JSON.stringify(formData),
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    alert("Votre description a été soumise pour validation.");
                } else {
                    alert(`Erreur : ${data.message}`);
                }
            } catch (error) {
                console.error("Erreur lors de l'envoi :", error);
                alert("Une erreur est survenue. Veuillez réessayer plus tard.");
            }
        });
});
