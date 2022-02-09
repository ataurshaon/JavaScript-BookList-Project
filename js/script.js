//Get UI Element

let form = document.querySelector('#book_form');
let bookList = document.querySelector('#book_list');


//Book Class
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


class UI{
   static addToBookList(book){
        let list = document.querySelector('#book_list');
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `
        list.appendChild(row);
    };
    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static showAlert(message, className){
        let div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        let container = document.querySelector('.container');
        let form = document.querySelector('#book_form');
        container.insertBefore(div, form);


        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 2000);
    }

    static deleteFromBookList(target){
        if(target.hasAttribute('href')){
            target.parentElement.parentElement.remove();
            Store.removeBook(target.parentElement.previousSibling.textContent.trim());
            UI.showAlert('Book Deleted', 'success');
        }
    }

}




//Local Storage Class

class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books
    }

    static addBook(book){
        let books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static displayBooks(){
        let books = Store.getBooks();

        books.forEach(book => {
            UI.addToBookList(book);
        })
    }

    static removeBook(isbn){
        let books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        })
        localStorage.setItem('books', JSON.stringify(books));
    }
}


//Add Event Listener

form.addEventListener('submit', addBook)
bookList.addEventListener('click', removeBook);
document.addEventListener('DOMContentLoaded', Store.displayBooks());



//Define Event Listener Function

function addBook(e){
    let title = document.querySelector('#title').value,
        author = document.querySelector('#author').value,
        isbn = document.querySelector('#isbn').value;

    let book = new Book(title, author, isbn); //create object for Book class
    
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please Fill All the Fields', 'error');
    }else{
        UI.addToBookList(book);
        UI.clearFields();
        UI.showAlert('Books Added', 'success');
        Store.addBook(book); //function call from local storage class  
    }

    e.preventDefault();//remove by default form reloading after click in submit 
}


function removeBook(e){
    UI.deleteFromBookList(e.target);
    

    e.preventDefault();    
}