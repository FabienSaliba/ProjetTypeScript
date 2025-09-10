import {Injectable, OnModuleInit} from '@nestjs/common';
import {Book} from "./book";
import {BookApi} from "./bookApi";
import {readFile} from "node:fs/promises";
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";

@Injectable()
export class BookService implements OnModuleInit {
    private books: Map<string, Book>;

    constructor(private readonly httpService: HttpService) {
        this.books = new Map();
    }

    addBook(book: Book) {
        this.books.set(book.isbn, book)
    }

    getBook(isbn: string) {
        return this.books.get(isbn);
    }

    getBooksOf(author: string): Book[] {
        const arrBooks = Array.from(this.books.values());
        return arrBooks.filter(book => book.author === author)
    }

    getAllBooks() {
        let arrBooks = Array.from(this.books.values())
        arrBooks.sort((a, b) => a.title.localeCompare(b.title))
        return arrBooks;
    }

    getTotalNumberOfBooks(): number {
        return this.books.size;

    }

    deleteBook(isbn: string) {

        this.books.delete(isbn);

    }

    async onModuleInit() {
        await Promise.all([this.loadBookFromAPI('https://api.npoint.io/fbb2a6039fc21e320b30'), this.loadBookFromFile()])

    }

    async loadBookFromFile() {
        console.log(`The module has been initialized.`);
        try {
            const data = await readFile("src/dataset.json", "utf8");
            const books: Book[] = JSON.parse(data);
            books.forEach(book => {
                this.addBook(book);
            });
        } catch (error) {
            return console.log(error);
        }
    }

    async loadBookFromAPI(url: string) {
        // const data = this.httpService.get(url);
        const response = await firstValueFrom(this.httpService.get<BookApi[]>(url));
        response.data.forEach(book => {
            const bookR = {
                isbn: book.isbn,
                title: book.title,
                author: book.authors,
                date: book.publication_date.split("/")[2]
            };
            this.addBook(bookR);
        });


    }


}


