defmodule Bookmarker.ApiFolderView do
  use Bookmarker.Web, :view

  @doc """
  Returns JSON array of bookmarks in 
  http://jsonapi.org/ json api v1.0 format specification 
  """
  def render("bookmarks_for_folder.json", %{bookmarks: bookmarks}) do
    %{
      data: Enum.map(bookmarks, &bookmark_json/1)
    }
  end

  def bookmark_json(bookmark) do
    %{
      id: Integer.to_string(bookmark.id),
      type: "bookmark",
      attributes: %{
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description
      }
    }
  end
end