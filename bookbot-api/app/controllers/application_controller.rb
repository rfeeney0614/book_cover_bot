class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # HTTP Basic Authentication for single-user app
  http_basic_authenticate_with name: ENV.fetch("BASIC_AUTH_USERNAME", "admin"), 
                                password: ENV.fetch("BASIC_AUTH_PASSWORD", "changeme"),
                                unless: -> { skip_authentication? }

  def fallback_index_html
    render file: 'public/index.html', layout: false
  end

  private

  def skip_authentication?
    # Skip auth in development, or for specific paths if needed
    Rails.env.development? || request.path == "/health"
  end
