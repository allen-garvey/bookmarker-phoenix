defmodule Bookmarker.SharedView do
  use Bookmarker.Web, :view

  def pluralize_and_capitalize(string) do
  	String.capitalize(string) <> "s"
  end
end