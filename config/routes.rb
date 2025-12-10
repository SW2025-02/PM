Rails.application.routes.draw do
  root "carenders#carender"
  resources :studies
  resources :study_records, only: [:index, :show, :create, :update, :destroy]

  get "up" => "rails/health#show", as: :rails_health_check
  
  # 'study_records/11/26' のようなURLパターンに対応
  get 'study_records/:month/:day', to: 'carenders#show_day', as: 'study_day'
end
