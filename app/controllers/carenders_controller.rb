class CarendersController < ApplicationController
  before_action :require_login

  def carender
    if params[:year].present? && params[:month].present?
      @date = Date.new(params[:year].to_i, params[:month].to_i, 1)
    else
      @date = Date.current
    end
    
    @month = @date.month
    @user = current_user
  end

  
  def show_day
    @month = params[:month].to_i
    @day   = params[:day].to_i

    target_date = Date.new(Date.today.year, @month, @day)

    @study_records = current_user.study_records.where(date: target_date)

    render 'study_records/index'
  end
end
