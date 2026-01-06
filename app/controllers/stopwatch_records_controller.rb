class StopwatchRecordsController < ApplicationController
  before_action :require_login

  # POST /stopwatch/start
  def start
    existing = StopwatchRecord.find_by(user: current_user)
    if existing&.is_running?
      return render json: { status: :already_running }, status: 200
    end

    stopwatch = existing || StopwatchRecord.new(user: current_user)

    stopwatch.update!(
      subject: params[:subject],
      start_time: Time.current,
      last_started_at: Time.current,
      elapsed_seconds: 0,
      is_running: true
    )

    render json: { status: :started }, status: 201
  end

  # POST /stopwatch/pause
  def pause
    stopwatch = StopwatchRecord.find_by(user: current_user)
    return render json: { error: "not found" }, status: 404 unless stopwatch&.is_running?

    now = Time.current
    diff = now - stopwatch.last_started_at

    stopwatch.update!(
      elapsed_seconds: stopwatch.elapsed_seconds + diff.to_i,
      is_running: false
    )

    render json: { status: :paused }
  end

  # POST /stopwatch/resume
  def resume
    stopwatch = StopwatchRecord.find_by(user: current_user)
    return render json: { error: "not found" }, status: 404 unless stopwatch && !stopwatch.is_running?

    stopwatch.update!(
      is_running: true,
      last_started_at: Time.current
    )

    render json: { status: :resumed }
  end

  # GET /stopwatch/status
  def status
    stopwatch = StopwatchRecord.find_by(user: current_user)

    if stopwatch.nil?
      return render json: { running: false, elapsed_seconds: 0 }
    end

    total = stopwatch.elapsed_seconds
    if stopwatch.is_running?
      total += (Time.current - stopwatch.last_started_at).to_i
    end

    render json: {
      running: stopwatch.is_running?,
      elapsed_seconds: total,
      subject: stopwatch.subject
    }
  end

  # POST /stopwatch/finish
  def finish
    stopwatch = StopwatchRecord.find_by(user: current_user)
    return render json: { error: "not found" }, status: 404 unless stopwatch

    end_time = Time.current
    total = stopwatch.elapsed_seconds
    if stopwatch.is_running?
      total += (end_time - stopwatch.last_started_at).to_i
    end

    study = StudyRecord.create!(
      user: current_user,
      subject: params[:subject],
      memo: params[:memo],
      start_time: stopwatch.start_time,
      end_time: end_time,
      duration_seconds: total,
      date: end_time.to_date,
      is_completed: true
    )

    stopwatch.destroy

    render json: {
      status: :finished,
      record: {
        subject: study.subject,
        memo: study.memo,
        time_spent: study.duration_seconds
      }
    }
  end
end
