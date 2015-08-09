require 'rubygems'
require 'rmagick'
require 'pry'

PATH = "#{Dir.pwd}/images/*.jpg"

Dir.glob(PATH) do |image_name|
  image = Magick::Image::read(image_name)[0]
  if image.rows > 1500
  	factor = 0.15
  elsif image.rows > 1000
  	factor = 0.20
  elsif image.rows > 500
  	factor = 0.30
  else
  	factor = 1
  end
  frags = image_name.split(".")
  thumb_name = "#{frags.first(frags.size-1).join}_thumb.jpg"
  image.thumbnail(factor).write(thumb_name)
end