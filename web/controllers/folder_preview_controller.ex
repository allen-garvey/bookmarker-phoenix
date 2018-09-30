defmodule Bookmarker.FolderPreviewController do
  use Bookmarker.Web, :controller

  alias Bookmarker.Folder
  alias Bookmarker.ImgElement

  @doc """
  Show preview images for bookmarks in folder
  """
  def show(conn, %{"folder_name" => folder_name}) do
    HTTPoison.start
    folder = Repo.get_by!(Folder, name: folder_name) |> Repo.preload([:bookmarks])
    filtered_bookmarks = folder.bookmarks |> Enum.filter(&should_bookmark_be_previewed/1) 
    preview_results = filtered_bookmarks
                        |> Enum.filter(&should_bookmark_be_previewed/1)
                        |> pmap(&img_for_bookmark/1) 
                        |> Enum.zip(filtered_bookmarks)
                        |> Enum.filter(&does_bookmark_have_img/1)

    render(conn, "show.html", folder: folder, preview_results: preview_results)
  end

  def should_bookmark_be_previewed(bookmark) do
    !is_nil(bookmark.preview_image_selector)
  end

  def does_bookmark_have_img({img, _bookmark}) do
    !is_nil(img)
  end

  def img_for_bookmark(bookmark) do
    bookmark |>
    url_for_bookmark |>
    html_body |>
    extract_img_html(bookmark.preview_image_selector, bookmark.url)
  end

  def url_for_bookmark(bookmark) do 
    case bookmark.rss_url do
      nil -> bookmark.url
      _ -> bookmark.rss_url
    end
  end

  def html_body(url) do
    case HTTPoison.get(url) do
        {:ok, resp} ->
            resp.body
        {:error, _error} ->
            nil
    end
  end


  def extract_img_html(nil, _selector, _base_url) do
    nil
  end

  def extract_img_html(body, selector, base_url) do
    img = Floki.find(body, selector) |> get_first_safe
    url = img |> Floki.attribute(url_attribute_for_img_selector(selector)) |> get_first_safe |> to_absolute_url(base_url)
    title = img |> Floki.attribute("title") |> get_first_safe
    alt = img |> Floki.attribute("alt") |> get_first_safe
    %ImgElement{url: url, title: title, alt: alt}
  end

  def url_attribute_for_img_selector("meta[property='og:image']") do
    "content"
  end

  def url_attribute_for_img_selector(_selector) do
    "src"
  end

  def to_absolute_url(url, base_url) do
    cond do
      String.starts_with?(url, "//") -> url
      Regex.match?(~r/^https?:\/\//, url) -> url
      true -> URI.merge(base_url, url) |> URI.to_string
    end
  end
  
  def get_first_safe(x) when is_list(x) do
    case x do 
      [] -> ""
      _ -> hd(x)
    end
  end
  
  def get_first_safe(x) do
    x
  end
  
  def pmap(collection, func) do
    collection
    |> Enum.map(&(Task.async(fn -> func.(&1) end)))
    |> Enum.map(&Task.await/1)
  end

end
