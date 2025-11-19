module Api
  class CoversController < ApplicationController
    protect_from_forgery with: :null_session

    before_action :set_cover, only: [:show, :update, :destroy]

    def index
      covers = Cover.order(created_at: :desc).limit(200)
      render json: covers
    end

    def show
      render json: @cover
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
