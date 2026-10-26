require "test_helper"

class Api::FormatsControllerTest < ActionDispatch::IntegrationTest
  test "create accepts stringified format payload without raising NoMethodError" do
    payload = {
      name: "Stringified Format",
      height: 250,
      default: false
    }.to_json

    post "/api/formats.json", params: { format: payload }, as: :json

    assert_response :created
    json = JSON.parse(response.body)
    assert_equal "Stringified Format", json["name"]
    assert_equal 250, json["height"]
  end
end
