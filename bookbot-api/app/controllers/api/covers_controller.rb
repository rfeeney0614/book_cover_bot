module Api
  class CoversController < BaseController
    before_action :set_cover, only: [:show, :update, :destroy]

    def index
      if params[:book_id].present?
        # Fetch all covers for a specific book, no pagination/search
        covers = Cover.where(book_id: params[:book_id]).order(created_at: :desc)
        render json: covers.map { |cover| cover_json(cover) }
      else
        # True covers index: apply search and pagination
        relation = Cover.search(params[:search])
        pagination = paginate(relation)
        covers = pagination[:items].order(created_at: :desc)

        render json: {
          covers: covers.map { |cover| cover_json(cover) },
          page: pagination[:page],
          per_page: pagination[:per_page],
          total_count: pagination[:total_count],
        }
      end
    end

    def show
      render json: cover_json(@cover)
    end
    def cover_json(cover)
        # Use url_for to generate proper URLs for ActiveStorage attachments
        image_url = nil
        thumb_url = nil
        if cover.image.attached?
          image_url = url_for(cover.image)
          thumb_url = url_for(cover.image.variant(:thumb)) rescue image_url
        end

        book_title = cover.book&.title
        edition = cover.respond_to?(:edition) ? cover.edition : nil
        format_name = cover.format&.name
        construction_model = cover.construction_model
        # include job order info when present so frontend can show queued counts
        job_order = cover.respond_to?(:job_order) ? cover.job_order : nil
        job_order_id = job_order&.id
        print_quantity = job_order&.quantity || 0

        cover.as_json.merge({
          image_url: image_url,
          thumb_url: thumb_url,
          book_title: book_title,
          edition: edition,
          format_name: format_name,
          construction_model: construction_model,
          job_order_id: job_order_id,
          print_quantity: job_order_id ? print_quantity : nil
        })
    end

    def create
      @cover = Cover.new(cover_params)
      if @cover.save
        render json: @cover, status: :created
      else
        render_errors(@cover)
      end
    end

    def update
      if @cover.update(cover_params)
        render json: cover_json(@cover)
      else
        render_errors(@cover)
      end
    end

    def destroy
      @cover.destroy
      head :no_content
    end

    private

    def set_cover
      @cover = Cover.find(params[:id])
    end

    def cover_params
      # Permit basic attributes; attachments (ActiveStorage) uploads should use separate direct upload endpoints.
      params.require(:cover).permit(:title, :note, :book_id, :edition, :format_id, :image)
    end
  end
end
