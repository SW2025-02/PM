class StudyRecordsController < ApplicationController
  before_action :require_login
  before_action :set_record, only: [:show, :update, :destroy]

  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActionController::ParameterMissing, with: :render_bad_request

  # GET /study_records
  def index
    @study_records = current_user.study_records.order(created_at: :desc)
  
    respond_to do |format|
      format.html
      format.json { render json: @study_records }
    end
  end


  # GET /study_records/:id
  def show
    render json: StudyRecordSerializer.new(@record).serializable_hash
  end
  
  def create
    record = current_user.study_records.build(study_record_params)
    if record.save
      render json: StudyRecordSerializer.new(record).serializable_hash, status: :created
    else
      render json: { errors: record.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @record.update(study_record_params)
      render json: StudyRecordSerializer.new(@record).serializable_hash
    else
      render json: { errors: @record.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @record.destroy
    head :no_content
  end


  private

  def set_record
    @record = current_user.study_records.find(params[:id])
  end

  def study_record_params
    params.require(:study_record).permit(:content, :subject_id, :date)
  end

  def render_not_found
    render json: { error: "Record not found" }, status: :not_found
  end

  def render_bad_request(e)
    render json: { error: e.message }, status: :bad_request
  end
end
