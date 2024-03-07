const books = [];
const RENDER_EVENT = "RENDER=BOOKS";
const STORAGE_KEY = "BOOK-APPS";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("js-add-book-form");
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("js-search-book-form");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromLocalStorage();
  }
});

document.addEventListener(RENDER_EVENT, () => {
  const uncompletedBooksList = document.getElementById("js-uncompleted-books");
  uncompletedBooksList.innerHTML = "";

  const completedBooksList = document.getElementById("js-completed-books");
  completedBooksList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = createBookElement(bookItem);

    if (!bookItem.isCompleted) {
      uncompletedBooksList.append(bookElement);
    } else {
      completedBooksList.append(bookElement);
    }
  }
});

function addBook() {
  const titleText = document.getElementById("title").value;
  const authorText = document.getElementById("author").value;
  const yearText = document.getElementById("year").value;
  const isCompleted = document.getElementById("js-is-completed").checked;

  const generatedId = generateId();
  const bookObject = generateBookObject(
    generatedId,
    titleText,
    authorText,
    yearText,
    isCompleted
  );

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function createBookElement(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = "Title:   " + bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Author:   " + bookObject.author;

  const textYear = document.createElement("p");
  textYear.innerText = "Year:   " + bookObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textYear);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("btn-container");

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "DELETE";
  deleteButton.classList.add("delete-button");

  const editButton = document.createElement("button");
  editButton.innerText = "EDIT";
  editButton.classList.add("edit-button");

  buttonContainer.append(deleteButton, editButton);

  deleteButton.addEventListener("click", () => {
    removeBook(bookObject.id);
  });

  editButton.addEventListener("click", () => {
    editBook(bookObject);
  });

  const container = document.createElement("li");
  container.classList.add("list-item");
  container.setAttribute("id", `book-${bookObject.id}`);
  
  if (bookObject.isCompleted) {
    const moveButton = document.createElement("button");
    moveButton.innerText = "MOVE";
    moveButton.classList.add("move-button");
    
    moveButton.addEventListener("click", () => {
      addBookToUncompletedList(bookObject.id);
    });
    
    buttonContainer.append(moveButton);
  } else {
    const moveButton = document.createElement("button");
    moveButton.innerText = "MOVE";
    moveButton.classList.add("move-button");
    
    moveButton.addEventListener("click", () => {
      addBookToCompletedList(bookObject.id);
    });
    
    buttonContainer.append(moveButton);
  }
  
  container.append(textContainer, buttonContainer);
  
  return container;
}

function addBookToUncompletedList(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget === null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function addBookToCompletedList(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget === null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function editBook(bookObject) {
  const editForm = document.getElementById("js-edit-form");
  let titleValue = document.querySelector("#js-edit-form #title");
  let authorValue = document.querySelector("#js-edit-form #author");
  let yearValue = document.querySelector("#js-edit-form #year");
  const closeButton = document.getElementById("js-close-button");
  
  editForm.style.display = "block";

  titleValue.value = bookObject.title;
  authorValue.value = bookObject.author;
  yearValue.value = bookObject.year;

  closeButton.addEventListener("click", () => {
    editForm.style.display = "none";
  });

  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    console.log(titleValue.value);
    console.log(authorValue.value);
    console.log(yearValue.value);

    bookObject.title = titleValue.value;
    bookObject.author = authorValue.value;
    bookObject.year = yearValue.value;

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();

    editForm.style.display = "none";
  });
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFromLocalStorage() {
  const serializeData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializeData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser does not support local storage");
    return false;
  }

  return true;
}

function searchBook() {
  const searchTitle = document
    .getElementById("js-search-book-title")
    .value.toLowerCase();
  searchResults = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle)
  );
  
  const uncompletedBooksList = document.getElementById("js-uncompleted-books");
  uncompletedBooksList.innerHTML = "";

  const completedBooksList = document.getElementById("js-completed-books");
  completedBooksList.innerHTML = "";

    for (const bookItem of searchResults) {
      const bookElement = createBookElement(bookItem);
      
      if (!bookItem.isCompleted) {
        uncompletedBooksList.append(bookElement);
      } else {
        completedBooksList.append(bookElement);
      }
    }
}