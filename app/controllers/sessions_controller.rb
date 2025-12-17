class SessionsController < ApplicationController
  def create
    # ユーザーを検索
    user = User.find_by(user_id: params[:user_id])

    # 認証成功
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id   # ログイン状態保持
      redirect_to carender_path     # ★カレンダーへ
    else
      redirect_to nothing_path      # ★何もなかった画面へ
    end
  end

  def destroy
    session.delete(:user_id)
    redirect_to login_path, notice: "ログアウトしました"
  end
end
