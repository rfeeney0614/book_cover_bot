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
      if @format.save
        render json: @format, status: :created
      else
        render_errors(@format)
      end
    end

    def update
      Rails.logger.info("Api::FormatsController#update called with params: #{params.to_unsafe_h.inspect}")
      
      ActiveRecord::Base.transaction do
        # Extract format attributes from params
        format_attrs = {}
        format_attrs[:name] = params[:name] if params[:name].present?
        format_attrs[:height] = params[:height] if params[:height].present?
        format_attrs[:default] = params[:default] if params.key?(:default)
        
        # If format is nested, use that instead
        if params[:format].is_a?(Hash)
          format_attrs = params[:format].permit(:name, :height, :default).to_h
        end
        
        Rails.logger.info("Resolved format_attrs: #{format_attrs.inspect}")
        
        if @format.update(format_attrs)
          # Handle construction mappings if provided
          if params[:construction_mappings].present?
            update_construction_mappings(params[:construction_mappings])
          end
          
          Rails.logger.info("Format ##{@format.id} updated successfully: #{@format.attributes.inspect}")
          render json: @format.as_json(include: { construction_mappings: { only: [:id, :min_pages, :max_pages, :construction_model] } })
        else
          Rails.logger.warn("Failed to update Format ##{@format.id}: #{@format.errors.full_messages.inspect}")
          render_errors(@format)
        end
      end
    rescue => e
      Rails.logger.error("Error updating format: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      render json: { errors: [e.message] }, status: :unprocessable_entity
    end

    def destroy
      @format.destroy
      head :no_content
    end

    private

    def set_format
      @format = Format.find(params[:id])
    end

    def format_params
      # Accept either nested params (`format: { ... }`) or top-level params.
      if params[:format]
        params.require(:format).permit(:name, :height, :default)
      else
        params.permit(:name, :height, :default)
      end
    end

    def update_construction_mappings(mappings_data)
      # Get IDs of mappings we're keeping/updating
      incoming_ids = mappings_data.map { |m| m[:id] }.compact

      # Delete mappings not in the incoming list
      @format.construction_mappings.where.not(id: incoming_ids).destroy_all

      # Create or update mappings
      mappings_data.each do |mapping_attrs|
        if mapping_attrs[:id].present?
          # Update existing
          mapping = @format.construction_mappings.find(mapping_attrs[:id])
          mapping.update!(
            min_pages: mapping_attrs[:min_pages],
            max_pages: mapping_attrs[:max_pages],
            construction_model: mapping_attrs[:construction_model]
          )
        else
          # Create new
          @format.construction_mappings.create!(
            min_pages: mapping_attrs[:min_pages],
            max_pages: mapping_attrs[:max_pages],
            construction_model: mapping_attrs[:construction_model]
          )
        end
      end
    end
  end
end
