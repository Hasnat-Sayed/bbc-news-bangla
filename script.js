const categoryContainer = document.getElementById("categoryContainer");
const newsContainer = document.getElementById("newsContainer");
const bookmarkContainer = document.getElementById("bookmarkContainer");
const bookmarkCount = document.getElementById('bookmarkCount')
const newsDetailsModal = document.getElementById('news-details-modal')
const modalContainer = document.getElementById('modalContainer')


let bookmarks = [];

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


      showLoading()
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

  if (articles.length === 0) {
    showEmptyMessage()
    
    return
  }
  newsContainer.innerHTML = "";
  articles.forEach((article) => {
    newsContainer.innerHTML += `
        <div class="border  border-gray-300 rounded-lg overflow-hidden flex flex-col" >
            <div >
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


//buttons clicked
newsContainer.addEventListener("click", (e) => {
  if (e.target.innerText === "Bookmark") {
    handleBookmarks(e);
  }

  if (e.target.innerText === "View Details") {
    handleViewDetails(e)
  }
});

//bookmark handle
const handleBookmarks = (e) => {
  const title = e.target.parentNode.parentNode.children[0].innerText;
  const id = e.target.parentNode.parentNode.id;
  const alreadyExists = bookmarks.find((book) => book.id === id)
  
  if(!alreadyExists){
    bookmarks.push({
    title: title,
    id: id,
  });
  } 
  
  showBookmarks(bookmarks);  
};

//show bookmark
const showBookmarks = (bookmarks) => {
    bookmarkContainer.innerHTML = ""
    bookmarks.forEach(bookmark => {
        bookmarkContainer.innerHTML += `
        <div class="border-y-gray-300 border border-transparent my-2 p-2">
            <h1>${bookmark.title}</h1>
            <button onclick="handleDeleteBookmark('${bookmark.id}')" class="btn btn-sm btn-outline btn-error">Delete</button>
        </div>
        `
    })

    bookmarkCount.innerText = bookmarks.length
};

//delete button
const handleDeleteBookmark = (bookmarkId) => {
   const filteredBookmarks =  bookmarks.filter(bookmark => bookmark.id !== bookmarkId)
   bookmarks = filteredBookmarks
   showBookmarks(bookmarks)

}

//view details button
handleViewDetails = (e) => {
const id = e.target.parentNode.parentNode.id;

  
  fetch(`https://news-api-fs.vercel.app/api/news/${id}`)
  .then(res=> res.json())
  .then(data => {
    
    showDetailsNews(data.article)

  })
  .catch(err => {
    newsDetailsModal.showModal()
    modalContainer.innerHTML = ""
    modalContainer.innerHTML = `
      <h1 class= "text-xl font-bold">No details for this news now</h1>         
    `
  })

}

//modal
const showDetailsNews = (article) => {
  console.log(article)
    newsDetailsModal.showModal()
    modalContainer.innerHTML = ""
    modalContainer.innerHTML = `
      <h1 class= "text-xl font-bold">${article.title}</h1>
      <img src="${article.images[0].url}"/>
      <p class= "text-sm font-bold">${article.timestamp}</p>
      <p>${article.content.join("")}</p>
    `
}


//loading function
const showLoading = () => {
    newsContainer.innerHTML = `
    <div class="col-span-3 flex justify-center items-center min-h-[70px]">
      <div class="bg-red-500 p-3 loading loading-spinner loading-xl text-center"></div>
    </div>
    `
}

//error handle
const showError = () => {
    newsContainer.innerHTML = `
    <div class="col-span-3 flex justify-center items-center min-h-[70px]">
      <div class="bg-red-500 p-6 text-white rounded-lg text-center">Something Went Wrong</div>
    </div>
    `
}

//empty news
const showEmptyMessage = () => {
    newsContainer.innerHTML = `
    <div class="col-span-3 flex justify-center items-center min-h-[70px]">
      <div class="bg-orange-500 p-6 text-white rounded-lg text-center">No news found for this category</div>
    </div>
    `
}

loadCategory();
loadNewsByCategory("main")

