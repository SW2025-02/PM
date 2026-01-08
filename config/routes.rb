Rails.application.routes.draw do
  root "users#login"

  # ===== ユーザー・認証 =====
  resources :users, only: [:index, :destroy]
  get  "/login",   to: "users#login"
  post "/login",   to: "sessions#create"
  delete "/logout", to: "sessions#destroy"

  get  "/signup",  to: "users#new"
  post "/signup",  to: "users#create"
  get  "/confirm", to: "users#confirm"
  post "/confirm", to: "users#confirm_check"

  get "/admin",   to: "users#admin"
  get "/nothing", to: "users#nothing"

  # ===== 勉強記録 =====
  resources :study_records, only: [:index, :create, :destroy, :show, :update,:new ]

  # カレンダー
  get "carender", to: "carenders#carender", as: "carender"
  
  # 証明書
  get "proof", to: "proofs#proof", as: "proof"
  # ===== ストップウォッチ =====
  post "/stopwatch/start",  to: "stopwatch_records#start"
  post "/stopwatch/pause",  to: "stopwatch_records#pause"
  post "/stopwatch/resume", to: "stopwatch_records#resume"
  get  "/stopwatch/status", to: "stopwatch_records#status"
  post "/stopwatch/finish", to: "stopwatch_records#finish"

  # ヘルスチェック
  get "up" => "rails/health#show", as: :rails_health_check
end
