class ProofsController < ApplicationController
  before_action :require_login

  def proof
    # 表示対象日（なければ今日）
    @date =
      begin
        params[:date].present? ? Date.parse(params[:date]) : Time.zone.today
      rescue ArgumentError
        Time.zone.today
      end

    @study_records = current_user.study_records
                                 .where(date: @date)
                                 .order(created_at: :asc)

    # 科目別合計（秒）
    @jap = @study_records.where(subject: "国語").sum(:duration_seconds)
    @mat = @study_records.where(subject: "数学").sum(:duration_seconds)
    @sci = @study_records.where(subject: "理科").sum(:duration_seconds)
    @soc = @study_records.where(subject: "社会").sum(:duration_seconds)
    @eng = @study_records.where(subject: "英語").sum(:duration_seconds)
    @els = @study_records.where(subject: "その他").sum(:duration_seconds)

    # 合計
    @total = @jap + @mat + @sci + @soc + @eng + @els
  end
end
