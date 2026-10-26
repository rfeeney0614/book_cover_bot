module Api
  class FormatsController < BaseController
    before_action :set_format, only: [:show, :update, :destroy]

    def index
      formats = Format.all.limit(100).includes(:construction_mappings)
      render json: formats.as_json(include: { construction_mappings: { only: [:id, :min_pages, :max_pages, :construction_model] } })
    end

    def show
      render json: @format.as_json(include: { construction_mappings: { only: [:id, :min_pages, :max_pages, :construction_model] } })
    end

    def create
      @format = Format.new(format_params)

      ActiveRecord::Base.transaction do
        @format.save!
        sync_construction_mappings if mappings_submitted?
      end

      render json: format_json, status: :created
    rescue ActiveRecord::RecordInvalid => e
      render_errors(e.record)
    end

    def update
      ActiveRecord::Base.transaction do
        @format.update!(format_params)
        sync_construction_mappings if mappings_submitted?
      end

      render json: format_json
    rescue ActiveRecord::RecordInvalid => e
      render_errors(e.record)
    end

    def destroy
      if @format.destroy
        head :no_content
      else
        render_errors(@format)
      end
    end

    private

    def set_format
      @format = Format.find(params[:id])
    end

    # The frontend sends { format: { name, height, default }, construction_mappings: [...] }.
    # Rails reserves params[:format] for the request format (the ".json" in the URL) and the
    # path value overrides the body, so the JSON body is read directly instead.
    def body_params
      @body_params ||= ActionController::Parameters.new(request.request_parameters)
    end

    def format_params
      body_params.fetch(:format, {}).permit(:name, :height, :default)
    end

    def mappings_submitted?
      body_params.key?(:construction_mappings)
    end

    def mappings_params
      body_params.permit(construction_mappings: [:id, :min_pages, :max_pages, :construction_model])
                 .fetch(:construction_mappings, [])
    end

    def format_json
      @format.reload.as_json(include: { construction_mappings: { only: [:id, :min_pages, :max_pages, :construction_model] } })
    end

    # Replaces the format's mappings with the submitted list.
    def sync_construction_mappings
      submitted = mappings_params
      @format.construction_mappings.where.not(id: submitted.filter_map { |m| m[:id].presence }).destroy_all

      submitted.each do |attrs|
        mapping = attrs[:id].present? ? @format.construction_mappings.find(attrs[:id]) : @format.construction_mappings.new
        mapping.update!(attrs.slice(:min_pages, :max_pages, :construction_model))
      end
    end
  end
end