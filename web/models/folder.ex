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
    |> unique_constraint(:name)
  end

  @doc """
  Returns string representation of model
  """
  def to_s(folder) do
    folder.name
  end 
  
  @doc """
  Returns all folders in Repo in sorted order
  """
  def all_in_order_query() do
    from(f in Bookmarker.Folder, order_by: f.name)
  end 

  @doc """
  Returns list of folders with name and id
  ordered in default order suitable for select fields
  for forms
  """
  def form_list(repo) do
    repo.all(all_in_order_query()) |> Enum.map(&{&1.name, &1.id})
  end
end
