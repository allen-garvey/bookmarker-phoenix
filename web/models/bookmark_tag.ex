defmodule Bookmarker.BookmarkTag do
  use Bookmarker.Web, :model

  schema "bookmarks_tags" do
    belongs_to :bookmark, Bookmarker.Bookmark
    belongs_to :tag, Bookmarker.Tag

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:bookmark_id, :tag_id])
    |> validate_required([:bookmark_id, :tag_id])
    |> foreign_key_constraint(:bookmark_id)
    |> foreign_key_constraint(:tag_id)
    |> assoc_constraint(:bookmark) #validate existence
    |> assoc_constraint(:tag) #validate existence
    |> unique_constraint(:bookmark_tag_composite, name: :bookmark_tag_composite)
  end
end
