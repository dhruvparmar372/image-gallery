require 'rubygems'
require 'rmagick'
require 'fileutils'

CURRENT_PATH = Dir.pwd
PATH         = "#{CURRENT_PATH}/images/*.jpg"

#clean up previously generated thumbs
FileUtils.rm_rf('images/thumbs')
Dir.mkdir('images/thumbs')

Dir.glob(PATH) do |image_name|
  image = Magick::Image::read(image_name)[0]
  file_name = image_name.split("/").last
  if image.rows > 1500
  	factor = 0.15
  elsif image.rows > 1000
  	factor = 0.20
  elsif image.rows > 500
  	factor = 0.30
  else
  	factor = 1
  end
  
  thumb_name = "#{CURRENT_PATH}/images/thumbs/#{file_name.split('.').first}_thumb.jpg"
  image.thumbnail(factor).write(thumb_name)
end