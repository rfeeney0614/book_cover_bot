require "test_helper"

class Api::FormatsControllerTest < ActionDispatch::IntegrationTest
  test "create accepts the payload the frontend submits" do
    payload = {
      format: { name: "New Format", height: 250, default: false },
      construction_mappings: [{ min_pages: 0, max_pages: 100, construction_model: 1 }]
    }

    assert_difference [-> { Format.count }, -> { ConstructionMapping.count }], 1 do
      post "/api/formats.json", params: payload, as: :json
    end

    assert_response :created
    json = JSON.parse(response.body)
    assert_equal "New Format", json["name"]
    assert_equal 250, json["height"]
    assert_equal 1, json["construction_mappings"].length
  end

  test "create returns validation errors for invalid mappings" do
    payload = {
      format: { name: "Bad", height: 250, default: false },
      construction_mappings: [{ min_pages: 50, max_pages: 10, construction_model: 1 }]
    }

    assert_no_difference "Format.count" do
      post "/api/formats.json", params: payload, as: :json
    end

    assert_response :unprocessable_entity
  end

  test "update replaces construction mappings" do
    format = Format.create!(name: "Upd", height: 200)
    format.construction_mappings.create!(min_pages: 0, max_pages: 50, construction_model: 1)

    put "/api/formats/#{format.id}.json",
        params: { format: { name: "Renamed", height: 210, default: false }, construction_mappings: [] },
        as: :json

    assert_response :success
    assert_equal "Renamed", format.reload.name
    assert_equal 0, format.construction_mappings.count
  end

  test "destroy removes format and its mappings" do
    format = Format.create!(name: "Del", height: 200)
    format.construction_mappings.create!(min_pages: 0, max_pages: 50, construction_model: 1)

    assert_difference [-> { Format.count }, -> { ConstructionMapping.count }], -1 do
      delete "/api/formats/#{format.id}.json"
    end

    assert_response :no_content
  end

  test "destroy is rejected when covers use the format" do
    format = formats(:one)
    assert_no_difference "Format.count" do
      delete "/api/formats/#{format.id}.json"
    end

    assert_response :unprocessable_entity
  end

  test "patch with only default flag sets default" do
    format = Format.create!(name: "Def", height: 200)

    patch "/api/formats/#{format.id}", params: { format: { default: true } }, as: :json

    assert_response :success
    assert format.reload.default
  end
end
