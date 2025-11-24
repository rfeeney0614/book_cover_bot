# Be sure to restart your server when you modify this file.
# Allow the React frontend (dev server) and other origins access to the API.
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://web:3000',
            'http://localhost:3001', 'http://127.0.0.1:3001',
            'http://localhost:5173', 'http://127.0.0.1:5173'
    resource '*', headers: :any, methods: [:get, :post, :put, :patch, :delete, :options, :head], credentials: true
  end
end
