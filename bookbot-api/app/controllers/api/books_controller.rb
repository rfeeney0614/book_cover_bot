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
      relation = Book.search(params[:search])
      total_count = relation.count
      books = relation.limit(per_page).offset(offset)

      # Include a lightweight representative cover payload for each book (first cover) so
      # frontend list views can show a thumbnail without making additional requests.
      books_json = books.map do |b|
        first_cover = b.covers.order(created_at: :asc).first
        cover_info = nil
        if first_cover&.image&.attached?
          blob = first_cover.image.blob
          cover_info = {
            id: first_cover.id,
            image_signed_id: blob.signed_id,
            image_filename: blob.filename.to_s
          }
        end

        b.as_json.merge({ cover: cover_info })
      end

      render json: {
        books: books_json,
        page: page,
        per_page: per_page,
        total_count: total_count,
      }
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
