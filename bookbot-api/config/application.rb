require_relative "boot"

# Load the Rails frameworks we need explicitly. We intentionally avoid
# `require "rails/all"` because that loads the Sprockets / asset pipeline
# railtie, which expects `config.assets` to be present. This app is API-only
# and the asset pipeline has been removed.
require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_cable/engine"
# If you later need views, uncomment the following:
# require "action_view/railtie"
# Sprockets / asset pipeline is not used in this API-only app:
# require "sprockets/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module BookCoverBot
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.0

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])
    config.mission_control.jobs.http_basic_auth_enabled = false
    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
    # Run as API-only app to remove non-API middleware. Keep controllers/views
    # in the repo for reference while we build out the API.
    config.api_only = false
    
    # Enable sessions for authentication
    config.session_store :cookie_store, 
      key: '_bookbot_session', 
      same_site: :lax,
      secure: Rails.env.production?, # Secure cookies in production (HTTPS only)
      httponly: true,                 # Prevent JavaScript access (XSS protection)
      expire_after: 2.weeks           # Default expiry, can be overridden per-session
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore

    # Some third-party engines (eg. mission_control-jobs) still reference
    # `config.assets` during initialization. Provide a minimal placeholder
    # so those calls don't raise in this API-only app which does not use
    # the asset pipeline.
    config.assets = ActiveSupport::OrderedOptions.new
    # Provide a minimal `precompile` array so gems that `+=` onto it don't
    # raise `undefined method '+' for nil` during initialization.
    config.assets.precompile = []
    # Provide a minimal `paths` array so gems that `<<` onto it don't
    # raise `undefined method '<<' for nil` during initialization.
    config.assets.paths = []
  end
end
