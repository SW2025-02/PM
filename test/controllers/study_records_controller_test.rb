require "test_helper"

class StudyRecordsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get study_records_index_url
    assert_response :success
  end

  test "should get show" do
    get study_records_show_url
    assert_response :success
  end

  test "should get update" do
    get study_records_update_url
    assert_response :success
  end

  test "should get destroy" do
    get study_records_destroy_url
    assert_response :success
  end
end
