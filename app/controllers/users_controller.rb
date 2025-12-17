class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to login_path, notice: "登録が完了しました"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    user = User.find(params[:id])
    user.destroy
    redirect_to admin_path, notice: 'ユーザーを削除しました'
  end

  def admin
    @users = User.all
  end
  
  def index
    @users = User.all
  end

  def confirm
    # 画面表示だけ
  end

  def confirm_check
    user = User.find_by(user_id: params[:user_id])
    if user && user.authenticate(params[:password])
      redirect_to admin_path
    else
      redirect_to confirm_path, alert: "ユーザ名またはパスワードが違います"
    end
  end

  private

  def user_params
    params.require(:user).permit(:user_id, :email, :password, :password_confirmation)
  end
end
