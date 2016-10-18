defmodule Bookmarker.ApiBookmarkTagController do
  use Bookmarker.Web, :controller

  alias Bookmarker.BookmarkTag

  @doc """
  Creates a bookmark tag for given bookmark_id and tag_id
  """
  def create_bookmark_tag(conn, %{"bookmark_id" => bookmark_id, "tag_id" => tag_id}) do
    bookmark_tag_params = %{"bookmark_id" => bookmark_id, "tag_id" => tag_id}
    changeset = BookmarkTag.changeset(%BookmarkTag{}, bookmark_tag_params)

    case Repo.insert(changeset) do
      {:ok, bookmark_tag} ->
        render(conn, "new_bookmark_tag.json", bookmark_tag: bookmark_tag)
      {:error, changeset} ->
        render(conn, "create_error.json", errors: changeset.errors)
    end
  end

  @doc """
  Creates a bookmark tag for given bookmark_id and tag_id
  """
  def create_bookmark_tag(conn, _params) do
    render(conn, "create_error.json", error: %{title: "Invalid params", detail: "Missing bookmark_id or tag_id"})
  end

end