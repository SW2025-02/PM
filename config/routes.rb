Rails.application.routes.draw do
  root "study_records#carender"
  resources :studies
  resources :study_records, only: [:index, :show, :update, :destroy]

  get "up" => "rails/health#show", as: :rails_health_check
  
  # 'study_records/11/26' のようなURLパターンに対応
  get 'study_records/:month/:day', to: 'study_records#show_day', as: 'study_day'
  
  get 'carender', to: 'study_records#carender', as: 'carender'

end
