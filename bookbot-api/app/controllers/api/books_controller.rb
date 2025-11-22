module Api
  class BooksController < BaseController
    before_action :set_book, only: [:show, :update, :destroy]

    def index
      relation = Book.search(params[:search])
      pagination = paginate(relation)
      books = pagination[:items]

      # Include a lightweight representative cover payload for each book (first cover) so
      # frontend list views can show a thumbnail without making additional requests.
      books_json = books.map do |b|
        first_cover = b.covers.order(created_at: :asc).first
        cover_info = nil
        if first_cover&.image&.attached?
          cover_info = {
            id: first_cover.id,
            image_url: url_for(first_cover.image),
            thumb_url: (url_for(first_cover.image.variant(:thumb)) rescue url_for(first_cover.image))
          }
        end

        b.as_json.merge({ cover: cover_info })
      end

      render json: {
        books: books_json,
        page: pagination[:page],
        per_page: pagination[:per_page],
        total_count: pagination[:total_count],
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
        render_errors(@book)
      end
    end

    def update
      if @book.update(book_params)
        render json: @book
      else
        render_errors(@book)
      end
    end

    def destroy
      @book.destroy
      head :no_content
    end

    def export
      @books = Book.order(:title)
      
      respond_to do |format|
        format.xlsx do
          response.headers['Content-Disposition'] = "attachment; filename=\"books_export_#{Date.today}.xlsx\""
        end
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
