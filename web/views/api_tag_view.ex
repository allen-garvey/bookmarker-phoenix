defmodule Bookmarker.ApiTagView do
  use Bookmarker.Web, :view

  @doc """
  Returns JSON array of tags in 
  http://jsonapi.org/ json api v1.0 format specification 
  """
  def render("tags_for_bookmark.json", %{tags: tags}) do
    %{
      data: Enum.map(tags, &tag_json/1)
    }
  end

  def tag_json(tag) do
    %{
      id: Integer.to_string(tag.id),
      type: "tag",
      attributes: %{
        name: tag.name
      }
    }
  end
end