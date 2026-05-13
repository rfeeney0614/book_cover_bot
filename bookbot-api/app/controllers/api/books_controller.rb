module Api
  class BooksController < BaseController
    before_action :set_book, only: [:show, :update, :destroy, :upload_supplementary_file, :delete_supplementary_file, :download_supplementary_file]

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
      supplementary_files_data = @book.supplementary_files.map do |file|
        {
          id: file.id,
          filename: file.filename.to_s,
          byte_size: file.byte_size,
          content_type: file.content_type,
          created_at: file.created_at,
          url: url_for(file)
        }
      end
      
      render json: @book.as_json.merge({ supplementary_files: supplementary_files_data })
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

    def upload_supplementary_file
      if params[:file].present?
        @book.supplementary_files.attach(params[:file])
        
        supplementary_files_data = @book.supplementary_files.map do |file|
          {
            id: file.id,
            filename: file.filename.to_s,
            byte_size: file.byte_size,
            content_type: file.content_type,
            created_at: file.created_at,
            url: url_for(file)
          }
        end
        
        render json: { message: 'File uploaded successfully', supplementary_files: supplementary_files_data }, status: :ok
      else
        render json: { error: 'No file provided' }, status: :unprocessable_entity
      end
    end

    def delete_supplementary_file
      file = @book.supplementary_files.find(params[:file_id])
      file.purge
      
      supplementary_files_data = @book.supplementary_files.map do |file|
        {
          id: file.id,
          filename: file.filename.to_s,
          byte_size: file.byte_size,
          content_type: file.content_type,
          created_at: file.created_at,
          url: url_for(file)
        }
      end
      
      render json: { message: 'File deleted successfully', supplementary_files: supplementary_files_data }, status: :ok
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'File not found' }, status: :not_found
    end

    def download_supplementary_file
      file = @book.supplementary_files.find(params[:file_id])
      redirect_to url_for(file), allow_other_host: true
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'File not found' }, status: :not_found
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
