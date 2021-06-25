require "test_helper"

class TetrisControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get tetris_index_url
    assert_response :success
  end

  test "should get select_mode" do
    get tetris_select_mode_url
    assert_response :success
  end

  test "should get operate_mode" do
    get tetris_operate_mode_url
    assert_response :success
  end
end
