let activeCard = null;
let container = null;
let domaine_activite_array = [
    {domaine:"artisans", image:"./img/artisan.png"},
    {domaine:"commerce", image:"./img/commerce.png"},
    {domaine:"informatique", image:"./img/informatique.png"},
    {domaine:"immobilier", image:"./img/immobilier.png"},
    {domaine:"gestion", image:"./img/gestion.png"},
    {domaine:"services", image:"./img/service.png"},
    {domaine:"restauration", image:"./img/restauration.png"},
    {domaine:"sante", image:"./img/sante.png"},
];
const searchbar = document.getElementById("searchbar");
searchbar.addEventListener("input", () => {
    const searchValue = searchbar.value.toLowerCase();
    const cards = Array.from(container.children);
    cards.forEach(card => {
        const h3Elements = card.querySelectorAll("h3");
        let matchFound = false;
        h3Elements.forEach(h3 => {
            if (h3.textContent.toLowerCase().includes(searchValue)) {
                matchFound = true;
            }
        });
        card.style.display = matchFound ? "block" : "none";
    });
});

const domaineActiviteContainer = document.getElementById("domaineactivite");
domaine_activite_array.forEach(domaine => {
    const button = document.createElement("button");
    button.className = "text-white font-bold  w-auto h-auto rounded m-2 mt-4";
    button.innerHTML = `
        <img src="${domaine.image}" alt="${domaine.domaine}" class="w-auto h-16 inline-block">`;
    button.addEventListener("click", () => {
        filterEntreprisesByDomaine(domaine.domaine);
    });
    domaineActiviteContainer.appendChild(button);
});

let activeFilter = null;

