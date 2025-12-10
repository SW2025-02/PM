Rails.application.routes.draw do
  root "users#login"
  resources :studies
  resources :study_records, only: [:index, :show, :create, :update, :destroy]

  get "up" => "rails/health#show", as: :rails_health_check
  
  # 'study_records/11/26' のようなURLパターンに対応
  get 'study_records/:month/:day', to: 'carenders#show_day', as: 'study_day'

  get 'carender', to: 'carenders#carender', as: 'carender'
  
  post "/login", to: "sessions#create"
  get "/login",  to: "users#login"
  get "/signup", to: "users#new"
  get "/nothing", to: "users#nothing"
  get "/admin", to: "users#admin"
  
  # 新規登録フォーム表示
get "/signup", to: "users#new"

# 登録処理
post "/signup", to: "users#create"

  
  delete '/logout', to: 'sessions#destroy'

end
