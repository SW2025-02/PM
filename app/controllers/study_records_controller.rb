class StudyRecordsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_record, only: [:show, :update, :destroy]

  # GET /study_records
  def index
    records = current_user.study_records.order(created_at: :desc)
    render json: records
  end

  # GET /study_records/:id
  def show
    render json: @record
  end

  # PATCH/PUT /study_records/:id
  def update
    if @record.update(study_record_params)
      render json: { status: :updated, record: @record }
    else
      render json: @record.errors, status: 422
    end
  end

  # DELETE /study_records/:id
  def destroy
    @record.destroy
    render json: { status: :deleted }
  end

  private

  def set_record
    @record = current_user.study_records.find(params[:id])
  end

  def study_record_params
    params.require(:study_record).permit(:content, :subject_id, :date)
  end

end