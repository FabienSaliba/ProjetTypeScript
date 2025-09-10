import {Body, Controller, Delete, Get, Param, Post, Query} from '@nestjs/common';
import { BookService } from './book.service';
import {Book} from "./book";
import {get} from "node:http";

interface Term {
    "term": string
}

@Controller()
export class BookController {
    constructor(private readonly bookService: BookService) {
    }

    @Get('/books')
    getAll(@Query('author') author?: string): Book[] {
        if (author) {
            return this.bookService.getBooksOf(author);
        }else {
            return this.bookService.getAllBooks();
        }
    }

    @Post('/books')
    async create(@Body() book: Book) {
        this.bookService.addBook(book);
        return {
            message: 'Book created successfully',
            book: book,
        };
    }

    @Get('/books/:isbn')
    getBook(@Param('isbn') isbn: string) {
        return this.bookService.getBook(isbn);
    }


    @Delete('/books/:isbn')
    delete(@Param('isbn') isbn: string) {

        return this.bookService.deleteBook(isbn);
    }
}