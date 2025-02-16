Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  root "books#index"

  resources :books do
    resources :covers
  end

  get "/covers", to: "covers#index", as: :covers
  delete "/covers/:id", to: "covers#destroy", as: :delete_cover
  patch "/covers/:id/add_job", to: "covers#add_job", as: :add_to_job_cover
  patch "/covers/:id/remove_job", to: "covers#remove_job", as: :remove_from_job_cover
  get "/print_queue", to: "job_orders#index"
  post "/print_queue/export", to: "job_orders#export", as: :export_print_job
  delete "/print_queue", to: "job_orders#clear", as: :clear_print_jobs
  resources :formats
  get "/print_queue/export/:id/status", to: "print_exports#status", as: :print_export_status
  get "/print_queue/export/:id/download", to: "print_exports#download", as: :print_export_download
  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
