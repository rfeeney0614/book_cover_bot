Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  # Ignore frontend HMR/websocket probe paths if they are accidentally forwarded here.
  match '/ws', to: proc { [204, {}, ['']] }, via: :all
  match '/sockjs-node', to: proc { [204, {}, ['']] }, via: :all
  mount MissionControl::Jobs::Engine, at: "/jobs"

  # API routes only
  namespace :api do
    resources :books, only: [:index, :show, :create, :update] do
      collection do
        get :export
      end
    end
    resources :covers, only: [:index, :show, :create, :update, :destroy]
    resources :formats, only: [:index, :show, :create, :update, :destroy]
    resources :job_orders, only: [:index, :show, :create, :destroy] do
      member do
        patch :increment
        patch :decrement
      end
    end
    resources :print_exports, only: [:index, :show, :create, :update, :destroy] do
      member do
        get :status
        get :download
      end
      collection do
        post :export
      end
    end
    get 'print_queue', to: 'print_queue#index'
    get 'attention', to: 'attention#index'
  end

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Catch-all route to serve React app for any non-API routes (must be last)
  get '*path', to: 'application#fallback_index_html', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