const filterEntreprisesByDomaine = (domaine) => {
    if (activeFilter === domaine) {
        activeFilter = null;
    } else {
        activeFilter = domaine;
    }

    const cards = Array.from(container.children);
    cards.forEach(card => {
        if (card.id === domaine || activeFilter === null) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
};

const fetchEntreprises = async () => {
    try {
        const response = await fetch("http://localhost:3000/user/entreprises");
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        const entreprises = await response.json();
        console.log("🏢 Entreprises récupérées :", entreprises);

        container = document.getElementById("displayEntreprise");
        container.innerHTML = "";
        container.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 auto-rows-[minmax(100px,_auto)] transition-all duration-300"; 

        if (entreprises.length === 0) {
            container.innerHTML = "<p class='text-gray-500'>Aucune entreprise trouvée.</p>";
            return;
        }

        entreprises.forEach((entreprise, index) => {
            const entrepriseDiv = document.createElement("div");
            entrepriseDiv.id = entreprise.domaineActivite || "domaine-inconnu";
            entrepriseDiv.classList.add(
                "bg-white",  "rounded-2xl","justify-between", "overflow-hidden", 
                "flex", "flex-col", "cursor-pointer", 
                "transition-all", "duration-500", // Augmentation de la durée pour plus de fluidité
                "relative"
            );

            entrepriseDiv.setAttribute("data-index", index);

            const hasImages = entreprise.images && entreprise.images.length > 0;
            const carouselContent = hasImages
                ? entreprise.images.map((img) => `
                    <div class="carousel-item w-full flex-shrink-0">
                        <img src="${img.url}" alt="Image" class="w-full h-72 object-cover rounded-lg">
                    </div>
                `).join("")
                : `<div class="carousel-item w-full flex-shrink-0">
                    <img src="${entreprise.logo}" alt="Logo" class="w-full h-56 object-cover rounded-lg">
                </div>`;

            entrepriseDiv.innerHTML = `
                <div id="entrepriseDiv" class="relative overflow-hidden w-full h-56">
                    <div class="carousel-container flex w-full transition-transform duration-300 ease-in-out">${carouselContent}</div>
                    <button class="prev absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-100 p-1 rounded-full z-10 text-xs">\<</button>
                    <button class="next absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-100 p-1 rounded-full z-10 text-xs">\></button>
                </div>
                <div>
                <h3 id="entrepriseNom" class="text-lg font-semibold text-gray-800 text-left pl-2 mt-2 ">
                    ${entreprise.profession || "Profession inconnue"}
                </h3>
                <h3 class="text-md text-gray-600 text-left pl-2 mt-2 ">
                    ${entreprise.nomEntreprise || `${entreprise.nom} ${entreprise.prenom}` || "Nom inconnu"}
                </h3>
                </div>
                <div class="extra-info hidden mt-2 flex flex-col w-full ">
                    <p class="text-white pl-2 text-sm"><strong>Description :</strong> ${entreprise.description || "Pas de description"}</p>
                    <span class="border-t-2 border-white w-full my-2"></span>
                    <div class="flex flex-row justify-between pb-2">
                        <div class="flex flex-col w-auto h-[100%] justify-between">
                            <p class="text-white pl-2 text-sm"><strong>Adresse :</strong> ${entreprise.adresse || "Non renseignée"}</p>
                            <p class="text-white pl-2 text-sm"><strong>Téléphone :</strong> ${entreprise.telephone || "Non renseigné"}</p>
                            <p class="text-white pl-2 text-sm"><strong>Site web :</strong> ${entreprise.siteWeb ? `<a href="${entreprise.siteWeb}" target="_blank" class="text-white underline">${entreprise.siteWeb}</a>` : "Non renseigné"}</p>
                        </div>
                        ${entreprise.logo ? `<img src="${entreprise.logo}" class="w-16 h-16 rounded-full mr-2" alt="Logo">` : ""}
                    </div>
                </div>
            `;

            container.appendChild(entrepriseDiv);

            setupCarousel(entrepriseDiv);

            entrepriseDiv.addEventListener("click", () => toggleCardSize(entrepriseDiv, index));
        });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des entreprises :", error);
    }
};

const setupCarousel = (entrepriseDiv) => {
    const container = entrepriseDiv.querySelector(".carousel-container");
    const items = Array.from(container.children);
    let index = 0;

    const showSlide = (newIndex) => {
        if (newIndex < 0) newIndex = items.length - 1;
        if (newIndex >= items.length) newIndex = 0;
        container.style.transform = `translateX(-${newIndex * 100}%)`;
        index = newIndex;
    };

    entrepriseDiv.querySelector(".prev").addEventListener("click", (e) => {
        e.stopPropagation();
        showSlide(index - 1);
    });

    entrepriseDiv.querySelector(".next").addEventListener("click", (e) => {
        e.stopPropagation();
        showSlide(index + 1);
    });
};

const toggleCardSize = (clickedCard, index) => {
    const entrepriseDiv = clickedCard.querySelector("#entrepriseDiv");
    const nameElement = clickedCard.querySelector("#entrepriseNom"); // Sélectionne uniquement le nom d'entreprise / prénom nom

    // 1. Diminuer l'opacité progressivement avant le changement
    container.style.transition = "opacity 0.3s ease-out";
    container.style.opacity = "0";

    setTimeout(() => {
        // 2. Repositionner les cartes pendant que l'opacité est à 0
        reorderCards(index);

        // 3. Appliquer la nouvelle taille après le repositionnement
        if (activeCard === clickedCard) {
            clickedCard.classList.remove("lg:col-span-2", "lg:row-span-2", "h-112", "lg:h-112", "bg-gradient-to-r", "from-[#0D23D2]", "to-[#0022FF]");
            clickedCard.querySelector(".extra-info").classList.add("hidden");

            entrepriseDiv.classList.add("overflow-hidden"); // Remettre le overflow-hidden

            // Remettre uniquement le nom d'entreprise/prénom nom à mt-2
            nameElement.classList.remove("text-white");
            nameElement.classList.add("text-gray-800");
            clickedCard.querySelectorAll("h3").forEach(h3 => {
                h3.classList.remove("text-white");
                h3.classList.add("text-gray-600");
            });
            activeCard = null;
        } else {
            if (activeCard) {
                activeCard.classList.remove("lg:col-span-2", "lg:row-span-2", "h-112", "lg:h-112", "bg-gradient-to-r", "from-[#0D23D2]", "to-[#0022FF]");
                activeCard.querySelector(".extra-info").classList.add("hidden");

                // Remettre overflow-hidden sur l'ancienne carte active
                const prevEntrepriseDiv = activeCard.querySelector("#entrepriseDiv");
                prevEntrepriseDiv.classList.add("overflow-hidden");

                                // Remettre uniquement le nom d'entreprise/prénom nom de l'ancienne carte à mt-2
                                activeCard.querySelector("#entrepriseNom").classList.remove( "text-white");
                                activeCard.querySelector("#entrepriseNom").classList.add( "text-gray-800");
                                activeCard.querySelectorAll("h3").forEach(h3 => {
                                    h3.classList.remove("text-white");
                                    h3.classList.add("text-gray-600");
                                });
                            }

                            clickedCard.classList.add("lg:col-span-2", "lg:row-span-2", "h-112", "lg:h-112", "bg-gradient-to-r", "from-[#0D23D2]", "to-[#0022FF]");
                            clickedCard.classList.remove("h-40", "lg:h-48");
                            clickedCard.querySelector(".extra-info").classList.remove("hidden");

                            entrepriseDiv.classList.remove("overflow-hidden"); // Retirer overflow-hidden pour afficher le contenu

                            // Passer uniquement le nom d'entreprise/prénom nom en mt-16
                            nameElement.classList.remove( "text-gray-800");
                            nameElement.classList.add( "text-white");
                            
                            clickedCard.querySelectorAll("h3").forEach(h3 => {
                                h3.classList.remove("text-gray-600");
                                h3.classList.add("text-white");
                            });

            activeCard = clickedCard;
        }

        // 4. Rétablir l'opacité progressivement après la transition
        setTimeout(() => {
            container.style.opacity = "1";
        }, 300); // Temps de synchronisation avec la transition CSS

    }, 300); // Attendre que l'opacité atteigne 0 avant de repositionner
};


const reorderCards = (bigIndex = null) => {
    const cards = Array.from(container.children);

    cards.forEach((card, i) => {
        card.style.order = i;
    });

    if (bigIndex !== null && bigIndex % 4 === 3) {
        const thirdCard = cards[bigIndex - 1];
        if (thirdCard) thirdCard.style.order = bigIndex + 1;
    }
};


fetchEntreprises();
