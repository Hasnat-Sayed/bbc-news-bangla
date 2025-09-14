const categoryContainer = document.getElementById("categoryContainer");
const newsContainer = document.getElementById("newsContainer");

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
      <li id="${cat.id}" class="py-1 hover:border-b-4 hover:border-red-600 border-red-600 cursor-pointer">${cat.title}</li>
      `;
  });

  //adds active state to main page 
  const mainPage = document.getElementById("main");
  mainPage.classList.add("border-b-4");
  

  //category clicked
  categoryContainer.addEventListener("click", (e) => {
    if (e.target.localName === "li") {
      const allLi = document.querySelectorAll("li");
      allLi.forEach((li) => {
        li.classList.remove("border-b-4");
      });


      //console.log(e.target)
      e.target.classList.add("border-b-4");
      loadNewsByCategory(e.target.id);
    }
  });
};


//news load
const loadNewsByCategory = (categoryId) => {
  
  fetch(`https://news-api-fs.vercel.app/api/categories/${categoryId}`)
    .then((res) => res.json())
    .then((data) => {
      showNewsByCategory(data.articles);
    })
    .catch((err) => {
      showError()
    });
};

//show news
const showNewsByCategory = (articles) => {

  newsContainer.innerHTML = "";
  articles.forEach((article) => {
    newsContainer.innerHTML += `
        <div class="border  border-gray-300 rounded-b-lg  flex flex-col" >
            <div>
             <img src="${article.image.srcset[5].url}"/>
            </div>
            <div id="${article.id}" class="p-2 flex flex-col flex-grow">
              <h1 class="font-extrabold">${article.title}</h1>
              <p class="text-sm">${article.time}</p>
              <div class="mt-auto flex gap-3">
                <button class="btn btn-outline flex-1">Bookmark</button>
                <button class="btn btn-outline  flex-1">View Details</button>
              </div>
                
            </div>
        </div>
        `;
  });
};

loadCategory();
loadNewsByCategory("main")

