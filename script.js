const categoryContainer = document.getElementById("categoryContainer");


//load categories
const loadCategory = () => {
  fetch("https://news-api-fs.vercel.app/api/categories")
    .then((res) => res.json())
    .then((data) => {
      const categories = data.categories;
      showCategory(categories);
    })
    .catch((err) => {
      console.log(err);
    });
};

//show categories
const showCategory = (categories) => {
  categories.forEach((cat) => {
    categoryContainer.innerHTML += `
      <li id="${cat.id}" class="border-transparent border-b-4 py-1 border-red-600 hover:border-red-600 cursor-pointer">${cat.title}</li>
      `;
  });

  //active border
  categoryContainer.addEventListener("click", (e) => {
    const allLi = document.querySelectorAll("li");
    allLi.forEach((li) => {
      li.classList.remove("border-b-4");
    });

    if (e.target.localName === "li") {;
      showLoading()
      e.target.classList.add("border-b-4");
      loadNewsByCategory(e.target.id);
    }
  });
};

loadCategory();

