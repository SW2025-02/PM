class SessionsController < ApplicationController
  def create
    # ユーザーを検索
    user = User.find_by(user_id: params[:user_id])

    # 認証成功
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id   
      redirect_to carender_path     
    else
      redirect_to nothing_path      
    end
  end

  def destroy
    session.delete(:user_id)
    redirect_to login_path, notice: "ログアウトしました"
  end
end
