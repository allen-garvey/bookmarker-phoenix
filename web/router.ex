defmodule Bookmarker.Router do
  use Bookmarker.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Bookmarker do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    resources "/folders", FolderController
    resources "/bookmarks", BookmarkController
    resources "/tags", TagController
    resources "/bookmarks_tags", BookmarkTagController
  end

  #JSON API
  scope "/api", Bookmarker do
    pipe_through :api

    get "/tags/bookmark/:bookmark_id/unused", ApiTagController, :unused_tags_for_bookmark
    post "/bookmarks_tags/", ApiBookmarkTagController, :create_bookmark_tag
  end

  # Other scopes may use custom stacks.
  # scope "/api", Bookmarker do
  #   pipe_through :api
  # end
end
