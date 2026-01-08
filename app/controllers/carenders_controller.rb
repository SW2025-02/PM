class CarendersController < ApplicationController
  before_action :require_login
  before_action :subject_time, only: [:carender]

  def carender
    if params[:year].present? && params[:month].present?
      @date = Date.new(params[:year].to_i, params[:month].to_i, 1)
    else
      @date = Date.current
    end
    
    @month = @date.month
    @user = current_user
  end

  
  # def show_day
  #   @month = params[:month].to_i
  #   @day   = params[:day].to_i

  #   target_date = Date.new(Date.today.year, @month, @day)

  #   @study_records = current_user.study_records.where(date: target_date)

  #   render 'study_records/index'
  # end
  
  private
  
  def subject_time
    # 表示対象の月
    base_date =
      if params[:year].present? && params[:month].present?
        Date.new(params[:year].to_i, params[:month].to_i, 1)
      else
        Date.current.beginning_of_month
      end

    from = base_date.beginning_of_month
    to   = base_date.end_of_month

    records = current_user.study_records
                          .where(date: from..to)

    @jap = records.where(subject: "国語").sum(:duration_seconds)
    @mat = records.where(subject: "数学").sum(:duration_seconds)
    @sci = records.where(subject: "理科").sum(:duration_seconds)
    @soc = records.where(subject: "社会").sum(:duration_seconds)
    @eng = records.where(subject: "英語").sum(:duration_seconds)
    @els = records.where(subject: "その他").sum(:duration_seconds)
  end
end
