module Api
  class BaseController < ApplicationController
    # For JSON API endpoints we don't use the Rails session or CSRF tokens from the browser.
    # Use null_session to avoid Origin header mismatches for requests coming from the React dev server.
    protect_from_forgery with: :null_session

    protected

    # Paginate a relation and return pagination metadata
    def paginate(relation, page_param: :page, per_page: 15)
      page = [params[page_param].to_i, 1].max
      offset = (page - 1) * per_page
      total_count = relation.count
      items = relation.limit(per_page).offset(offset)

      {
        items: items,
        page: page,
        per_page: per_page,
        total_count: total_count
      }
    end

    # Render validation errors in a consistent format
    def render_errors(model)
      render json: { errors: model.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
