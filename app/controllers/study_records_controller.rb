class StudyRecordsController < ApplicationController
  before_action :set_record, only: [:show, :update, :destroy]

  # GET /study_records
  def index
    records = current_user.study_records.includes(:subject).order(created_at: :desc)
    render json: records
  end

  # GET /study_records/:id
  def show
    render json: @record
  end
  
  def create
    record = current_user.study_records.build(study_record_params)
    if record.save
      render json: StudyRecordSerializer.new(record).serializable_hash, status: :created
    else
      render json: { errors: record.errors.full_messages }, status: :unprocessable_entity
    end
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
    if @record.destroy
      head :no_content
    else
      render json: { errors: @record.errors.full_messages }, status: :unprocessable_entity
    end
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

  def pagination_meta(records)
    {
      current_page: records.current_page,
      total_pages: records.total_pages,
      total_count: records.total_count
    }
  end

end
