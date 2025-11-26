class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :require_login, unless: -> { skip_authentication? }

  def fallback_index_html
    render file: 'public/index.html', layout: false
  end

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end
  helper_method :current_user

  def logged_in?
    current_user.present?
  end
  helper_method :logged_in?

  def require_login
    unless logged_in?
      respond_to do |format|
        format.html { redirect_to login_path }
        format.json { render json: { error: 'Unauthorized' }, status: :unauthorized }
      end
    end
  end

  def skip_authentication?
    # Skip auth in development, or for specific paths
    Rails.env.development? || 
    request.path == "/health" ||
    request.path == "/api/sessions" ||
    request.path.start_with?("/assets")
  end
