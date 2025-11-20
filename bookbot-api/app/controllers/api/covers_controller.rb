module Api
  class CoversController < ApplicationController
    protect_from_forgery with: :null_session

    before_action :set_cover, only: [:show, :update, :destroy]

    def index
      if params[:book_id].present?
        # Fetch all covers for a specific book, no pagination/search
        covers = Cover.where(book_id: params[:book_id]).order(created_at: :desc)
        render json: covers.map { |cover| cover_json(cover) }
      else
        # True covers index: apply search and pagination
        page = [params[:page].to_i, 1].max
        per_page = 15
        offset = (page - 1) * per_page
        relation = Cover.search(params[:search])
        total_count = relation.count
        covers = relation.order(created_at: :desc).limit(per_page).offset(offset)

        render json: {
          covers: covers.map { |cover| cover_json(cover) },
          page: page,
          per_page: per_page,
          total_count: total_count,
        }
      end
    end

    def show
      render json: cover_json(@cover)
    end
    def cover_json(cover)
      host = Rails.application.routes.default_url_options[:host] || request&.host
      port = Rails.application.routes.default_url_options[:port] || request&.port

        # Use configured default_url_options (set via env/config). Avoid passing host/port kvargs
        # to ActiveStorage helpers to prevent arity/kwargs mismatch in some Ruby/Rails combos.
        # Safely attempt to generate URLs; if something raises, include the error message so
        # the API doesn't return a 500 and we can inspect the cause from the client.
        # Return signed blob ids and filenames (frontend can construct the ActiveStorage
        # redirect URLs using these). This avoids calling URL helpers in the API and
        # prevents server-side arity/kwargs issues.
        image_signed_id = nil
        image_filename = nil
        if cover.image.attached?
          blob = cover.image.blob
          image_signed_id = blob.signed_id
          image_filename = blob.filename.to_s
        end

        book_title = cover.book&.title
        edition = cover.respond_to?(:edition) ? cover.edition : nil
        format_name = cover.format&.name

        cover.as_json.merge({
          image_signed_id: image_signed_id,
          image_filename: image_filename,
          book_title: book_title,
          edition: edition,
          format_name: format_name
        })
    end

    def create
      @cover = Cover.new(cover_params)
      if @cover.save
        render json: @cover, status: :created
      else
        render json: { errors: @cover.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @cover.update(cover_params)
        render json: @cover
      else
        render json: { errors: @cover.errors.full_messages }, status: :unprocessable_entity
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
      params.require(:cover).permit(:title, :note, :book_id)
    end
  end
end
