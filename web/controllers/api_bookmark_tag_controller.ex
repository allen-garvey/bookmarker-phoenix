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
        tag = Repo.get!(Bookmarker.Tag, bookmark_tag.tag_id)
        render(conn, "new_bookmark_tag.json", bookmark_tag: bookmark_tag, tag: tag)
      {:error, changeset} ->
        conn
        |> put_status(400)
        |> render("create_error.json", errors: changeset.errors)
    end
  end

  @doc """
  Called when necessary params are missing when calling create API
  """
  def create_bookmark_tag(conn, _params) do
    conn
    |> put_status(400)
    |> render("error.json", error: %{title: "Invalid params", detail: "Missing bookmark_id or tag_id"})
  end

  @doc """
  Deletes a bookmark_tag for given bookmark_tag_id
  """
  def delete_bookmark_tag(conn, %{"id" => id}) do
    bookmark_tag = Repo.get!(BookmarkTag, id) |> Repo.preload([:tag])

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(bookmark_tag)
    render(conn, "delete_bookmark_tag.json", bookmark_tag: bookmark_tag)
  end

  @doc """
  Called when necessary params are missing when calling delete API
  """
  def delete_bookmark_tag(conn, _params) do
    conn
    |> put_status(400)
    |> render("error.json", error: %{title: "Invalid params", detail: "No id given for bookmark_tag to delete"})
  end

end
