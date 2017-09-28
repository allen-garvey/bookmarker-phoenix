defmodule Bookmarker.ApiFolderController do
  use Bookmarker.Web, :controller

  alias Bookmarker.Folder

  @doc """
  Returns a list of bookmarks in a folder for a given folder name
  """
  def bookmarks_for_folder(conn, %{"folder_name" => folder_name}) do
    folder = Repo.get_by!(Folder, name: folder_name) |> Repo.preload([:bookmarks])
    
    render(conn, "bookmarks_for_folder.json", bookmarks: folder.bookmarks)
  end

end
