module Api
  class PrintExportsController < BaseController
    before_action :set_print_export, only: [:show, :update, :destroy, :status, :download]

    def index
      exports = PrintExport.order(created_at: :desc).limit(100)
      render json: exports
    end

    def show
      render json: @print_export
    end

    def status
      render json: { 
        id: @print_export.id, 
        status: @print_export.status,
        progress_text: @print_export.progress_text,
        error_message: @print_export.error_message
      }
    end

    def export
      @print_export = PrintExport.create
      @print_export.job_orders.append(JobOrder.all)
      @print_export.save
      CompileExportJob.perform_later(@print_export.id)
      render json: { id: @print_export.id, status: @print_export.status }, status: :created
    end

    def download
      # If there's an ActiveStorage attached PDF, send it directly
      if @print_export.pdf.attached?
        begin
          # Send the file data directly instead of redirecting
          send_data @print_export.pdf.download,
                    filename: @print_export.pdf.filename.to_s,
                    type: @print_export.pdf.content_type,
                    disposition: 'attachment'
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
        render_errors(@print_export)
      end
    end

    def update
      if @print_export.update(print_export_params)
        render json: @print_export
      else
        render_errors(@print_export)
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
