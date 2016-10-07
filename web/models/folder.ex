defmodule Bookmarker.Folder do
  use Bookmarker.Web, :model

  schema "folders" do
    field :name, :string
    field :description, :string
    has_many :bookmarks, Bookmarker.Bookmark

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :description])
    |> validate_required([:name])
  end

  @doc """
  Returns string representation of model
  """
  def to_s(folder) do
    folder.name
  end 
end
