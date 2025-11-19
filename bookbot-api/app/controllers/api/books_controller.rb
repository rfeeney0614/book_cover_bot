module Api
  class BooksController < ApplicationController
    # For JSON API endpoints we don't use the Rails session or CSRF tokens from the browser.
    # Use null_session to avoid Origin header mismatches for requests coming from the React dev server.
    protect_from_forgery with: :null_session

    before_action :set_book, only: [:show, :update]

    def index
      page = [params[:page].to_i, 1].max
      per_page = 15
      offset = (page - 1) * per_page
      books = Book.search(params[:search]).limit(per_page).offset(offset)

      render json: books
    end

    def show
      render json: @book
    end

    def create
      @book = Book.new(book_params)
      if @book.save
        render json: @book, status: :created
      else
        render json: { errors: @book.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @book.update(book_params)
        render json: @book
      else
        render json: { errors: @book.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def set_book
      @book = Book.find(params[:id])
    end

    def book_params
      params.require(:book).permit(:title, :author, :note, :page_count, :series)
    end
  end
end
