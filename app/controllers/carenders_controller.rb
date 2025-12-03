class CarendersController < ApplicationController
  def carender
    # パラメータから年月を取得し、日付オブジェクトを作成
    if params[:year].present? && params[:month].present?
      # 例: /study_records/carender?year=2025&month=11 の場合
      @date = Date.new(params[:year].to_i, params[:month].to_i, 1)
    else
      # パラメータがない場合（初めてページを開いた時など）は、今日の日付を使用
      @date = Date.current
    end
  end
  
  def show_day
    # URLから :month と :day パラメータを取得
    @month = params[:month].to_i
    @day = params[:day].to_i

    # 該当日の勉強記録データをデータベースから取得するロジック
    @study_record = StudyRecord.find_by(month: @month, day: @day, user: current_user)
    
    # このアクションに対応するビュー（例: app/views/study_records/show_day.html.erb）を作成してください。
  end
end
