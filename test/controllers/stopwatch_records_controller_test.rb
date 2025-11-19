require "test_helper"

class StopwatchRecordsControllerTest < ActionDispatch::IntegrationTest
  test "should get start" do
    get stopwatch_records_start_url
    assert_response :success
  end

  test "should get pause" do
    get stopwatch_records_pause_url
    assert_response :success
  end

  test "should get resume" do
    get stopwatch_records_resume_url
    assert_response :success
  end

  test "should get status" do
    get stopwatch_records_status_url
    assert_response :success
  end

  test "should get finish" do
    get stopwatch_records_finish_url
    assert_response :success
  end
end
