class StopwatchRecordsController < ApplicationController
  before_action :set_stopwatch, only: [:pause, :resume, :status, :finish]

  # POST /stopwatch/start
  def start
    # すでに進行中があればそれを返す
    existing = StopwatchRecord.find_by(user: current_user, is_running: true)
    if existing
      return render json: { status: :already_running, stopwatch: existing }, status: 200
    end

    stopwatch = StopwatchRecord.create!(
      user: current_user,
      subject_id: params[:subject_id],
      start_time: Time.current,
      last_started_at: Time.current,
      elapsed_seconds: 0,
      is_running: true
    )

    render json: { status: :started, stopwatch: stopwatch }, status: 201
  end

  # POST /stopwatch/pause
  def pause
    return render json: { error: "not running" }, status: 400 unless @stopwatch.is_running?

    now = Time.current
    diff = now - @stopwatch.last_started_at
    @stopwatch.update!(
      elapsed_seconds: @stopwatch.elapsed_seconds + diff.to_i,
      is_running: false
    )

    render json: { status: :paused, elapsed: @stopwatch.elapsed_seconds }
  end

  # POST /stopwatch/resume
  def resume
    return render json: { error: "already running" }, status: 400 if @stopwatch.is_running?

    @stopwatch.update!(
      is_running: true,
      last_started_at: Time.current
    )

    render json: { status: :resumed }
  end

  # GET /stopwatch/status
  def status
    total = @stopwatch.elapsed_seconds
    if @stopwatch.is_running?
      total += (Time.current - @stopwatch.last_started_at).to_i
    end

    render json: {
      running: @stopwatch.is_running?,
      elapsed_seconds: total,
      subject_id: @stopwatch.subject_id
    }
  end

  # POST /stopwatch/finish
  def finish
    # 合計時間計算
    total = @stopwatch.elapsed_seconds
    if @stopwatch.is_running?
      total += (Time.current - @stopwatch.last_started_at).to_i
    end

    study = StudyRecord.create!(
      user: current_user,
      subject_id: @stopwatch.subject_id,
      date: Date.current,
      start_time: @stopwatch.start_time,
      end_time: Time.current,
      duration_seconds: total,
      is_completed: true
    )

    @stopwatch.destroy!

    render json: { status: :finished, study_record: study }, status: 201
  end

  private

  def set_stopwatch
    @stopwatch = StopwatchRecord.find_by(user: current_user)

    unless @stopwatch
      render json: { error: "no active stopwatch" }, status: 404
    end
  end
end
