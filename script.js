document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById("searchBar");
    const searchBtn = document.getElementById("searchBtn");
    const filterBtn = document.getElementById("filterBtn");
    const filterDropdown = document.getElementById("filterDropdown");
    const filterOptions = document.querySelectorAll(".filter-option");
    const recipes = document.querySelectorAll(".recipe-card");

    function performSearch() {
        let searchText = searchBar.value.toLowerCase().trim();
        recipes.forEach(recipe => {
            const title = recipe.querySelector(".recnam").textContent.toLowerCase();
            const country = recipe.closest("section").id;
            if (title.includes(searchText) || country.includes(searchText) || searchText === "") {
                recipe.style.display = "block";
            } else {
                recipe.style.display = "none";
            }
        });
    }

    searchBar.addEventListener("input", performSearch);
    searchBtn.addEventListener("click", function() {
        searchBar.focus();
        performSearch();
    });

    filterBtn.addEventListener("click", function() {
        filterDropdown.classList.toggle("hidden");
    });

    filterOptions.forEach(option => {
        option.addEventListener("click", function() {
            const filter = this.getAttribute("data-filter");
            recipes.forEach(recipe => {
                if (filter === "all") {
                    recipe.style.display = "block";
                } else if (recipe.querySelector(".category").classList.contains(filter)) {
                    recipe.style.display = "block";
                } else {
                    recipe.style.display = "none";
                }
            });
            filterDropdown.classList.add("hidden");
        });
    });

    document.addEventListener("click", function(event) {
        if (!filterBtn.contains(event.target) && !filterDropdown.contains(event.target)) {
            filterDropdown.classList.add("hidden");
        }
    });
});

function showProcedure(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }
}

function closeProcedure(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add("hidden");
        document.body.style.overflow = "auto";
    }
}