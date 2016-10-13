defmodule Bookmarker.Bookmark do
  use Bookmarker.Web, :model

  schema "bookmarks" do
    field :title, :string
    field :url, :string
    field :description, :string
    belongs_to :folder, Bookmarker.Folder
    many_to_many :tags, Bookmarker.Tag, join_through: "bookmarks_tags"

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :url, :description, :folder_id])
    |> validate_required([:title, :url, :folder_id])
    |> foreign_key_constraint(:folder_id)
    |> assoc_constraint(:folder) #validate folder exists
  end

  @doc """
  Returns all bookmarks in Repo in sorted order
  """
  def all_in_order_query() do
    from(b in Bookmarker.Bookmark, order_by: b.title)
  end 

  @doc """
  Returns list of bookmarks with title and id
  ordered in default order suitable for select fields
  for forms
  """
  def form_list(repo) do
    repo.all(Bookmarker.Bookmark.all_in_order_query()) |> Enum.map(&{&1.title, &1.id})
  end
end
