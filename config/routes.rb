Rails.application.routes.draw do
  get "study_records/index"
  get "study_records/show"
  get "study_records/update"
  get "study_records/destroy"
  get "stopwatch_records/start"
  get "stopwatch_records/pause"
  get "stopwatch_records/resume"
  get "stopwatch_records/status"
  get "stopwatch_records/finish"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
