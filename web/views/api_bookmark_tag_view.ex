defmodule Bookmarker.ApiBookmarkTagView do
  use Bookmarker.Web, :view

  @doc """
  Returns JSON object for newly created bookmark_tag
  http://jsonapi.org/ json api v1.0 format specification 
  """
  def render("new_bookmark_tag.json", %{bookmark_tag: bookmark_tag}) do
    %{
      data: bookmark_tag_json(bookmark_tag)
    }
  end

  @doc """
  Returns error response when 
  invalid params for creating bookmark_tag
  http://jsonapi.org/ json api v1.0 format specification 
  """
  def render("create_error.json", %{error: error}) do
    %{
      errors: [error]
    }
  end

  @doc """
  Returns error response when creating bookmark_tag fails
  http://jsonapi.org/ json api v1.0 format specification 
  """
  def render("create_error.json", %{errors: errors}) do
    %{
      errors: changeset_errors_to_json(errors)
    }
  end

  def bookmark_tag_json(bookmark_tag) do
    %{
      id: Integer.to_string(bookmark_tag.id),
      type: "bookmark_tag",
      attributes: %{
        bookmark_id: Integer.to_string(bookmark_tag.bookmark_id),
        tag_id: Integer.to_string(bookmark_tag.tag_id)
      }
    }
  end
  @doc """
  Takes changeset.errors and returns hash
  based on:
  http://www.thisisnotajoke.com/blog/2015/09/serializing-ecto-changeset-errors-to-jsonapi-in-elixir.html
  """
  def changeset_errors_to_json(errors) do
    Enum.map(errors, fn {field, detail} ->
      %{
        title: "Error creating bookmark_tag",
        code: field,
        detail:  to_string(field) <> " " <> to_string( render_detail(detail))
      }
    end)
  end
  @doc """
  Takes error detail hash message and converts to string
  http://www.thisisnotajoke.com/blog/2015/09/serializing-ecto-changeset-errors-to-jsonapi-in-elixir.html
  """
  def render_detail({message, values}) do
    Enum.reduce values, message, fn {k, v}, acc ->
      String.replace(acc, "%{#{k}}", to_string(v))
    end
  end
  @doc """
  Takes error detail string and returns it
  required because error detail might be either hash or string
  http://www.thisisnotajoke.com/blog/2015/09/serializing-ecto-changeset-errors-to-jsonapi-in-elixir.html
  """
  def render_detail(message) do
    message
  end
end