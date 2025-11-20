module Api
  class CoversController < ApplicationController
    protect_from_forgery with: :null_session

    before_action :set_cover, only: [:show, :update, :destroy]

    def index
      covers = Cover.all
      if params[:book_id].present?
        covers = covers.where(book_id: params[:book_id])
      end
      covers = covers.order(created_at: :desc).limit(200)
      render json: covers.map { |cover| cover_json(cover) }
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

        cover.as_json.merge({
          image_signed_id: image_signed_id,
          image_filename: image_filename
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
