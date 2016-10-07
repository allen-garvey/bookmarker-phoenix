defmodule Bookmarker.Bookmark do
  use Bookmarker.Web, :model

  schema "bookmarks" do
    field :title, :string
    field :url, :string
    field :description, :string
    belongs_to :folder, Bookmarker.Folder

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
end
