defmodule Bookmarker.ApiTagController do
  use Bookmarker.Web, :controller

  alias Bookmarker.Tag

  @doc """
  Returns list of tags with name and id
  that are NOT associated with a given bookmark, identified by bookmark_id
  Used to give a list of tags that may be added to a given bookmark
  """
  def unused_tags_for_bookmark(conn, %{"bookmark_id" => bookmark_id}) do
    used_tags_subquery = Repo.all(from(bt in Bookmarker.BookmarkTag, where: bt.bookmark_id == ^bookmark_id, select: bt.tag_id))
    query = from(t in Tag, where: not (t.id in ^used_tags_subquery))
    unused_tags = Repo.all(query)
    render(conn, "tags.json", tags: unused_tags)
  end

end
