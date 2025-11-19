module Api
  class PrintExportsController < ApplicationController
    protect_from_forgery with: :null_session

    before_action :set_print_export, only: [:show, :update, :destroy, :status, :download]

    def index
      exports = PrintExport.order(created_at: :desc).limit(100)
      render json: exports
    end

    def show
      render json: @print_export
    end

    def status
      render json: { id: @print_export.id, status: @print_export.status }
    end

    def download
      # If there's an ActiveStorage attached PDF, redirect to its service URL
      if @print_export.pdf.attached?
        begin
          # Prefer a URL that will prompt download
          redirect_to rails_blob_url(@print_export.pdf, disposition: 'attachment')
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
      else
        head :no_content
      end
    end

    def create
      @print_export = PrintExport.new(print_export_params)
      if @print_export.save
        render json: @print_export, status: :created
      else
        render json: { errors: @print_export.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @print_export.update(print_export_params)
        render json: @print_export
      else
        render json: { errors: @print_export.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @print_export.destroy
      head :no_content
    end

    private

    def set_print_export
      @print_export = PrintExport.find(params[:id])
    end

    def print_export_params
      params.require(:print_export).permit(:name, :status)
    end
  end
end
