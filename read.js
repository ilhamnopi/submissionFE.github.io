const uncompleteds = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("formInput");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  function addBook() {
    const judul = document.getElementById("judulBuku").value;
    const author = document.getElementById("namaPengarang").value;
    const year = document.getElementById("tahunTerbit").value;

    const generatedID = generatedId();
    const bookObject = generateBookObject(generatedID, judul, author, year, false);
    uncompleteds.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function generatedId() {
    return +new Date();
  }

  function generateBookObject(id, judul, author, year, isCompleted) {
    return {
      id,
      judul,
      author,
      year,
      isCompleted,
    };
  }

  function makeBookList(bookObject) {
    const textJudul = document.createElement("h2");
    textJudul.innerText = bookObject.judul;

    const textAuthor = document.createElement("h3");
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement("h4");
    textYear.innerText = bookObject.year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textJudul, textAuthor, textYear);

    const container = document.createElement("div");
    container.classList.add("item");
    container.append(textContainer);
    container.setAttribute("id", `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
      const undoButton = document.createElement("button");
      undoButton.classList.add("aksi", "undo");
      undoButton.innerText = "undo";

      undoButton.addEventListener("click", function () {
        undoBookFromCompleted(bookObject.id);
      });

      const trashButton = document.createElement("button");
      trashButton.classList.add("aksi", "done");
      trashButton.innerText = "hapus";

      trashButton.addEventListener("click", function () {
        removeBookFromCompleted(bookObject.id);
      });

      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement("button");
      checkButton.classList.add("aksi", "add");
      checkButton.innerText = "selesai";
      checkButton.addEventListener("click", function () {
        addBookToCompleted(bookObject.id);
      });
      container.append(checkButton);
    }

    return container;
  }

  function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    uncompleteds.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBook(bookId) {
    for (const bookItem of uncompleteds) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

  function findBookIndex(bookId) {
    for (const index in uncompleteds) {
      if (uncompleteds[index].id === bookId) {
        return index;
      }
    }
    return -1;
  }

  document.addEventListener(RENDER_EVENT, function () {
    // console.log(uncompleteds);
    // uncompleted
    const uncompletedBookList = document.getElementById("uncompleteds");
    uncompletedBookList.innerHTML = "";

    const completedBookList = document.getElementById("completeds");
    completedBookList.innerHTML = "";

    for (const bookItem of uncompleteds) {
      const bookElement = makeBookList(bookItem);
      if (!bookItem.isCompleted) {
        uncompletedBookList.append(bookElement);
      } else {
        completedBookList.append(bookElement);
      }
    }
  });

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(uncompleteds);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
      for (const book of data) {
        uncompleteds.push(book);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
