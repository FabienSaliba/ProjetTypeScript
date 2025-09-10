import {Book} from './book';

export class Bookshelf
{
    private books: Map<string, Book>;

    constructor(){
        this.books = new Map();
    }
    addBook(book: Book){
        this.books.set(book.isbn, book)
    }

    getBook(isbn: string){
        return this.books.get(isbn);
    }

    getBooksOf(author: string): Book[]{
        const arrBooks = Array.from(this.books.values());
        return arrBooks.filter(book => book.author === author)
    }

    getAllBooks(){
        let arrBooks = Array.from(this.books.values())
        arrBooks.sort((a, b) => a.title.localeCompare(b.title))
        return arrBooks;
    }

    getTotalNumberOfBooks(): number{
        return this.books.size;

    }
}